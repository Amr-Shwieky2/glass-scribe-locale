/**
 * Quality check for the website assistant's own answer engine (Layer 1 only —
 * no AI, no network): runs a question file and prints, per language, how many
 * questions got the right direct answer, "Did you mean", a hand-off (not sure /
 * quote / WhatsApp) or a WRONG confident answer. Also validates the knowledge
 * base and checks that no wording copies a protected (held-out or blind) question.
 *
 *   npm run test:answers                       tests/answer-engine/questions.json
 *   npm run test:answers -- --file <path>      another file (relative to the repo or absolute):
 *     tests/answer-engine/blind.json         BLIND set: the score we report. Never read its failures
 *                                            to write paraphrases, synonyms or rules (details are hidden)
 *     tests/answer-engine/calibration.json   for engine thresholds only — never for paraphrases/synonyms
 *     tests/answer-engine/regressions.json   every bug found so far: must never answer wrongly again
 *     tests/answer-engine/he-probes.json     Hebrew tuning probes
 *   --lang he         one language
 *   --quiet           summary only
 *   --tuning          leave out held-out questions (when working on content)
 *   --min <percent>   minimum correct direct answers per language (default 85; 0 = report only)
 *   --show-holdout    also list failures of held-out/blind questions (don't tune on them!)
 *   --report-only     print the scores but don't fail on wrong answers or --min (for the blind and
 *                     calibration sets: a gate on them would invite tuning on them); copies still fail
 *
 * A question may have a "history": earlier visitor messages of the same conversation (oldest first). The engine
 * answers each of them first, and the question is asked as their follow-up ("and the price?").
 *
 * Labels ("expected"): an approved entry id or an array of acceptable ids, "quote",
 * "out-of-scope", or "handoff" (in scope, but no approved entry answers it).
 * A WRONG answer is a confident direct answer that doesn't fit: another entry, an
 * answer to an off-topic or hand-off question, a quote/price reply to an off-topic one,
 * or anything the question's "forbid" list names (e.g. the quote flow for "don't call me").
 *
 * Fails (exit 1) on any wrong answer, a language under --min, a slow answer
 * (p95 over 100 ms), knowledge base errors or a copied protected question.
 */
import { readFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { validateKnowledgeBase, APPROVED_ENTRIES, KNOWLEDGE_BASE } from '@/data/knowledge';
import type { SupportedLocale } from '@/data/types';
import { answerMessage, searchKnowledge } from '@/lib/answer-engine';
import type { ChatTurn } from '@/lib/chat-protocol';
import { normalizeText, splitWords } from '@/lib/search/normalize';
import { stems } from '@/lib/search/tokenize';

interface TestQuestion {
  lang: SupportedLocale;
  q: string;
  expected: string | string[];
  /** Written separately and never used to tune paraphrases, synonyms or rules. */
  holdout?: boolean;
  /** Replies that count as wrong here: a reply kind ("quote", "answer") or "prefill:<product>" (the quote form opened with that product). */
  forbid?: string[];
  /** Earlier visitor messages of the conversation, oldest first: the question is their follow-up. */
  history?: string[];
}

const LANGS: SupportedLocale[] = ['he', 'en', 'ar', 'ru'];
const LABELS = new Set(['quote', 'out-of-scope', 'handoff']);
const DIR = 'tests/answer-engine';
/** Question files whose questions must never be copied into the knowledge base or tuning files. */
const PROTECTED_FILES = [`${DIR}/blind.json`, `${DIR}/calibration.json`, `${DIR}/he-blind-2.json`];
/** Files that are used to tune content: they must not contain protected questions either. */
const TUNING_FILES = [`${DIR}/questions.json`, `${DIR}/he-probes.json`, `${DIR}/regressions.json`];

const args = process.argv.slice(2);
function option(name: string): string | null {
  const i = args.indexOf(name);
  if (i < 0) return null;
  const value = args[i + 1];
  if (!value || value.startsWith('--')) {
    console.error(`${name} needs a value`);
    process.exit(1);
  }
  return value;
}
const onlyLang = option('--lang') as SupportedLocale | null;
if (onlyLang && !LANGS.includes(onlyLang)) {
  console.error(`Unknown --lang "${onlyLang}" (use one of: ${LANGS.join(', ')})`);
  process.exit(1);
}
const quiet = args.includes('--quiet');
const tuning = args.includes('--tuning');
const showHoldout = args.includes('--show-holdout');
const reportOnly = args.includes('--report-only');
const minPct = Number(option('--min') ?? 85);
if (!Number.isFinite(minPct) || minPct < 0 || minPct > 100) {
  console.error('--min must be a percentage from 0 to 100');
  process.exit(1);
}
const file = option('--file') ?? `${DIR}/questions.json`;
const resolve = (path: string) => (isAbsolute(path) ? path : join(process.cwd(), path));
const readQuestions = (path: string): TestQuestion[] => JSON.parse(readFileSync(resolve(path), 'utf8')) as TestQuestion[];
const tryRead = (path: string): TestQuestion[] => {
  try {
    return readQuestions(path);
  } catch {
    return [];
  }
};

const questions = readQuestions(file).filter((q) => (!onlyLang || q.lang === onlyLang) && (!tuning || !q.holdout));
let failed = false;
if (!questions.length) {
  console.error('No test questions selected.');
  process.exit(1);
}

// ---- knowledge base content -------------------------------------------------
const kbErrors = validateKnowledgeBase();
const drafts = KNOWLEDGE_BASE.length - APPROVED_ENTRIES.length;
console.log(`Knowledge base: ${KNOWLEDGE_BASE.length} entries — ${APPROVED_ENTRIES.length} approved, ${drafts} drafts`);
if (kbErrors.length) {
  failed = true;
  console.log(`  ✗ ${kbErrors.length} content problems:`);
  for (const e of kbErrors) console.log(`    ${e}`);
}
const approvedIds = new Set(APPROVED_ENTRIES.map((e) => e.id));
const expectedIds = (q: TestQuestion) => (Array.isArray(q.expected) ? q.expected : LABELS.has(q.expected) ? [] : [q.expected]);
const badLabels = questions.filter((q) => expectedIds(q).some((id) => !approvedIds.has(id)) || (Array.isArray(q.expected) && !q.expected.length));
if (badLabels.length) {
  failed = true;
  console.log(`  ✗ ${badLabels.length} test questions expect an unknown/draft entry: ${[...new Set(badLabels.flatMap(expectedIds))].join(', ')}`);
}

// ---- no copied protected questions --------------------------------------------
// A paraphrase or tuning question that (nearly) repeats a held-out/blind question
// makes that question's score meaningless. Words are compared without Hebrew/Arabic prefixes.
const wordSet = (text: string) =>
  new Set(splitWords(normalizeText(text)).map((w) => [w, ...stems(w)].reduce((a, b) => (b.length < a.length ? b : a))).filter((w) => w.length > 1));
function nearCopy(a: Set<string>, b: Set<string>): boolean {
  if (a.size < 3 || b.size < 3) return a.size === b.size && [...a].every((w) => b.has(w));
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  return shared / (a.size + b.size - shared) >= 0.75;
}
const protectedQs = [
  ...PROTECTED_FILES.flatMap((f) => tryRead(f)),
  ...tryRead(`${DIR}/questions.json`).filter((q) => q.holdout),
].map((q) => ({ q, words: wordSet(q.q) }));
const byWord = new Map<string, number[]>();
protectedQs.forEach((p, i) => p.words.forEach((w) => byWord.set(w, [...(byWord.get(w) ?? []), i])));
const sources: { where: string; text: string }[] = [
  ...KNOWLEDGE_BASE.flatMap((e) =>
    LANGS.flatMap((l) => [e.question[l], ...e.paraphrases[l]].map((text) => ({ where: `${e.id} (${l})`, text })))),
  ...TUNING_FILES.flatMap((f) => tryRead(f).filter((q) => !q.holdout).flatMap((q) => [q.q, ...(q.history ?? [])].map((text) => ({ where: f, text })))),
];
const leaks: string[] = [];
for (const s of sources) {
  const words = wordSet(s.text);
  const candidates = new Set([...words].flatMap((w) => byWord.get(w) ?? []));
  for (const i of candidates) {
    if (nearCopy(words, protectedQs[i].words)) leaks.push(`${s.where}: "${s.text}" ≈ protected "${protectedQs[i].q.q}"`);
  }
}
if (leaks.length) {
  failed = true;
  console.log(`  ✗ ${leaks.length} wordings copy a held-out/blind question (remove or rewrite them):`);
  for (const l of leaks) console.log(`    ${l}`);
}

// ---- run ------------------------------------------------------------------------
/** correct: right direct answer · suggest: "Did you mean" · handoff: not sure / quote / WhatsApp · wrong: confident wrong answer */
type Outcome = 'correct' | 'suggest' | 'handoff' | 'wrong';
interface Row { q: TestQuestion; outcome: Outcome; got: string; confidence: number; ms: number }
const rows: Row[] = [];

function outcomeFor(q: TestQuestion, kind: string, entryId?: string, prefillProduct?: string): Outcome {
  if (q.forbid?.some((f) => f === kind || (prefillProduct && f === `prefill:${prefillProduct}`))) return 'wrong';
  if (kind === 'suggest') return 'suggest';
  if (q.expected === 'out-of-scope') return kind === 'answer' || kind === 'quote' ? 'wrong' : 'correct';
  if (q.expected === 'handoff') return kind === 'answer' ? 'wrong' : 'correct';
  if (q.expected === 'quote') return kind === 'quote' ? 'correct' : kind === 'answer' ? 'wrong' : 'handoff';
  if (kind === 'answer') return entryId && expectedIds(q).includes(entryId) ? 'correct' : 'wrong';
  return 'handoff';
}

/** The conversation before the question: each earlier message with the engine's own reply. */
function conversation(q: TestQuestion): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (const message of q.history ?? []) {
    const reply = answerMessage({ message, pageLocale: q.lang, history: [...turns] });
    turns.push({ role: 'user', content: message }, { role: 'assistant', content: reply.text });
  }
  return turns;
}

for (const q of questions) {
  const history = conversation(q);
  const start = performance.now();
  const r = answerMessage({ message: q.q, pageLocale: q.lang, history });
  const ms = performance.now() - start;
  const got = r.kind === 'answer' ? `answer:${r.entryId}` : r.kind === 'suggest' ? `suggest:[${r.suggestions?.map((s) => s.id).join(', ')}]` : r.kind;
  rows.push({ q, outcome: outcomeFor(q, r.kind, r.entryId, r.quotePrefill?.product), got, confidence: r.confidence, ms });
}

// ---- report ---------------------------------------------------------------------
const pct = (n: number, d: number) => (d ? `${((100 * n) / d).toFixed(1)}%` : '—');
function summary(label: string, subset: Row[]) {
  const n = subset.length;
  const count = (o: Outcome) => subset.filter((r) => r.outcome === o).length;
  console.log(
    `  ${label.padEnd(10)} ${String(n).padStart(4)} questions | correct ${pct(count('correct'), n).padStart(6)} | did-you-mean ${pct(count('suggest'), n).padStart(6)} | hand-off ${pct(count('handoff'), n).padStart(6)} | wrong ${String(count('wrong')).padStart(3)}`,
  );
  return n ? (100 * count('correct')) / n : 100;
}

console.log(`\nLayer 1 only (no AI), ${file}:`);
for (const lang of LANGS) {
  const subset = rows.filter((r) => r.q.lang === lang);
  if (!subset.length) continue;
  if (summary(lang, subset) < minPct && !reportOnly) {
    failed = true;
    console.log(`    ✗ under ${minPct}% correct`);
  }
}
summary('all', rows);
const holdout = rows.filter((r) => r.q.holdout);
if (holdout.length && holdout.length < rows.length) {
  console.log('\nHeld-out questions only (never used for tuning):');
  for (const lang of LANGS) {
    const subset = holdout.filter((r) => r.q.lang === lang);
    if (subset.length) summary(lang, subset);
  }
  summary('all', holdout);
}

const wrong = rows.filter((r) => r.outcome === 'wrong');
console.log(`\nConfident wrong answers: ${wrong.length} (off-topic questions answered: ${wrong.filter((r) => r.q.expected === 'out-of-scope').length})`);
if (wrong.length && !reportOnly) failed = true;

// The first question per language also builds that language's index (once per server instance)
const firstPerLang = new Set(LANGS.map((l) => rows.find((r) => r.q.lang === l)).filter(Boolean));
const cold = [...firstPerLang].map((r) => r!.ms);
const times = rows.filter((r) => !firstPerLang.has(r)).map((r) => r.ms).sort((a, b) => a - b);
if (times.length) {
  const p95 = times[Math.min(times.length - 1, Math.floor(times.length * 0.95))];
  console.log(`Time per answer: median ${times[Math.floor(times.length / 2)].toFixed(1)} ms, p95 ${p95.toFixed(1)} ms (index build per language on a cold start: ${cold.map((ms) => ms.toFixed(0)).join(' / ')} ms)`);
  if (p95 > 100) {
    failed = true;
    console.log('  ✗ p95 over 100 ms');
  }
}

const failures = rows.filter((r) => r.outcome !== 'correct');
const hidden = failures.filter((r) => r.q.holdout && !showHoldout);
// Wrong answers are always listed: they must be fixed, whatever set they come from
const listed = [...failures.filter((r) => !hidden.includes(r)), ...hidden.filter((r) => r.outcome === 'wrong')];
if (!quiet && listed.length) {
  console.log(`\nNot answered correctly (${listed.length}):`);
  for (const r of listed) {
    const top = searchKnowledge(r.q.q, r.q.lang, 3).map((m) => `${m.entry.id} ${m.confidence}`).join(' | ');
    const before = r.q.history?.length ? `(after ${r.q.history.map((h) => `"${h}"`).join(', ')}) ` : '';
    console.log(`  [${r.q.lang}${r.q.holdout ? ' holdout' : ''}] ${r.outcome.toUpperCase()}  ${before}"${r.q.q}"  expected ${JSON.stringify(r.q.expected)} → got ${r.got} (conf ${r.confidence.toFixed(2)})  top: ${top}`);
  }
}
const quietHoldout = hidden.filter((r) => r.outcome !== 'wrong').length;
if (!quiet && quietHoldout) {
  console.log(`\n(${quietHoldout} held-out questions not listed — they are not for tuning; --show-holdout lists them)`);
}

console.log(failed ? '\n✗ FAILED' : '\n✓ PASSED');
process.exit(failed ? 1 : 0);
