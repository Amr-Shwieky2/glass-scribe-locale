/**
 * Knowledge base search with a confidence score (0–1).
 *
 * Every approved entry's question, each paraphrase and the answer are indexed
 * as separate small documents per language (MiniSearch, with the site's
 * tokenizer: stems, synonyms, typo-tolerant matching). MiniSearch finds the
 * candidates; the confidence is then computed from how much of the visitor's
 * message the best document covers (rarer words count more, typo/prefix
 * matches count partly) and how much of that document the message covers —
 * so one shared word with a long paraphrase is not a confident match.
 */
import MiniSearch from 'minisearch';
import { APPROVED_ENTRIES, type KnowledgeEntry } from '@/data/knowledge';
import type { SupportedLocale } from '@/data/types';
import { SEARCH_OPTIONS, processTerm, tokenize, typoConcepts } from '@/lib/search/tokenize';

/** All variants (word, stems, synonym concepts) of one word of a text. */
export type Unit = string[];

interface KbDoc {
  id: string;
  entryId: string;
  /** question, paraphrase or answer */
  kind: 'q' | 'p' | 'a';
  text: string;
}

interface LangIndex {
  ms: MiniSearch<KbDoc>;
  units: Map<string, Unit[]>;
  df: Map<string, number>;
  docs: number;
  /** Products each entry's question is about. */
  products: Map<string, Set<string>>;
}

export interface Match {
  entry: KnowledgeEntry;
  confidence: number;
  /**
   * The entry is about a product the message doesn't name, and the message has a word no entry
   * uses ("do you sell glass for telescopes?" vs the glass shelves entry): a guess, not an answer.
   */
  offProduct: boolean;
  unknownShare: number;
}

export interface ScoreParams {
  /** A partial (typo or prefix) match of a word counts this much of an exact one. */
  partial: number;
  /** An answer-text match counts this much of a question/paraphrase match. */
  answerDoc: number;
  /** City names matter little for which answer fits (cities are handled separately). */
  cityWeight: number;
  /** Words the knowledge base never uses (chatter: "hi, we just moved…") weigh this much of a rare known word. */
  unknownWeight: number;
  /** Share of the confidence that comes from covering the visitor's words (the rest: covering the matched paraphrase). */
  queryShare: number;
  /** A second matching wording of the same entry adds this share of its own confidence. */
  support: number;
  /** An entry about a product the visitor didn't mention keeps this share ("how long does installation take?" → the general answer, not the storefront one). */
  productMismatch: number;
  /** Added for the site's official FAQ answers (preferred in a near tie). */
  officialBonus: number;
  /** Share of the message's weight in unknown words above which an entry about another product is only a guess. */
  offProductUnknown: number;
}

export const DEFAULT_SCORE: ScoreParams = { partial: 0.6, answerDoc: 0.75, cityWeight: 0.35, unknownWeight: 1, queryShare: 0.6, support: 0.2, productMismatch: 0.9, officialBonus: 0.03, offProductUnknown: 0.4 };

/**
 * MiniSearch candidates (best text matches) that get a confidence score. The cut also keeps out
 * close rival paraphrases: scoring 80, 120 or all candidates (or adding those with a rare query
 * word) gained some unseen questions but lost more in every language (paraphrase fold check, Oct 2026).
 */
const CANDIDATES = 60;

/** Synonym concepts that name a product (see synonyms.ts). */
const PRODUCT_CONCEPTS = new Set(['~shower', '~railing', '~mirror', '~storefront', '~partition', '~door', '~backsplash', '~shelf']);

/** The words of a text as units (repeated words counted once). */
export function textUnits(text: string): Unit[] {
  const seen = new Set<string>();
  const units: Unit[] = [];
  for (const token of tokenize(text)) {
    const v = processTerm(token);
    if (!v) continue;
    const unit = Array.isArray(v) ? v : [v];
    const key = unit[0];
    if (seen.has(key)) continue;
    seen.add(key);
    units.push(unit);
  }
  return units;
}

const indexes = new Map<SupportedLocale, LangIndex>();

function getIndex(lang: SupportedLocale): LangIndex {
  let index = indexes.get(lang);
  if (index) return index;

  const docs: KbDoc[] = [];
  for (const e of APPROVED_ENTRIES) {
    docs.push({ id: `${e.id}#q`, entryId: e.id, kind: 'q', text: e.question[lang] });
    e.paraphrases[lang].forEach((text, i) => docs.push({ id: `${e.id}#p${i}`, entryId: e.id, kind: 'p', text }));
    docs.push({ id: `${e.id}#a`, entryId: e.id, kind: 'a', text: e.answer[lang] });
  }

  const ms = new MiniSearch<KbDoc>({
    fields: ['text'],
    storeFields: ['entryId', 'kind'],
    tokenize,
    processTerm,
    searchOptions: { prefix: SEARCH_OPTIONS.searchOptions.prefix, fuzzy: SEARCH_OPTIONS.searchOptions.fuzzy, combineWith: 'OR' },
  });
  ms.addAll(docs);

  const units = new Map<string, Unit[]>();
  const df = new Map<string, number>();
  for (const d of docs) {
    const u = textUnits(d.text);
    units.set(d.id, u);
    for (const term of new Set(u.flat())) df.set(term, (df.get(term) ?? 0) + 1);
  }

  const products = new Map<string, Set<string>>();
  for (const e of APPROVED_ENTRIES) {
    products.set(e.id, new Set(textUnits(e.question[lang]).flat().filter((t) => PRODUCT_CONCEPTS.has(t))));
  }

  index = { ms, units, df, docs: docs.length, products };
  indexes.set(lang, index);
  return index;
}

const isKnown = (unit: Unit, index: LangIndex) => unit.some((v) => (index.df.get(v) ?? 0) > 0);

/**
 * The visitor's words as units; a word the knowledge base doesn't know also gets the concepts
 * of a dictionary word one typo away ("מעקא" → ~railing), so it counts as that word.
 */
function queryUnits(message: string, index: LangIndex): Unit[] {
  return textUnits(message).map((unit) => {
    if (isKnown(unit, index)) return unit;
    const typos = new Set(unit.filter((v) => !/^[~=]/.test(v)).flatMap(typoConcepts));
    return typos.size ? [...unit, ...[...typos].filter((c) => !unit.includes(c))] : unit;
  });
}

function unitWeight(unit: Unit, index: LangIndex, p: ScoreParams): number {
  let idf = 0;
  for (const v of unit) idf = Math.max(idf, Math.log(1 + index.docs / ((index.df.get(v) ?? 0) + 1)));
  if (!isKnown(unit, index)) idf *= p.unknownWeight;
  return unit.some((v) => v.startsWith('~city-')) ? idf * p.cityWeight : idf;
}

/** Knowledge base entries for a message, best first, with confidence (0–1). */
export function searchKnowledge(message: string, lang: SupportedLocale, limit = 5, p: ScoreParams = DEFAULT_SCORE): Match[] {
  const index = getIndex(lang);
  const units = queryUnits(message, index);
  if (!units.length) return [];
  const queryTerms = new Set(units.flat());
  const weights = units.map((u) => unitWeight(u, index, p));
  const known = units.map((u) => isKnown(u, index));
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;

  const best = new Map<string, { confidence: number; second: number; score: number; unknownShare: number }>();
  for (const r of index.ms.search(message).slice(0, CANDIDATES)) {
    const docUnits = index.units.get(r.id) ?? [];
    const docTerms = new Set(docUnits.flat());
    const partial = new Set<string>(r.queryTerms as string[]); // matched exactly, by prefix or with a typo
    const fuzzyDocTerms = new Set<string>(r.terms as string[]);

    let covered = 0;
    let unknown = 0;
    units.forEach((u, i) => {
      if (u.some((v) => docTerms.has(v))) covered += weights[i];
      else if (u.some((v) => partial.has(v))) covered += weights[i] * p.partial;
      else if (!known[i]) unknown += weights[i];
    });
    const unknownShare = unknown / totalWeight;
    const queryCoverage = covered / totalWeight;

    let confidence: number;
    if (r.kind === 'a') {
      confidence = queryCoverage * p.answerDoc;
    } else {
      let docCovered = 0;
      for (const u of docUnits) {
        if (u.some((v) => queryTerms.has(v))) docCovered += 1;
        else if (u.some((v) => fuzzyDocTerms.has(v))) docCovered += p.partial;
      }
      const docCoverage = docUnits.length ? docCovered / docUnits.length : 0;
      confidence = p.queryShare * queryCoverage + (1 - p.queryShare) * docCoverage;
    }

    const entryId = r.entryId as string;
    const prev = best.get(entryId);
    if (!prev) best.set(entryId, { confidence, second: 0, score: r.score, unknownShare });
    else if (confidence > prev.confidence) best.set(entryId, { confidence, second: prev.confidence, score: Math.max(prev.score, r.score), unknownShare });
    else prev.second = Math.max(prev.second, confidence);
  }

  const entryById = new Map(APPROVED_ENTRIES.map((e) => [e.id, e]));
  return [...best.entries()]
    .map(([id, v]) => {
      let confidence = v.confidence + p.support * v.second;
      const products = index.products.get(id);
      const otherProduct = !!products?.size && ![...products].some((c) => queryTerms.has(c));
      if (otherProduct) confidence *= p.productMismatch;
      if (entryById.get(id)?.official) confidence += p.officialBonus;
      // Normalized by the highest possible score, not capped — so near-perfect matches still rank
      return { id, score: v.score, offProduct: otherProduct && v.unknownShare >= p.offProductUnknown, unknownShare: v.unknownShare, confidence: confidence / (1 + p.support + p.officialBonus) };
    })
    .sort((a, b) => b.confidence - a.confidence || b.score - a.score)
    .slice(0, limit)
    .map((v) => ({ entry: entryById.get(v.id)!, confidence: Math.round(v.confidence * 1000) / 1000, offProduct: v.offProduct, unknownShare: v.unknownShare }));
}

/** Share of a message's weight in words the knowledge base never uses (0–1; typos of dictionary words count as unknown). */
export function unknownShare(message: string, lang: SupportedLocale, p: ScoreParams = DEFAULT_SCORE): number {
  const index = getIndex(lang);
  const units = textUnits(message);
  const weights = units.map((u) => unitWeight(u, index, p));
  const total = weights.reduce((a, b) => a + b, 0);
  return total ? units.reduce((sum, u, i) => sum + (isKnown(u, index) ? 0 : weights[i]), 0) / total : 0;
}

/** Concept tokens (~price, ~city-haifa…) in a message; with a language, also those of typos ("אחריוט" → ~warranty, see queryUnits). */
export function messageConcepts(message: string, lang?: SupportedLocale): Set<string> {
  const units = lang ? queryUnits(message, getIndex(lang)) : textUnits(message);
  return new Set(units.flat().filter((t) => t.startsWith('~')));
}
