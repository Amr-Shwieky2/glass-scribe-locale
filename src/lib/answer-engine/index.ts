/**
 * Layer 1 of the website assistant: our own answer engine. No AI company, no
 * API key, no external calls — it runs on our server in a few milliseconds.
 *
 * For each visitor message:
 *  1. normalize (niqqud, diacritics, prefixes, synonyms, typos — via the search tokenizer)
 *  2. detect the language from the message itself (then the conversation, then the page)
 *  3. rule-based intents: greeting/thanks, complaint, out-of-scope, quote request,
 *     city coverage, opening hours, contact, price
 *  4. search the knowledge base (src/data/knowledge) with a confidence score:
 *     high → answer; medium → "Did you mean…?"; low → hand-off (Layer 2/3)
 * A short follow-up ("and for 10 mm?") is searched together with the previous question.
 */
import { ASSISTANT_REPLIES } from '@/data/assistant-replies';
import { getEntry, type KnowledgeEntry } from '@/data/knowledge';
import { LOCATIONS, type LocationKey } from '@/data/locations';
import type { SupportedLocale } from '@/data/types';
import type { AssistantReply, ChatTurn, QuoteProduct, ReplyAction } from '@/lib/chat-protocol';
import { normalizeText } from '@/lib/search/normalize';
import { conversationLanguage } from '@/lib/search/retrieve';
import { THRESHOLDS } from './config';
import { cityAnswer, contactAnswer, hoursAnswer } from './generated';
import {
  findCity, isCityQuestion, isComplaint, isContactQuestion, isHoursQuestion, isPriceQuestion,
  acknowledgement, looksOutOfScope, offeredQuote, quoteRequest, readMessage, smallTalk, withoutGreeting, type MessageText,
} from './intents';
import { messageConcepts, searchKnowledge, textUnits, unknownShare, type Match } from './kb-index';
import { pageLinks } from './pages';

export { searchKnowledge } from './kb-index';

/** Ids of the entries whose replies are built from live data. */
export const GENERATED_IDS = { hours: 'contact-hours', contact: 'contact-details', city: 'areas-city' } as const;

export interface EngineResult extends AssistantReply {
  /** Knowledge base confidence of the best match (0–1). */
  confidence: number;
  /** Why there is no answer (kind "none"). */
  /** Why there's no direct answer: nothing matched well, off-topic, or only the general price reply. */
  reason?: 'low-confidence' | 'out-of-scope' | 'price-general';
}

export interface EngineInput {
  message: string;
  pageLocale: SupportedLocale;
  /** Earlier turns of the conversation (for follow-ups and the language). */
  history?: ChatTurn[];
}

const PRODUCT_TOPICS = new Set<KnowledgeEntry['topic']>(['showers', 'railings', 'mirrors', 'storefronts', 'partitions', 'other-products', 'glass-types', 'prices', 'process']);
const CONTACT_TOPICS = new Set<KnowledgeEntry['topic']>(['contact', 'warranty', 'service-areas']);

const PRODUCT_CONCEPTS: [RegExp, QuoteProduct][] = [
  [/^~(shower|showers|shower-enclosure)/, 'shower'],
  [/^~(railing|railings|balustrade)/, 'railing'],
  [/^~(mirror|mirrors)/, 'mirror'],
  [/^~(storefront|shopfront|shop-front|vitrine|showcase)/, 'storefront'],
  [/^~(partition|partitions|divider)/, 'partition'],
  [/^~(door|doors|glass-door)/, 'door'],
  [/^~(backsplash|splashback)/, 'backsplash'],
  [/^~(shelf|shelves)/, 'shelf'],
];

function productIn(concepts: Set<string>): QuoteProduct | undefined {
  for (const c of concepts) for (const [re, product] of PRODUCT_CONCEPTS) if (re.test(c)) return product;
  return undefined;
}

const contentWords = (text: string) => textUnits(text).filter((u) => !u[0].startsWith('~')).length;

/** Synonym concepts for places (cities have their own "~city-…" concepts). */
const PLACE_CONCEPTS = /^~(region|village|far|nationwide|location)$/;

/** Synonym concepts that don't make a message about glass or our services by themselves. */
const GENERIC_CONCEPTS = /^~(time|human|contact|repair|clean|city-.*)$/;

/**
 * Synonym concepts that tie a message to us only loosely when much of it is words we never use:
 * "how much is a flight to Eilat?", "do you have glass for eyeglasses?" (see THRESHOLDS.weakAnchorUnknown).
 */
const WEAK_CONCEPTS = /^~(price|glass|install)$/;

/**
 * Whether a message talks about our domain (a product, material, service, price,
 * warranty…): without such an anchor only a confident match is answered and no
 * "Did you mean…?" is offered, so off-topic messages ("who won the game?") aren't
 * matched on stray words. `unknown`: the message's share of words the knowledge base never uses.
 */
const isAnchored = (concepts: Set<string>, unknown = 0) =>
  [...concepts].some((c) => !GENERIC_CONCEPTS.test(c) && (!WEAK_CONCEPTS.test(c) || unknown < THRESHOLDS.weakAnchorUnknown));

function entryActions(entry: KnowledgeEntry): ReplyAction[] {
  if (entry.generated === 'contact' || entry.generated === 'hours') return ['whatsapp', 'call'];
  if (entry.generated === 'city') return ['quote', 'whatsapp']; // its text ends with "Would you like a free quote?"
  if (PRODUCT_TOPICS.has(entry.topic)) return ['quote'];
  if (CONTACT_TOPICS.has(entry.topic)) return ['whatsapp'];
  return [];
}

/** The reply for one knowledge base entry (generated entries are built from live data). */
export function answerFromEntry(
  entry: KnowledgeEntry,
  lang: SupportedLocale,
  opts: { confidence?: number; city?: LocationKey; cityKnown?: boolean } = {},
): EngineResult {
  const text =
    entry.generated === 'hours' ? hoursAnswer(lang)
    : entry.generated === 'contact' ? contactAnswer(lang)
    : entry.generated === 'city' ? cityAnswer(lang, opts.city, opts.cityKnown)
    : entry.answer[lang];
  const links = entry.generated === 'city' && opts.city ? [`/${opts.city}`, ...entry.links] : entry.links;
  const cityPrefill = entry.generated === 'city' && opts.city ? { quotePrefill: { city: LOCATIONS[opts.city].name[lang] } } : {};
  return {
    ...cityPrefill,
    kind: 'answer',
    lang,
    text,
    links: pageLinks([...new Set(links)].slice(0, 3), lang),
    suggestions: entry.relatedIds
      .map((id) => getEntry(id))
      .filter((e): e is KnowledgeEntry => !!e)
      .slice(0, THRESHOLDS.maxRelated)
      .map((e) => ({ id: e.id, question: e.question[lang] })),
    actions: entryActions(entry),
    entryId: entry.id,
    layer: 1,
    confidence: opts.confidence ?? 1,
  };
}

/** A "Did you mean" / related-question click: that entry's answer, if it is approved. */
export function answerEntry(id: string, lang: SupportedLocale): EngineResult | null {
  const entry = getEntry(id);
  return entry ? answerFromEntry(entry, lang) : null;
}

/** Generated reply when the entry for it isn't in the knowledge base. */
function generatedReply(kind: keyof typeof GENERATED_IDS, lang: SupportedLocale, city?: LocationKey, cityKnown = false): EngineResult {
  const entry = getEntry(GENERATED_IDS[kind]);
  if (entry) return answerFromEntry(entry, lang, { city, cityKnown });
  const text = kind === 'hours' ? hoursAnswer(lang) : kind === 'contact' ? contactAnswer(lang) : cityAnswer(lang, city, cityKnown);
  return {
    kind: 'answer', lang, text, layer: 1, confidence: 1, entryId: GENERATED_IDS[kind],
    links: pageLinks(city ? [`/${city}`, '/contact'] : ['/contact'], lang),
    actions: kind === 'city' ? ['quote', 'whatsapp'] : ['whatsapp', 'call'],
  };
}

function noAnswer(lang: SupportedLocale, reason: 'low-confidence' | 'out-of-scope', confidence: number): EngineResult {
  return {
    kind: 'none',
    lang,
    text: reason === 'out-of-scope' ? ASSISTANT_REPLIES.outOfScope[lang] : ASSISTANT_REPLIES.notSure[lang],
    actions: ['quote', 'whatsapp', 'call'],
    layer: 3,
    confidence,
    reason,
  };
}

function quoteReply(lang: SupportedLocale, m: MessageText, concepts: Set<string>, text: string, confidence: number): EngineResult {
  const city = findCity(m, concepts);
  return {
    kind: 'quote',
    lang,
    text,
    startQuote: true,
    quotePrefill: { product: productIn(concepts), ...(city?.slug ? { city: LOCATIONS[city.slug].name[lang] } : {}) },
    layer: 3,
    confidence,
  };
}

/** "We work all over Israel / in every region / in small towns": the city reply says the same, plus the city. */
const COVERAGE_IDS = new Set(['areas-all-israel', 'areas-regions', 'areas-small-towns']);

/**
 * The best match, if it is a clear winner over the runner-up (see config.ts).
 * Unanchored messages need high confidence and at least two content words ("ok" is not a question).
 * A long message (the visitor's situation first, then the question) spreads its weight over many
 * words, so even the right answer covers less of it and the runner-up comes closer: it needs a smaller lead.
 */
function clearWinner(matches: Match[], anchored = true, words = Infinity, long = false): Match | null {
  const [top, second] = matches;
  if (!top) return null;
  if (!anchored && words < THRESHOLDS.unanchoredMinWords) return null;
  const lead = top.confidence - (second?.confidence ?? 0);
  if (top.confidence >= THRESHOLDS.answer && lead >= THRESHOLDS.margin) return top;
  const marginLow = long ? THRESHOLDS.marginLowLong : THRESHOLDS.marginLow;
  if (anchored && !top.offProduct && top.confidence >= THRESHOLDS.answerLow && lead >= marginLow) return top;
  return null;
}

// A short message that continues the previous question ("and for 10 mm?", "ומה עם מראות?", "а для балкона?")
const FOLLOW_UP_START = /^(and|what about|how about|also|ומה|ואם|וגם|וכמה|ואיך|ול|וב|وشو|وكم|وكيف|طيب و|و|а |и |а если|а как|а для|а сколько)/i;

export function answerMessage({ message, pageLocale, history = [] }: EngineInput): EngineResult {
  const visitorTexts = [...history.filter((t) => t.role === 'user').map((t) => t.content), message];
  let lang = conversationLanguage(visitorTexts, pageLocale);
  const full = readMessage(message);

  const talk = smallTalk(full);
  if (talk) {
    return { kind: 'smalltalk', lang, text: ASSISTANT_REPLIES[talk][lang], actions: talk === 'greeting' ? ['quote'] : [], layer: 1, confidence: 1 };
  }

  // "yes" / "ok" / "no" answer the assistant's own last question
  const ack = acknowledgement(full);
  if (ack) {
    const lastAssistant = history.filter((t) => t.role === 'assistant').at(-1)?.content ?? '';
    if (ack === 'yes' && offeredQuote(lastAssistant)) return quoteReply(lang, full, new Set(), ASSISTANT_REPLIES.quoteStart[lang], 1);
    return { kind: 'smalltalk', lang, text: ASSISTANT_REPLIES[ack === 'yes' ? 'ackYes' : 'ackNo'][lang], actions: [], layer: 1, confidence: 1 };
  }

  const text = withoutGreeting(message).trim() || message;
  const m = readMessage(text);
  const concepts = messageConcepts(text, lang);

  if (isComplaint(m)) {
    return { kind: 'smalltalk', lang, text: ASSISTANT_REPLIES.complaint[lang], actions: ['whatsapp', 'call'], layer: 3, confidence: 1 };
  }
  if (looksOutOfScope(m)) return noAnswer(lang, 'out-of-scope', 0);
  const quote = quoteRequest(m);
  if (quote === 'strong') return quoteReply(lang, m, concepts, ASSISTANT_REPLIES.quoteStart[lang], 1);

  // Latin text on the Hebrew/Arabic/Russian site may be transliteration ("kam si3r", "mikla7on"):
  // keep the page language when its knowledge base matches better than the English one
  let matches = searchKnowledge(text, lang, 6);
  if (lang === 'en' && pageLocale !== 'en' && !/[^\u0000-\u024F\s\p{P}\p{N}\p{S}]/u.test(text)) {
    const own = searchKnowledge(text, pageLocale, 6);
    if ((own[0]?.confidence ?? 0) > (matches[0]?.confidence ?? 0) + THRESHOLDS.margin) {
      lang = pageLocale;
      matches = own;
    }
  }

  // A short follow-up ("and for 10 mm?") is also searched together with the previous question —
  // only when it continues it: it names something itself, has a number, or starts like a follow-up
  const words = contentWords(text);
  const ownAnchored = isAnchored(concepts, unknownShare(text, lang));
  const previous = history.filter((t) => t.role === 'user').at(-1)?.content;
  let combinedUsed = false;
  const continues = ownAnchored || /\d/.test(text) || FOLLOW_UP_START.test(normalizeText(text).trim());
  if (previous && words <= THRESHOLDS.followUpWords && continues && !clearWinner(matches, ownAnchored, words)) {
    const combined = searchKnowledge(`${previous} ${text}`, lang, 6);
    if ((combined[0]?.confidence ?? 0) > (matches[0]?.confidence ?? 0)) {
      matches = combined;
      combinedUsed = true;
    }
  }
  const city = findCity(m, concepts);
  const place = !!city || [...concepts].some((c) => PLACE_CONCEPTS.test(c));
  // The city entry's paraphrases name towns: without a place or a "do you work in…" question,
  // matching one of those words is a coincidence ("מראה עם נשר" — an eagle, and a town)
  if (!place && !isCityQuestion(m)) matches = matches.filter((x) => x.entry.generated !== 'city');
  const best = matches[0]?.confidence ?? 0;
  const anchored = ownAnchored || (combinedUsed && isAnchored(messageConcepts(previous ?? '')));
  const long = words >= THRESHOLDS.longWords;
  const winner = clearWinner(matches, anchored, combinedUsed ? Infinity : words, long);

  // "Do you work in <city>?" — "do you work in…" alone is not enough ("…in small bathrooms?"):
  // it needs a place, or nothing else in the message that the question could be about.
  // A short message naming a city counts only if it asks nothing else ("shower price Haifa" is a price question).
  const aboutSomethingElse = [...concepts].some((c) => !GENERIC_CONCEPTS.test(c) && !PLACE_CONCEPTS.test(c) && !c.startsWith('~city-') && c !== '~install');
  const cityQuestion =
    (isCityQuestion(m) && (place || !aboutSomethingElse)) ||
    (!!city && words <= THRESHOLDS.cityOnlyWords && !aboutSomethingElse);
  // A specific service-areas entry ("is the measurement free in Eilat?") beats the city reply when the message
  // asks about that too; a general coverage one doesn't when a city is named ("do you come to Netanya?" is not
  // the sea-air entry, even though its wording names coastal towns)
  const specificAreaWinner =
    !!winner && winner.entry.topic === 'service-areas' && !winner.entry.generated && !(city && (COVERAGE_IDS.has(winner.entry.id) || !aboutSomethingElse));
  if (cityQuestion && !specificAreaWinner) {
    return { ...generatedReply('city', lang, city?.slug, !!city), confidence: Math.max(best, 0.9) };
  }

  if (winner) return answerFromEntry(winner.entry, lang, { confidence: winner.confidence, city: city?.slug, cityKnown: !!city });

  if (isHoursQuestion(m)) return { ...generatedReply('hours', lang), confidence: Math.max(best, 0.9) };
  if (isContactQuestion(m)) {
    // "I'd rather talk to a real person" is the human entry, not only our phone number
    const contactEntry = matches[0]?.entry.topic === 'contact' ? clearWinner(matches, true, words, long) : null;
    if (contactEntry) return answerFromEntry(contactEntry.entry, lang, { confidence: contactEntry.confidence });
    return { ...generatedReply('contact', lang), confidence: Math.max(best, 0.9) };
  }
  if (quote === 'maybe') return quoteReply(lang, m, concepts, ASSISTANT_REPLIES.quoteStart[lang], best);

  const options = anchored ? matches.filter((x) => x.confidence >= THRESHOLDS.suggest).slice(0, THRESHOLDS.maxSuggestions) : [];
  if (options.length) {
    return {
      kind: 'suggest',
      lang,
      text: ASSISTANT_REPLIES.didYouMean[lang],
      suggestions: options.map((x) => ({ id: x.entry.id, question: x.entry.question[lang] })),
      actions: ['quote'],
      layer: 1,
      confidence: best,
    };
  }

  if (isPriceQuestion(m)) return { ...quoteReply(lang, m, concepts, ASSISTANT_REPLIES.priceGeneral[lang], best), reason: 'price-general' };
  return noAnswer(lang, 'low-confidence', best);
}
