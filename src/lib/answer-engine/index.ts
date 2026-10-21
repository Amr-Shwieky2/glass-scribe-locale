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
import { normalizeText, splitWords } from '@/lib/search/normalize';
import { phraseSpans, processTerm, stems } from '@/lib/search/tokenize';
import { conversationLanguage } from '@/lib/search/retrieve';
import { THRESHOLDS } from './config';
import { cityAnswer, contactAnswer, hoursAnswer } from './generated';
import {
  aboutSomeoneElse, aboutTheTeam, asksIfOurs, asksScratchRepair, asksStatus, callFromNumber, chatWord, cityQuestion as coverageQuestion, existenceQuestion, findCity, foreignSubject, hasPhoneNumber,
  asksHow, asksIfWeDo, asksIfWeMake, asksRemoval, isComplaint, isContactQuestion, isDescriptor, isHoursQuestion, isOnePremises, isPremisesWord, isPriceQuestion, isRemark, mentionsTheBot,
  namesRequestSubject, offersServices, onlyWithoutGlass, photoIsTheMeans, plainWindow, sellsToTrade, onlyPlace, otherMeaningQuoteWords, pastCall,
  PLACE_CONCEPT, seeksProfessional,
  acknowledgement, declinedRequest, looksOutOfScope, speaksToUs, namesOwnArea, offeredQuote, quoteRequest, readMessage, requestWord, smallTalk, wantsSomething, withoutGreeting, withoutIntroduction,
  type MessageText,
} from './intents';
import { PRODUCT_CONCEPTS as PRODUCT_TOKENS, WEAK_CONCEPTS, entryUncoveredShare, messageConcepts, searchKnowledge, textUnits, unknownShare, type Match, type Unit } from './kb-index';
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

// (numbers and sizes don't count: "מקלחון 90 על 90" is one word)
const contentWords = (text: string) => textUnits(text).filter((u) => !u[0].startsWith('~') && !/^\d+([x×х*]\d+)*$/u.test(u[0])).length;

/**
 * Where or when something is, not what it is: rooms and premises, days and hours, leaks and renovations. They
 * don't tell which product a message is about ("yoga classes in haifa", "my roof is leaking", "בתי שימוש").
 */
const CONTEXT_CONCEPTS = /^~(bathroom|kitchen|shop|office|gym|leak|weekend|hours|holiday|after-hours|location|renovation|payment|message|photo|reviews|experience|contractor|plans|production|free|measure|small|custom|coastal|entrance|uneven)$/;

/** Synonym concepts that don't make a message about glass or our services by themselves. */
const GENERIC_CONCEPTS = /^~(time|emergency|human|contact|repair|clean|holiday|lifespan|weight|validity|change|existing-wall|dimension|city-.*)$/;

/**
 * How long something lasts, what it weighs, how long an offer is valid: a message that asks it is answered only by an
 * entry about it ("how long does a glass railing last" is not the installation time, "how much does a railing weigh"
 * not its price, "הצעת המחיר יכולה להשתנות אחרי המדידה?" not the free quote). The warranty has a duration and a validity
 * of its own.
 */
const STRICT_SUBJECTS = /^~(lifespan|weight|validity|change|dimension)$/;

/** Product types (a walk-in or a sliding shower): what a product is, not what the message asks about it. */
const PRODUCT_TYPES = /^~(walk-in|sliding|hinged|frameless|framed)$/;

/** Rooms: where a product goes, not what the message asks about it (unless the entry is about that room). */
const ROOM_CONCEPTS = /^~(bathroom|kitchen|shop|office|gym|balcony|stairs)$/;

/**
 * Concepts that tie a message to us only loosely: price, cheap, glass and install words (WEAK_CONCEPTS), and
 * region words ("בצפון", "a village"). "How much is a flight to Eilat?", "the war in the north" are not ours.
 */
const isLoose = (c: string) => WEAK_CONCEPTS.has(c) || /^~(region|village|far|nationwide)$/.test(c);

/**
 * Names something we make or do (a product, a glass type, a finish, the warranty…) — not only the request ("a quote",
 * "a call back", "how much"), a place or a time ("I need a quote for a website design" doesn't), nor only a loose word
 * (glass and installation are also a jacuzzi's, a vase's: "כמה עולה התקנת ג'קוזי", "quote for a glass vase"), a room or
 * premises ("بدي عرض سعر لبلاط الحمام"), the stairs or tiles (we make the railing and the glass, not those). A balcony
 * counts: it is where our railings go ("הצעת מחיר למרפסת").
 */
const REQUEST_ONLY = /^~(quote|price|cheap|per-meter|discount|contact|human|message|measure|city-.*|region|village|far|nationwide|location|time|hours|weekend|holiday)$/;
const ourWork = (c: string) =>
  !REQUEST_ONLY.test(c) && !GENERIC_CONCEPTS.test(c) && !isLoose(c) && (c === '~balcony' || (!CONTEXT_CONCEPTS.test(c) && !ROOM_CONCEPTS.test(c))) && c !== '~tiles';
function aboutOurWork(concepts: Set<string>): boolean {
  return [...concepts].some(ourWork);
}

/**
 * A word that says what a message is about — not the request or how it is put (see chatWord), a place, a time
 * ("in the evening"), a number, or a loose glass or install word: "ההלוואה" in "תתקשרו אליי לגבי ההלוואה", "boiler" in
 * "how much does it cost to install a boiler".
 */
const subjectUnit = (u: Unit) => !chatWord(u) && !/^\d/.test(u[0]) && !u.some((v) => REQUEST_ONLY.test(v) || v === '~after-hours' || WEAK_CONCEPTS.has(v));
const subjectUnits = (text: string) => textUnits(text).filter(subjectUnit);

/**
 * A quote, measurement or callback request about our work: it names it (see ourWork), or nothing but the request,
 * places, times and loose glass/install words ("call me back, I'm in Haifa", "call me about the installation") — or,
 * in a bare callback, one word the knowledge base doesn't use: a name ("דני 0541234567"). A subject of its own is not
 * ours to start: "תתקשרו אליי לגבי ההלוואה", "a quote for laminate", "нужен замер давления", "call me 052… about a pizza order".
 */
function quoteAboutUs(text: string, m: MessageText, lang: SupportedLocale): boolean {
  if (aboutOurWork(messageConcepts(text, lang))) return true;
  const rest = subjectUnits(text);
  if (!rest.length) return true;
  return rest.length <= THRESHOLDS.quoteRestWords && !namesRequestSubject(m) && rest.every((u) => unknownShare(u[0], lang) === 1);
}

/** The entries of our contact details (the generated reply and the ways to reach us). */
const CONTACT_IDS = ['contact-details', 'contact-human', 'contact-whatsapp', 'contact-email-plans'];
const NOT_ANOTHER_PARTY = /^~(city-.*|region|village|far|nationwide|location|time|hours|weekend|after-hours|holiday|office)$/;
/**
 * Our hours and contact details (generated or from a contact entry) answer a message about us: one that speaks to us
 * ("your", "שלכם", "عندكم") or about this chat ("די עם הבוט"), or whose words occur in one of these entries — but for how it
 * is put, places, times, a shop or an office ("store hours") and our own work, at most THRESHOLDS.maxGeneratedUncovered
 * of them may not. "שעות פתיחה של חדר הכושר", "رقم تلفون العيادة", "מה המספר של מוקד 106", "מסעדות פתוחות בשבת" name another
 * place, office or company, often in words the knowledge base knows (so the unknown share doesn't tell). A long message
 * tells its situation first ("…אני יוצא מהעבודה רק בחמש וחצי").
 */
function aboutUsOnly(text: string, m: MessageText, lang: SupportedLocale, ids: string[]): boolean {
  if (speaksToUs(m) || mentionsTheBot(m)) return true;
  // (shops in general are not ours: "חנויות פתוחות בשישי")
  const explained = (u: Unit) => chatWord(u) || isOnePremises(u[0]) ||
    (!isPremisesWord(u[0]) && u.some((c) => c.startsWith('~') && (ourWork(c) || WEAK_CONCEPTS.has(c) || NOT_ANOTHER_PARTY.test(c))));
  const max = contentWords(text) >= THRESHOLDS.longWords ? THRESHOLDS.maxEntryUncoveredLong : THRESHOLDS.maxGeneratedUncovered;
  return Math.min(...ids.map((id) => entryUncoveredShare(text, lang, id, explained))) <= max;
}

/**
 * How a message is tied to our domain (a product, material, service, price, warranty…):
 * - "strong": a concept that is ours (a product, "warranty", "tempered"…);
 * - "weak": only loose ones (see isLoose), and most of the message is words the knowledge base uses
 *   (`unknown`: the share of words it never uses, see THRESHOLDS.weakAnchorUnknown);
 * - null: off-domain — only a confident match is answered and no "Did you mean…?" is offered,
 *   so off-topic messages ("who won the game?") aren't matched on stray words.
 */
type Anchor = 'strong' | 'weak' | null;
function anchorOf(concepts: Set<string>, unknown = 0): Anchor {
  const own = [...concepts].filter((c) => !GENERIC_CONCEPTS.test(c));
  if (own.some((c) => !isLoose(c))) return 'strong';
  return own.length && unknown < THRESHOLDS.weakAnchorUnknown ? 'weak' : null;
}

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

/** `concepts`: the message's own words' concepts — not those of typos, so a guess never prefills the form. */
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

/**
 * Products a text names, not counting a shop or a store as premises ("магазин одежды", "יש לכם חנות?": a shop, not a
 * shop front — "חזית לחנות", "shop front" still name one).
 */
function namedProducts(text: string): Set<string> {
  return new Set(textUnits(text).filter((u) => !isPremisesWord(u[0])).flat().filter((c) => PRODUCT_TOKENS.has(c)));
}

/** Words of a text that are part of a product's name in several words ("חלונות ראווה", "shop window"), normalized. */
function productPhraseWords(text: string): Set<string> {
  const words = splitWords(normalizeText(text));
  return new Set(phraseSpans(words).filter((sp) => PRODUCT_TOKENS.has(sp.concept)).flatMap((sp) => words.slice(sp.from, sp.to)));
}

/** Only the product's name, a shop it is for and words that describe it ("חלון ראווה לחנות", "shop window for my store", "חלון ראווה חדש"). */
function onlyTheProduct(text: string): boolean {
  const phrase = productPhraseWords(text);
  return textUnits(text).every((u) => u[0].startsWith('~') || phrase.has(u[0]) || u.some((v) => PRODUCT_TOKENS.has(v)) || isPremisesWord(u[0]) || isDescriptor(u[0]) || chatWord(u));
}

const productsNamedIn = (text: string) => namedProducts(text);

/** Asks about something of ours besides the visitor's own trade: a product, a glass type, a price, a quote… */
const asksOurs = (concepts: Set<string>) => [...concepts].some((c) => !GENERIC_CONCEPTS.test(c) && !/^~(glazier|experience|glass|install)$/.test(c));

/** About something we don't make (see foreignSubject), given the message's text and concepts. */
function foreignIn(m: MessageText, concepts: Set<string>, text: string): boolean {
  const products = namedProducts(text);
  return foreignSubject(m, concepts.has('~glass') && !onlyWithoutGlass(m), products.size > 0, {
    acoustic: concepts.has('~acoustic'), backsplash: concepts.has('~backsplash'), productBesidesDoor: [...products].some((c) => c !== '~door'), door: products.has('~door'),
  });
}

/**
 * "Do you do / have / install <product>?" with nothing else asked: the entry that gives the product's overview (what
 * we make, where), not a narrow sibling ("אתם עושים מעקות?" is not the stairs railing entry, "יש לכם מראות?" not the
 * anti-fog one). A product without such an entry gets "Did you mean…?" with its own entries. `rooms`: rooms the
 * product's name often includes ("חיפוי למטבח", "a shower for the bathroom", "balcony railings").
 */
const PRODUCT_OVERVIEW: Record<string, { id?: string; rooms?: string[] }> = {
  '~railing': { id: 'railing-where-install', rooms: ['~balcony'] },
  '~mirror': { id: 'mirror-custom-size' },
  '~shower': { id: 'shower-enclosure-types', rooms: ['~bathroom'] },
  '~door': { id: 'doors-types-options' },
  '~storefront': { id: 'storefront-new-business-renovation' },
  '~shelf': { id: 'shelves-floating-thickness' },
  '~partition': {},
  '~backsplash': { rooms: ['~kitchen'] },
};

/**
 * A message that is not about us: off-topic, something we don't make, another professional, someone else's hours, or
 * tied to us only by a loose word next to words the knowledge base never uses ("כמה עולה טיסה לאילת?").
 */
function offDomain(message: string, lang: SupportedLocale, toUs = false): boolean {
  const m = readMessage(message);
  const concepts = messageConcepts(message, lang);
  const unknown = unknownShare(message, lang);
  const loose = [...concepts].some((c) => !GENERIC_CONCEPTS.test(c));
  return looksOutOfScope(m) || foreignIn(m, concepts, message) || offersServices(m, asksOurs(concepts)) || seeksProfessional(m) || aboutTheTeam(m) || (!toUs && aboutSomeoneElse(m)) ||
    (loose && !anchorOf(concepts, unknown));
}

/**
 * The reply to "do you do / have / install <product>?" with nothing else asked (see existenceQuestion): the product's
 * overview entry, or "Did you mean…?" with its entries; a shop as premises ("יש לכם חנות?") or no product at all
 * ("יש לכם מתקין?") is not answered directly. Null when the message asks something else.
 */
function existenceReply(sm: MessageText, text: string, concepts: Set<string>, matches: Match[], lang: SupportedLocale): EngineResult | null {
  const named = [...concepts].filter((c) => PRODUCT_TOKENS.has(c));
  if (named.length > 1) return null;
  const rooms = named.length ? PRODUCT_OVERVIEW[named[0]]?.rooms ?? [] : [];
  const allowed = (c: string) => PRODUCT_TOKENS.has(c) || c === '~install' || c === '~glass' || rooms.includes(c);
  if (![...concepts].every(allowed)) return null;
  // (a word of a product's name in several words is the product: "אתם עושים זכוכית לחלונות ראווה?")
  const spans = phraseSpans(sm.words).filter((sp) => allowed(sp.concept));
  const ours = (i: number) => {
    if (spans.some((sp) => i >= sp.from && i < sp.to)) return true;
    const found = [processTerm(sm.words[i]) ?? []].flat().filter((t) => t.startsWith('~'));
    return found.length > 0 && found.every(allowed);
  };
  if (!existenceQuestion(sm, ours)) return null;
  const best = matches[0]?.confidence ?? 0;
  const product = named[0];
  if (!product || !namedProducts(text).has(product)) return noAnswer(lang, 'low-confidence', best);
  const overview = PRODUCT_OVERVIEW[product]?.id ? getEntry(PRODUCT_OVERVIEW[product].id!) : undefined;
  if (overview) return answerFromEntry(overview, lang, { confidence: matches.find((x) => x.entry.id === overview.id)?.confidence ?? best });
  const own = matches.filter((x) => x.products.has(product) && x.confidence >= THRESHOLDS.suggest).slice(0, THRESHOLDS.maxSuggestions);
  if (!own.length) return noAnswer(lang, 'low-confidence', best);
  return {
    kind: 'suggest', lang, text: ASSISTANT_REPLIES.didYouMean[lang],
    suggestions: own.map((x) => ({ id: x.entry.id, question: x.entry.question[lang] })),
    actions: ['quote'], layer: 1, confidence: best,
  };
}

/** "We work all over Israel / in every region / in small towns": the city reply says the same, plus the city. */
const COVERAGE_IDS = new Set(['areas-all-israel', 'areas-regions', 'areas-small-towns']);

/**
 * The best match, if it is a clear winner over the runner-up (see config.ts) and about what the message asks;
 * otherwise "Did you mean…?" or a hand-off — a wrong answer is worse than either.
 * Unanchored messages need high confidence and at least two content words ("ok" is not a question).
 * A long message (the visitor's situation first, then the question) spreads its weight over many
 * words, so even the right answer covers less of it and the runner-up comes closer: it needs a smaller lead.
 */
function clearWinner(matches: Match[], anchor: Anchor = 'strong', words = Infinity, long = false, concepts = new Set<string>(), numbers = false, ctx?: Said): Match | null {
  const top = bestCandidate(matches, anchor, words, long, concepts, numbers, ctx);
  // Whatever the rules above allow: the match has to explain the message, not just one of its words
  if (!top) return null;
  if (top.unknownShare > (long ? THRESHOLDS.maxUnknownLong : THRESHOLDS.maxUnknown)) return null;
  if (top.uncoveredShare > (long ? THRESHOLDS.maxUncoveredLong : THRESHOLDS.maxUncovered)) return null;
  if (top.entryUncovered > (long ? THRESHOLDS.maxEntryUncoveredLong : THRESHOLDS.maxEntryUncovered)) return null;
  if (words <= THRESHOLDS.shortWords && (top.docCoverage < THRESHOLDS.shortDocCoverage || top.uncoveredShare > THRESHOLDS.shortUncovered)) return null;
  return top;
}

/** The rules found an answer, but the last check in clearWinner doubted it: then "Did you mean…?", not another kind of reply. */
function doubted(matches: Match[], anchor: Anchor, words: number, long: boolean, concepts: Set<string>, numbers: boolean, ctx?: Said): boolean {
  return !!bestCandidate(matches, anchor, words, long, concepts, numbers, ctx) && !clearWinner(matches, anchor, words, long, concepts, numbers, ctx);
}

/** What the visitor said, for the rules of bestCandidate that read the words themselves. */
interface Said { text: string; m: MessageText; lang: SupportedLocale }

/** The entry doesn't use one of the words that say what the message is about (see subjectUnit). */
const subjectMissing = (said: Said, top: Match) => entryUncoveredShare(said.text, said.lang, top.entry.id, (u) => !subjectUnit(u)) > 0;

/** Properties that tie a message to one of our products only together with glass ("soundproof walls", "do you build stairs?"). */
const NEEDS_GLASS = /^~(acoustic|stairs)$/;
/** The situation an entry is about ("a small bathroom", "uneven walls"): a wording that names it asks about it. */
const SITUATION = /^~(small|uneven)$/;

function bestCandidate(matches: Match[], anchor: Anchor, words: number, long: boolean, concepts: Set<string>, numbers: boolean, said?: Said): Match | null {
  const [top, second] = matches;
  if (!top) return null;
  // An entry about a product the visitor doesn't name is a guess ("אתם מתקינים בשבת?" is not the office partitions
  // entry, "yoga classes in haifa" not the gym mirrors, "my roof is leaking" not the shower one) — unless the
  // message asks what that entry's own question is about, in words only that product has ("…through the glass
  // meeting room, will they hear everything?" is the partitions soundproofing entry), and clearly
  // (a room counts when the message is about glass: glass in the kitchen, between the kitchen and the living room)
  // (soundproofing, the stairs only with glass: "do you soundproof walls?", "вы делаете лестницы?" are other trades; and
  // with glass a room, not how it is made: "do you cut glass to size?" is not the mirror entry)
  const guessed = top.otherProduct && ![...concepts].some((c) => PRODUCT_TOKENS.has(c));
  const glass = concepts.has('~glass');
  const productWords = (c: string) => top.questionConcepts.has(c) && top.coveredConcepts.has(c) && !isLoose(c) && !GENERIC_CONCEPTS.test(c) &&
    (CONTEXT_CONCEPTS.test(c) ? glass && ROOM_CONCEPTS.test(c) : glass || !NEEDS_GLASS.test(c));
  if (guessed && ![...concepts].some(productWords)) return null;
  if (guessed && (top.confidence - (second?.confidence ?? 0)) < THRESHOLDS.marginLow) return null;
  // …and a window is not ours: "מדבקת פרטיות לחלון" is not the shop-front branding entry (a shop window is: "חלון ראווה")
  if (guessed && said && plainWindow(said.m)) return null;
  // …and one about another product than the one the visitor names is not about the message ("מראה למרפסת" is not the
  // railing installation methods, whose answer mentions balconies) — doors aside: a door is part of a shower, a shop
  // front or a partition ("the glass door to the bathroom", "a door that doesn't close" after an installation)
  const proper = (set: Set<string>) => [...set].some((c) => PRODUCT_TOKENS.has(c) && c !== '~door');
  if (top.otherProduct && proper(concepts) && proper(top.products)) return null;
  // How long it lasts, what it weighs, how long it is valid, whether it changes: only an entry about that (see STRICT_SUBJECTS)
  if (!concepts.has('~warranty') && [...concepts].some((c) => STRICT_SUBJECTS.test(c) && !top.topics.has(c))) return null;
  const about = (c: string) => top.topics.has(c) || top.coveredConcepts.has(c);
  // (a thickness is named by its number too: "מקלחון 8 או 10?")
  const named = (c: string) => concepts.has(c) || (c === '~thickness' && numbers);
  // The match explains only the product (and its type) and loose words (price, glass, time, a room the entry is not
  // about): the rest of the message is the question. With a big part of a short message in words the knowledge base
  // never uses ("сколько стоит фартук для повара", "do you do fire rated glass?") that is a guess
  // (cleaning is what a care entry is about, the stairs what the stairs railing entry is about; time words are too
  // often only "when"/"during" to count)
  const thin = [...top.coveredConcepts].every((c) =>
    PRODUCT_TOKENS.has(c) || PRODUCT_TYPES.test(c) || WEAK_CONCEPTS.has(c) || /^~(time|city-.*)$/.test(c) ||
    ((GENERIC_CONCEPTS.test(c) || ROOM_CONCEPTS.test(c)) && !top.questionConcepts.has(c)));
  if (thin && !long && top.unknownShare >= THRESHOLDS.thinUnknown) return null;
  const namedProducts = [...concepts].filter((c) => PRODUCT_TOKENS.has(c));
  // A match on loose words alone (price, install, time, glass, per meter) is about the message only when the entry uses its
  // other words too: "כמה זמן לוקח להתקין מטבח", "skolko stoit ustanovka kondicionera", "how much does a painter charge per
  // square meter" ask about a kitchen, an air conditioner, a painter
  // (places have entries of their own: "אני גר בנגב חם פה מאוד, הזכוכית תחזיק?")
  const looseOnly = [...top.coveredConcepts].every((c) => isLoose(c) || /^~(time|per-meter)$/.test(c));
  if (said && !long && !namedProducts.length && looseOnly && top.entry.topic !== 'service-areas' && subjectMissing(said, top)) return null;
  // A short message tied to us only loosely: a wording about something it doesn't name is about that ("רסיסים של זכוכית
  // מחוסמת חותכים?" — do shards of tempered glass cut? — doesn't answer "אתם חותכים זכוכית?")
  // (a price question has rules of its own below)
  const priceAsked = [...concepts].some((c) => PRICE_CONCEPTS.has(c));
  if (anchor === 'weak' && words <= 3 && !priceAsked && [...top.docConcepts].some((c) => !concepts.has(c) && !isLoose(c) && !GENERIC_CONCEPTS.test(c))) return null;
  // "Do you do <product>…?" asks whether we make it: not a narrow sibling about something the message doesn't name ("do you do
  // glass shelves for a shop display?" is not whether glass shelves are safe)
  const sibling = [...top.questionConcepts].filter((c) => !PRODUCT_TOKENS.has(c) && !PRODUCT_TYPES.test(c) && !isLoose(c) && !GENERIC_CONCEPTS.test(c) && !CONTEXT_CONCEPTS.test(c));
  if (said && productsNamedIn(said.text).size === 1 && asksIfWeMake(said.m) && sibling.length && !sibling.some((c) => concepts.has(c))) return null;
  // A wording about a situation the message doesn't state ("small bathroom, glass shower or curtain" for "shower curtain or glass?")
  if (top.via !== 'a' && [...top.docConcepts].some((c) => SITUATION.test(c) && top.questionConcepts.has(c) && !concepts.has(c))) return null;
  // An answer text mentions much in passing: it answers only a message about something its entry is about ("do you do
  // bronze mirrors?" is not the extra-clear glass entry, whose answer mentions tints and mirrors; "can I come to your
  // showroom?" not the far-away measurement)
  const specificNamed = [...concepts].filter((c) => !isLoose(c));
  if (top.via === 'a' && specificNamed.length && !specificNamed.some((c) => top.topics.has(c))) return null;
  // …and it beats an entry whose own wording matches only by a clear lead ("do you do bulletproof glass?": the
  // tempered-glass answer mentions security, the shop-front security glass entry is about it)
  if (top.via === 'a' && second && second.via !== 'a' && top.confidence - second.confidence < THRESHOLDS.marginLow) return null;
  // A glass type's entry needs the message to name that type (or a number for a thickness): "do you do low-e glass for
  // windows?", "בתעשו זכוכית דבל לחלונות" are not the acoustic glass entry, even though its wording names windows
  if (top.entry.topic === 'glass-types') {
    const defining = [...top.questionConcepts].filter((c) => !isLoose(c) && !GENERIC_CONCEPTS.test(c) && !CONTEXT_CONCEPTS.test(c) && !PRODUCT_TOKENS.has(c));
    if (defining.length && !defining.some(named)) return null;
  }
  // Not on the wording of an answer text alone when nothing ties the message to us ("לא הבנתי", "יום נעים")
  if (!anchor && top.via === 'a') return null;
  // Not tied to us: a wording that asks about something the message doesn't name is about something
  // else ("כמה עובדים יש לכם?" is not "do you have a team in the south?", "אתם עובדים לפי שעה?" not the opening
  // hours, "רכבת לבאר שבע" not the Negev heat)
  // (a price or a place too: "אני רוצה לשאול משהו" is not "…רוצה משהו זול", "אתם עובדים במרכז מסחרי?" not the regions)
  if (!anchor && [...top.docConcepts].some((c) => !concepts.has(c) && !/^~(glass|install)$/.test(c) && !c.startsWith('~city-'))) return null;
  // Payment, days off, the warranty and tiles are what a message is about when it names them: an entry about
  // something else doesn't answer it ("אפשר בתשלומים?" is not the free-quote entry, "כמה עולה התקנת אריחים?" not
  // the glass price), and an entry about one of them needs the message to name it ("do you also do railings?" is
  // not the warranty-on-all-products entry)
  // (what else the message names counts: "is the quote free or do I pay?" is the free-quote entry; its product
  // doesn't: "how thick are your mirrors?" is not the mirror mounting entry)
  const subjects = [...concepts].filter((c) => SUBJECT_CONCEPTS.test(c));
  const specific = [...concepts].filter((c) => !isLoose(c) && !PRODUCT_TOKENS.has(c) && !/^~(time|city-.*)$/.test(c));
  if (subjects.length && !specific.some((c) => top.questionConcepts.has(c))) return null;
  const entrySubjects = [...top.questionConcepts].filter((c) => SUBJECT_CONCEPTS.test(c) && !NAMED_SUBJECTS.test(c));
  if (entrySubjects.length && !entrySubjects.some(named)) return null;
  // Care questions name what they are about: "do you replace broken glass?" is not the cleaning-products entry;
  // and a service-areas entry needs a place ("do you come to measure in the evening?" is not "…if I live far away")
  if (top.entry.topic === 'maintenance' && concepts.size && ![...concepts].some((c) => MAINTENANCE_CONCEPTS.test(c))) return null;
  if (top.entry.topic === 'service-areas' && !top.entry.generated && ![...concepts].some((c) => AREA_CONCEPTS.test(c))) return null;
  // …and one about our glass in a place (by the sea, in the Negev heat, measuring far away) a message about something
  // of ours, not about the place alone ("best beach near the sea in netanya", "какое сегодня море в Нетании?")
  if (top.entry.topic === 'service-areas' && !top.entry.generated && !COVERAGE_IDS.has(top.entry.id) &&
    ![...concepts].some((c) => !ONLY_PLACE.test(c) && !GENERIC_CONCEPTS.test(c))) return null;
  // A care question is answered by a care entry: "איך מנקים את המראה באמבטיה" is not the bathroom mirror's wall, "איך
  // מורידים דבק מהמראה" not how we glue a mirror on
  const care = [...concepts].filter((c) => /^~(clean|limescale)$/.test(c));
  // (not a price: "איך מורידים את המחיר של המעקה")
  const removal = !!said && asksRemoval(said.m) && ![...concepts].some((c) => PRICE_CONCEPTS.has(c) || c === '~discount');
  if (top.entry.topic !== 'maintenance' && (care.length ? !care.some(about) : removal)) return null;
  // …while "do you clean / service…?" asks for a service, not how to care for the glass ("אתם מנקים זכוכית?", "بتعملوا صيانة للشاور؟")
  if (top.entry.topic === 'maintenance' && said && asksIfWeDo(said.m) && !asksHow(said.m)) return null;
  // A problem after our installation is about something we installed: "у меня сломалась ручка двери" names neither glass nor
  // a product of ours besides a door, nor the installation
  if (top.questionConcepts.has('~after-install') && ![...concepts].some((c) => /^~(glass|install|after-install)$/.test(c) || (PRODUCT_TOKENS.has(c) && c !== '~door'))) return null;
  // The price of a photo or a picture ("כמה עולה זכוכית לתמונה", "сколько стоит фото?") is not a price from a photo
  if (top.entry.topic === 'prices' && top.coveredConcepts.has('~photo') && said && !photoIsTheMeans(said.m)) return null;
  // Reviews are ours only in a message about us ("where can I read reviews about a doctor?": see aboutUsOnly)
  if (top.coveredConcepts.has('~reviews') && said && !aboutUsOnly(said.text, said.m, said.lang, [top.entry.id])) return null;
  // After the measurement is where the wait starts: the lead time or the quote then, not how soon we come to measure
  if (concepts.has('~after-measure') && !about('~after-measure')) return null;
  // Off-domain: at least two words, no big part of the message that the match doesn't explain ("השירות שלכם
  // מעולה", "how much is home insurance"), and an answer about everything it names ("بتشتغلوا بالعيد؟" is not the
  // Friday/Saturday hours)
  if (!anchor && (words < THRESHOLDS.unanchoredMinWords || top.unknownShare >= THRESHOLDS.unanchoredUnknown)) return null;
  if (!anchor && [...concepts].some((c) => !top.coveredConcepts.has(c) && !top.topics.has(c))) return null;
  // A short price question needs an answer about prices ("самое дешевое зеркало в ванную" is not the mirror
  // preparation answer; a long message often mentions the price only in passing), and about the product it names:
  // "how much for a glass panel?" is not the kitchen backsplash price
  const priceQuestion = [...concepts].some((c) => PRICE_CONCEPTS.has(c));
  if (priceQuestion && top.otherProduct) return null;
  if (priceQuestion && !long && ![...PRICE_CONCEPTS].some((c) => top.topics.has(c) || top.coveredConcepts.has(c))) return null;
  const loose = [...concepts].filter(isLoose);
  const priceOnly = anchor === 'weak' && loose.every((c) => PRICE_CONCEPTS.has(c));
  // Tied to us only by a price/glass/install or region word: the answer has to be about that word. Price words
  // alone also need it in the entry's own wording, not in its answer text, which mentions prices in passing
  // ("где дешевле?" is not the railings saving answer)
  if (anchor === 'weak' && !loose.some((c) => top.coveredConcepts.has(c) || top.topics.has(c))) return null;
  if (priceOnly && top.via === 'a') return null;
  const lead = top.confidence - (second?.confidence ?? 0);
  // Two close entries that each explain a different part of the message: not sure which one is meant
  // ("שולח לכם תמונות בוואטסאפ" — the runner-up is about the photos, the top one isn't)
  if (second && lead < THRESHOLDS.marginLow && [...concepts].some((c) => second.coveredConcepts.has(c) && !top.coveredConcepts.has(c) && !top.topics.has(c))) return null;
  // One word ("מקלחון", "חזית") or a product alone ("mirror please") matches many entries alike: only a clear lead
  // (a product named in several words is one: "חלון ראווה לחנות", "shop window for my store")
  const productOnly = concepts.size === 1 && namedProducts.length === 1 && (words <= 2 || (!!said && onlyTheProduct(said.text)));
  if (top.confidence >= THRESHOLDS.answer && lead >= (words <= 1 || productOnly ? THRESHOLDS.marginLow : THRESHOLDS.margin)) return top;
  // Price words alone don't make a message ours ("самый дешевый интернет", "כמה עולה דירה בתל אביב"): only a confident match
  if (!anchor || priceOnly || top.offProduct || top.confidence < THRESHOLDS.answerLow) return null;
  // A less confident match that explains only the product and loose words, with half of a short message left
  // unexplained, doesn't answer it ("can you add a fold-down seat in a walk-in shower?", "can the railing go on top
  // of my existing wall?", "какое расстояние между стеклом и полом в душевой?")
  // (a price question is answered by a price entry about its product: "כמה יעלה לי קיר מראה בחדר השינה בערך")
  const priceAnswered = [...PRICE_CONCEPTS].some((c) => top.coveredConcepts.has(c)) && namedProducts.every((c) => top.coveredConcepts.has(c));
  if (thin && !long && !priceAnswered && top.uncoveredShare >= THRESHOLDS.thinUncovered) return null;
  // Not about the message: an entry on one product when the visitor names two others ("partitions, a mirror wall and
  // railings on the stairs — how does it work?" is not the stairs railing entry); for a long message's smaller lead,
  // an entry that is not about a third or more of what the message names ("…how many years of warranty, and do you
  // come on Friday?" is not the balcony glass entry)
  if ([...concepts].filter((c) => PRODUCT_TOKENS.has(c) && !about(c)).length >= 2) return null;
  const own = [...concepts].filter((c) => !GENERIC_CONCEPTS.test(c));
  const longMargin = long && own.filter((c) => !about(c)).length * 3 <= own.length;
  return lead >= (longMargin ? THRESHOLDS.marginLowLong : THRESHOLDS.marginLow) ? top : null;
}

/** Price and "cheap" concepts. */
const PRICE_CONCEPTS = new Set(['~price', '~cheap']);

/** What a message is about when it names it (see clearWinner). */
const SUBJECT_CONCEPTS = /^~(payment|discount|emergency|weekend|hours|warranty|tiles|thickness|repair|message|outdoor|after-install|after-hours|existing-wall)$/;
/** …of which these don't have to be named for an entry about them (opening hours phrases are narrow, a broken door isn't always called broken). */
const NAMED_SUBJECTS = /^~(hours|emergency|repair|outdoor|after-install|after-hours)$/;

/** What a care question is about. */
const MAINTENANCE_CONCEPTS = /^~(clean|limescale|coating|fog|rust|seals|hardware|hinged|edge)$/;
/** What a service-areas question names: a place, the coast, the Negev heat. */
const AREA_CONCEPTS = /^~(city-.*|region|village|far|nationwide|location|coastal|heat)$/;
/** …of which these are only the place. */
const ONLY_PLACE = /^~(city-.*|region|village|far|nationwide|location|coastal)$/;

/** When, how much, the warranty: the city reply ("yes, we work in Haifa") doesn't answer that ("אתם מגיעים לחיפה בשבת?"). */
const BEYOND_PLACE = /^~(weekend|holiday|hours|after-hours|time|price|cheap|discount|per-meter|payment|warranty|quote|free)$/;

// A short message that continues the previous question ("and for 10 mm?", "ומה עם מראות?", "а для балкона?")
// (a glued "ו"/"و" only before a question word or a preposition: "وين" is "where", not "and")
const FOLLOW_UP_START = /^(and |what about|how about|also |ומה|ואם|וגם|וכמה|ואיך|ול|וב|وشو|وكم|وكيف|طيب و|و(?=(اذا|بال|لل|ال|ب|ل|ع))|а |и |а если|а как|а для|а сколько)/i;

// What a question asks about (its price, how long, the warranty…), as opposed to the product and its specification
const ASKED_ASPECTS = /^~(price|cheap|discount|payment|time|lifespan|weight|validity|dimension|warranty|hours|weekend)$/;

/**
 * The previous question as a follow-up continues it: without what the follow-up replaces — the product, when the
 * follow-up names another ("how much is a railing per meter?" → "and a mirror?"), and what was asked, when the
 * follow-up asks something else ("how long does installing the shower take?" → "and the price?"). A specification
 * ("and for 10 mm?") replaces nothing.
 */
function continuedQuestion(previous: string, followUp: Set<string>): string {
  const product = [...followUp].some((c) => PRODUCT_TOKENS.has(c));
  const aspect = [...followUp].some((c) => ASKED_ASPECTS.test(c));
  if (!product && !aspect) return previous;
  const replaced = (cs: string[], kind: (c: string) => boolean) => cs.some(kind) && !cs.some((c) => followUp.has(c));
  return splitWords(normalizeText(previous)).filter((w) => {
    const cs = [processTerm(w) ?? []].flat().filter((t) => t.startsWith('~'));
    return !(product && replaced(cs, (c) => PRODUCT_TOKENS.has(c))) && !(aspect && replaced(cs, (c) => ASKED_ASPECTS.test(c)));
  }).join(' ');
}

// Arabic in Latin letters (Arabizi) writes some letters as digits: "3ard si3r", "7adid", "2adesh", "ta2meen"
const ARABIZI_WORD = /^(?=.*[a-z])(?=.*[23579])[a-z0-9]+$/;
const NUMBER_WITH_UNIT = /^\d+(mm|cm|m|mtr|kg|x\d+)?$|^\d*x\d+$/;
// …or uses two of these words ("adesh smakit el zjaj lal shawer?")
const ARABIZI_WORDS = new Set(['adesh', 'addesh', 'shu', 'shoo', 'bdi', 'badi', 'bade', 'badna', 'kam', 'fikom', 'fikon', 'zjaj', 'qzaz', 'shawer', 'drabzin', 'darabzin', 'mraye', 'mrayeh', 'mrayat', 'lal', 'el', 'wen', 'emta', 'imta', 'ya3ni', '3andkom', 'mni7']);
const arabizi = (text: string) => {
  const words = splitWords(normalizeText(text));
  return words.some((w) => ARABIZI_WORD.test(w) && !NUMBER_WITH_UNIT.test(w)) || words.filter((w) => ARABIZI_WORDS.has(w)).length >= 2;
};

/**
 * The reply in Arabic for an Arabizi message on the Arabic site: its words match the transliterations, which are
 * in the English wordings ("adesh bya5od wa2t…"), but the visitor reads Arabic.
 */
function inArabic(r: EngineResult): EngineResult {
  const fixed = Object.entries(ASSISTANT_REPLIES).find(([, t]) => t.en === r.text)?.[0] as keyof typeof ASSISTANT_REPLIES | undefined;
  const suggestions = r.suggestions?.map((x) => ({ id: x.id, question: getEntry(x.id)?.question.ar ?? x.question }));
  if (r.kind === 'answer' && r.entryId) {
    const entry = getEntry(r.entryId);
    // (generated replies with a city keep their language: the city is not known here)
    if (!entry || entry.generated === 'city') return r;
    return { ...answerFromEntry(entry, 'ar', { confidence: r.confidence }), confidence: r.confidence };
  }
  if (!fixed) return r;
  const city = r.quotePrefill?.city ? LOCATION_SLUGS_BY_NAME.get(r.quotePrefill.city) : undefined;
  return {
    ...r,
    lang: 'ar',
    text: ASSISTANT_REPLIES[fixed].ar,
    ...(suggestions ? { suggestions } : {}),
    ...(r.quotePrefill ? { quotePrefill: { ...r.quotePrefill, ...(city ? { city: LOCATIONS[city].name.ar } : {}) } } : {}),
  };
}
const LOCATION_SLUGS_BY_NAME = new Map(Object.entries(LOCATIONS).map(([slug, l]) => [l.name.en, slug as LocationKey]));

export function answerMessage(input: EngineInput): EngineResult {
  const r = answerIn(input);
  return input.pageLocale === 'ar' && r.lang === 'en' && arabizi(input.message) ? inArabic(r) : r;
}

function answerIn({ message, pageLocale, history = [] }: EngineInput): EngineResult {
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

  let text = withoutGreeting(message).trim() || message;
  // A visitor introducing themselves ("קוראים לי ערד", "this is Arad from the office"): what they ask is the rest
  const intro = withoutIntroduction(readMessage(text), (i) => unknownShare(readMessage(text).words[i], lang) === 1);
  if (intro !== null) {
    if (!intro.trim()) return { kind: 'smalltalk', lang, text: ASSISTANT_REPLIES.greeting[lang], actions: ['quote'], layer: 1, confidence: 1 };
    text = /[?؟]/.test(message) ? `${intro}?` : intro;
  }
  let m = readMessage(text);

  if (isComplaint(m)) {
    return { kind: 'smalltalk', lang, text: ASSISTANT_REPLIES.complaint[lang], actions: ['whatsapp', 'call'], layer: 3, confidence: 1 };
  }
  if (looksOutOfScope(m)) return noAnswer(lang, 'out-of-scope', 0);
  // A glazier or a supplier offering us their services or a quote: not a customer's question
  if (offersServices(m, asksOurs(messageConcepts(text)))) return noAnswer(lang, 'out-of-scope', 0);
  // "My neighbour recommended you", "ממליץ בחום על המתקין": thanks
  if (isRemark(m)) return { kind: 'smalltalk', lang, text: ASSISTANT_REPLIES.thanks[lang], actions: [], layer: 1, confidence: 1 };
  // A phone number, or "call me back": the quote / callback request — not "please don't call, WhatsApp only 052…"
  // (how to reach them), nor a quote for something we don't do ("بدي عرض سعر لتأمين السيارة", "хочу смету на кухню из дерева")
  let phone = hasPhoneNumber(text);
  // …nor a call the visitor got ("קיבלתי שיחה מ-052…, זה אתם?"): for the team; and "is your WhatsApp 058…?" asks about
  // our number — the question without the number
  if (phone && (pastCall(m) || callFromNumber(text))) return { ...noAnswer(lang, 'low-confidence', 0), actions: ['whatsapp', 'call'] };
  if (phone && asksIfOurs(m)) {
    text = text.replace(/(\+?972|0)([\s-]?\d){8,9}/g, ' ').trim();
    m = readMessage(text);
    phone = false;
  }
  if (phone && declinedRequest(m)?.declinedCall) return { ...noAnswer(lang, 'low-confidence', 0), actions: ['whatsapp', 'call'] };
  const quote = phone ? 'strong' : quoteRequest(m);
  // A quote request that declines a call ("звонить не надо, пришлите смету на почту"): the quote form asks for a phone
  // number — the team answers in writing
  if (quote === 'strong' && declinedRequest(m)?.declinedCall) return { ...noAnswer(lang, 'low-confidence', 0), actions: ['whatsapp', 'call'] };
  if (quote === 'strong') {
    const requestConcepts = messageConcepts(text, lang);
    if (foreignIn(m, requestConcepts, text)) return noAnswer(lang, 'out-of-scope', 0);
    // A request about something we don't name ("I need a quote for a website design", "перезвоните мне по поводу
    // кредита", "call me 052… about a pizza order"): not ours to start — the hand-off still offers the quote button
    if (!quoteAboutUs(text, m, lang)) return noAnswer(lang, 'low-confidence', 0);
    // …nor "call me" after a question that is not ours ("do you sell car insurance?" → "call me")
    const before = history.filter((t) => t.role === 'user').at(-1)?.content;
    if (before && !aboutOurWork(requestConcepts) && offDomain(before, lang)) return noAnswer(lang, 'out-of-scope', 0);
    return quoteReply(lang, m, messageConcepts(text), ASSISTANT_REPLIES.quoteStart[lang], 1);
  }
  // Cancelling or moving a measurement or a quote the visitor already has, or asking where it is ("where are you with
  // my quote?", "המתקין לא הגיע"): for the team
  if (quote === 'change' || asksStatus(m)) return { ...noAnswer(lang, 'low-confidence', 0), actions: ['whatsapp', 'call'] };

  // A call or quote the visitor declines, or a call they ask about, is not what they ask ("אל תתקשרו, תשלחו לי
  // מחיר בוואטסאפ"): search the rest, and only the rest ties the message to us
  const declined = declinedRequest(m);
  // …and a quote word that means something else here is not searched for ("a rough estimate of the timeline")
  const otherMeaning = new Set(otherMeaningQuoteWords(m));
  const searchText = otherMeaning.size ? m.words.filter((_, i) => !otherMeaning.has(i)).join(' ') : declined ? declined.rest : text;
  const sm = searchText === text ? m : readMessage(searchText);
  // A declined call with only a word or two left ("שלא תתקשרו בשבת" — not on Saturday): it says how to reach them, not a question
  if (declined && !m.question && contentWords(declined.rest) <= 1) return { ...noAnswer(lang, 'low-confidence', 0), actions: ['whatsapp', 'call'] };
  const concepts = messageConcepts(searchText, lang);
  const ownConcepts = messageConcepts(searchText);
  let matches = searchKnowledge(searchText, lang, 6);
  // Latin text on the Hebrew/Arabic/Russian site may be transliteration ("kam si3r", "mikla7on"): keep the page
  // language when its knowledge base matches better than the English one — not for plain English, whose words
  // the page language knows only through concepts ("my shower door hinge is failing")
  const latin = !/[^\u0000-\u024F\s\p{P}\p{N}\p{S}]/u.test(text);
  if (lang === 'en' && pageLocale !== 'en' && latin) {
    const own = searchKnowledge(searchText, pageLocale, 6);
    if (own[0]?.wordsCovered && (own[0]?.confidence ?? 0) > (matches[0]?.confidence ?? 0) + THRESHOLDS.margin) {
      lang = pageLocale;
      matches = own;
    }
  }

  // A short follow-up ("and for 10 mm?") is also searched together with the previous question —
  // only when it continues it: it names something itself, has a number, or starts like a follow-up
  // Something we don't make (a fridge, a wooden door), another professional ("ищу дизайнера интерьера") or the size
  // of our team: for the team
  const namesProduct = [...concepts].some((c) => PRODUCT_TOKENS.has(c));
  if (foreignIn(sm, concepts, searchText) || seeksProfessional(sm) || aboutTheTeam(sm) || sellsToTrade(sm)) return noAnswer(lang, 'low-confidence', matches[0]?.confidence ?? 0);
  // "I want a mirror", "אני רוצה מקלחון", "بدي مراية": a product and nothing asked about it — the quote request for it,
  // not whichever entry's wording starts the same way ("i want a mirror wall for my gym"); words that only describe
  // it don't ask anything either ("بدي مراية جديدة محل المراية القديمة")
  const nameWords = productPhraseWords(searchText);
  const describedOnly = textUnits(searchText).every((u) =>
    u[0].startsWith('~') || requestWord(u) || u.some((v) => PRODUCT_TOKENS.has(v)) || nameWords.has(u[0]) || isDescriptor(u[0].replace(/^#/, '')) || /^\d/.test(u[0]));
  if (concepts.size === 1 && namesProduct && (contentWords(searchText) <= 2 || describedOnly) && !declined && wantsSomething(sm)) {
    return quoteReply(lang, m, ownConcepts, ASSISTANT_REPLIES.quoteStart[lang], 1);
  }
  // "Do you do / have / install mirrors?" (see PRODUCT_OVERVIEW)
  if (!declined) {
    const existence = existenceReply(sm, searchText, concepts, matches, lang);
    if (existence) return existence;
  }
  const numbers = /\d/.test(searchText);
  const words = contentWords(searchText);
  const ownUnknown = unknownShare(searchText, lang);
  const ownAnchor = anchorOf(concepts, ownUnknown);
  const ownAnchored = !!ownAnchor;
  const previous = history.filter((t) => t.role === 'user').at(-1)?.content;
  let combinedUsed = false;
  const followUpStart = FOLLOW_UP_START.test(normalizeText(text).trim());
  // …and when its own words are ours: "וכמה עולה טיסה?", "and the war?" start like a follow-up but ask something else
  const continues = (ownAnchored || /\d/.test(text) || followUpStart) && (ownAnchor === 'strong' || ownUnknown < THRESHOLDS.weakAnchorUnknown);
  // A follow-up of a question that is not ours ("אתם מתקינים מזגנים?" → "ובכמה?", "do you do wooden doors?" → "and
  // the price?", "what time does the post office close?" → "and on friday?") is not ours either — unless it names
  // glass or one of our products itself, or turns to us after someone else's hours ("…and your hours?")
  if (previous && !namesProduct && !concepts.has('~glass') && (followUpStart || (words <= THRESHOLDS.followUpWords && continues && ownAnchor !== 'strong'))) {
    if (offDomain(previous, lang, speaksToUs(sm))) return noAnswer(lang, 'out-of-scope', matches[0]?.confidence ?? 0);
  }
  // "а подешевле?" after a railing question: a follow-up with only a loose word of its own (price, cheap…)
  // is about what the previous question named
  // (not when it names its own subject, a word the previous question doesn't have: "وقديش سعر الذهب؟" after a railing
  // price asks the price of gold)
  const previousWords = new Set(previous ? textUnits(previous).flat() : []);
  const functionWord = (u: string[]) => u.some((v) => !/^[~=#]/.test(v) && processTerm(v) === null) || stems(u[0]).some((v) => processTerm(v) === null);
  const ownSubject = textUnits(searchText).some((u) =>
    !u.some((v) => v.startsWith('~')) && !requestWord(u) && !functionWord(u) && !/^\d/.test(u[0]) && !u.some((v) => previousWords.has(v)));
  const dependent = followUpStart && ownAnchor === 'weak' && !ownSubject;
  // (what the follow-up replaces is not searched: "and a mirror?" after a railing price is the mirror price)
  const continued = previous ? continuedQuestion(previous, concepts) : '';
  const said: Said = { text: searchText, m: sm, lang };
  if (previous && words <= THRESHOLDS.followUpWords && continues && (dependent || !clearWinner(matches, ownAnchor, words, false, concepts, false, said))) {
    const combined = searchKnowledge(`${continued} ${text}`, lang, 6);
    // (the city entry answers only a coverage question: "ובחיפה?" after a shower price asks the price there)
    const own = coverageQuestion(m) ? matches : matches.filter((x) => x.entry.generated !== 'city');
    if ((combined[0]?.confidence ?? 0) > (dependent ? THRESHOLDS.suggest : (own[0]?.confidence ?? 0))) {
      matches = combined;
      combinedUsed = true;
    }
  }
  const city = findCity(m, concepts);
  const place = !!city || [...concepts].some((c) => PLACE_CONCEPT.test(c)) || namesOwnArea(m);
  // The city entry's paraphrases name towns: without a place or a "do you work in…" question,
  // matching one of those words is a coincidence ("מראה עם נשר" — an eagle, and a town)
  const coverage = coverageQuestion(m);
  // (and only a coverage question gets the city reply: "rooftop bar in tel aviv" names a city, but doesn't ask that)
  if (!coverage) matches = matches.filter((x) => x.entry.generated !== 'city');
  const best = matches[0]?.confidence ?? 0;
  // A follow-up is as much ours as the question it continues
  const previousConcepts = combinedUsed ? messageConcepts(continued) : new Set<string>();
  const previousAnchor = combinedUsed ? anchorOf(previousConcepts, unknownShare(continued, lang)) : null;
  const anchor: Anchor = ownAnchor === 'strong' || previousAnchor === 'strong' ? 'strong' : ownAnchor ?? previousAnchor;
  const anchored = !!anchor;
  const allConcepts = new Set([...concepts, ...previousConcepts]);
  const long = words >= THRESHOLDS.longWords;
  // "Will you call me before the measurement?", "are you open on holidays?": the knowledge base doesn't say —
  // at most "Did you mean…?"
  // …nor whether we remove scratches ("can you polish scratches out of glass?")
  const unanswerable = declined?.aboutCall || concepts.has('~holiday') || asksScratchRepair(sm);
  const searched: Said = combinedUsed ? { text: `${continued} ${text}`, m: readMessage(`${continued} ${text}`), lang } : said;
  let winner = unanswerable ? null : clearWinner(matches, anchor, combinedUsed ? Infinity : words, long, allConcepts, numbers, searched);
  const doubt = !winner && !unanswerable && doubted(matches, anchor, combinedUsed ? Infinity : words, long, allConcepts, numbers, searched);

  // "Do you work in <city>?" — "do you work in…" alone is not enough ("…in small bathrooms?"): it needs a place,
  // or nothing else in the message that the question could be about, with the place asked about being one word
  // at the end that the knowledge base doesn't know (a town we have no name for: "אתם עובדים בירוחם?" — not
  // "מגיעים להתקנה?", "do you install in a batch of apartments?").
  // A short message naming a city counts only if it asks nothing else ("shower price Haifa" is a price question).
  // (generic concepts count: "אתם עובדים בחגים?", "מגיעים לתקן?" are not about a place either)
  // A question about the coverage without a place ("where do you work?", "do you come to my area?") gets the general
  // reply too; a word we don't know is not taken for a town ("אתם עובדים באוגוסט?", "do you work in English?")
  const aboutSomethingElse = [...concepts].some((c) => !PLACE_CONCEPT.test(c) && !c.startsWith('~city-') && c !== '~install');
  // A place alone after another question continues that question: after one that is not ours ("is there a good dentist
  // in tel aviv?" → "and in haifa?") it is not ours either, and after one about a price or a time ("how much is a
  // shower in tel aviv?" → "and in haifa?") it asks that again, not where we work
  const placeOnly = !coverage && !!city && words <= THRESHOLDS.cityOnlyWords && !aboutSomethingElse && onlyPlace(m);
  const before = placeOnly && previous ? { m: readMessage(previous), concepts: messageConcepts(previous, lang) } : null;
  // (a room alone doesn't make it ours: "rooftop bar in tel aviv")
  if (before && (offDomain(previous!, lang) || (![...before.concepts].some((c) => (ourWork(c) && c !== '~balcony') || c === '~glass' || c === '~install') &&
    !coverageQuestion(before.m) && !speaksToUs(before.m) && !smallTalk(before.m)))) return noAnswer(lang, 'out-of-scope', best);
  const beyondPlace = [...concepts, ...(before?.concepts ?? [])].some((c) => BEYOND_PLACE.test(c));
  // (where we are — our address, our showroom — is not where we work: "מה הכתובת שלכם בחיפה?", "is your showroom in haifa?")
  const cityQuestion =
    !beyondPlace && !concepts.has('~location') &&
    ((!!coverage && (place || (coverage.slot === undefined && !aboutSomethingElse))) ||
      (!!city && words <= THRESHOLDS.cityOnlyWords && !aboutSomethingElse && onlyPlace(m)));
  // A specific service-areas entry ("is the measurement free in Eilat?") beats the city reply when the message
  // asks about that too; a general coverage one doesn't when a city is named ("do you come to Netanya?" is not
  // the sea-air entry, even though its wording names coastal towns)
  const specificAreaWinner =
    !!winner && winner.entry.topic === 'service-areas' && !winner.entry.generated && !(city && (COVERAGE_IDS.has(winner.entry.id) || !aboutSomethingElse));
  // Without a place, a clear answer about something else wins ("אתם מתקינים גם בקומה גבוהה?")
  const otherWinner = !!winner && !place && !winner.entry.generated && winner.entry.topic !== 'service-areas';
  // …and the generated city reply only for a city question
  if (winner?.entry.generated === 'city' && !cityQuestion) winner = null;
  if (cityQuestion && !specificAreaWinner && !otherWinner) {
    return { ...generatedReply('city', lang, city?.slug, !!city), confidence: Math.max(best, 0.9) };
  }

  // Someone else's hours or phone number ("what time does the bank close?", "מסעדות פתוחות בשבת", "номер телефона
  // клиники") is not ours to give
  const someoneElse = aboutSomeoneElse(m);
  if (winner?.entry.topic === 'contact' && (someoneElse || !aboutUsOnly(text, m, lang, [winner.entry.id]))) winner = null;
  if (winner) return answerFromEntry(winner.entry, lang, { confidence: winner.confidence, city: city?.slug, cityKnown: !!city });

  // Our hours and contact details, for a question about us: not "עד איזה שעה הסופר פתוח?", "the police's phone
  // number" (a name the knowledge base doesn't know is someone else's)
  const aboutUs = !someoneElse && ownUnknown < THRESHOLDS.weakAnchorUnknown;
  if (isHoursQuestion(m) && !concepts.has('~holiday') && aboutUs && aboutUsOnly(text, m, lang, [GENERATED_IDS.hours])) {
    return { ...generatedReply('hours', lang), confidence: Math.max(best, 0.9) };
  }
  if (isContactQuestion(m) && aboutUs) {
    // "I'd rather talk to a real person" is the human entry, not only our phone number
    const contactEntry = matches[0]?.entry.topic === 'contact' ? clearWinner(matches, 'strong', words, long, concepts, false, said) : null;
    if (contactEntry && aboutUsOnly(text, m, lang, [contactEntry.entry.id])) {
      return answerFromEntry(contactEntry.entry, lang, { confidence: contactEntry.confidence });
    }
    if (aboutUsOnly(text, m, lang, CONTACT_IDS)) return { ...generatedReply('contact', lang), confidence: Math.max(best, 0.9) };
  }
  // (not when an answer was found but doubted: "I want to understand why you need to measure on site" is a question)
  // (and, like any quote request, only about our work: "нужен замер давления" is not)
  if (quote === 'maybe' && !doubt && quoteAboutUs(text, m, lang)) return quoteReply(lang, m, ownConcepts, ASSISTANT_REPLIES.quoteStart[lang], best);

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

  // Only for a message about us: "how much is a flight to Eilat?" is not a glass price question
  // (and a price, not how big or heavy something is: "قديش عالي الدرابزين؟"); glass or installation alone only with
  // nothing else named: "כמה עולה התקנת ג'קוזי", "how much is a glass vase" are another product's price
  const pricedWork = aboutOurWork(ownConcepts) || ([...ownConcepts].some((c) => c === '~glass' || c === '~install') && !subjectUnits(searchText).length);
  if (isPriceQuestion(sm) && pricedWork && [...ownConcepts].some((c) => PRICE_CONCEPTS.has(c))) {
    return { ...quoteReply(lang, m, ownConcepts, ASSISTANT_REPLIES.priceGeneral[lang], best), reason: 'price-general' };
  }
  return noAnswer(lang, 'low-confidence', best);
}
