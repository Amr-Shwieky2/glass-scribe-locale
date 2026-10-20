/**
 * Quality check for the website assistant's own answer engine (Layer 1 only —
 * no AI, no network): runs tests/answer-engine/questions.json and prints
 * accuracy per language, the "Did you mean" and "no answer" rates, timing and
 * every failure. Also validates the knowledge base content.
 *
 *   npm run test:answers                 all questions
 *   npm run test:answers -- --lang he    one language
 *   npm run test:answers -- --quiet      summary only
 *   npm run test:answers -- --tuning     leave out the held-out questions (when tuning content)
 *   npm run test:answers -- --file <path>  another question file:
 *     tests/answer-engine/he-blind-2.json  blind Hebrew batch (all held out: run it with --quiet, never tune on it)
 *     tests/answer-engine/he-probes.json   Hebrew tuning probes (phone-style, typos, long chatty messages)
 *
 * Fails (exit 1) when a language is under 85% correct direct answers, any
 * out-of-scope question gets a direct answer, or the knowledge base has errors.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateKnowledgeBase, APPROVED_ENTRIES, KNOWLEDGE_BASE } from '@/data/knowledge';
import type { SupportedLocale } from '@/data/types';
import { answerMessage, searchKnowledge } from '@/lib/answer-engine';

interface TestQuestion {
  lang: SupportedLocale;
  q: string;
  /** Knowledge base id, "quote" or "out-of-scope". */
  expected: string;
  /** Written separately from the knowledge base and never used to tune it. */
  holdout?: boolean;
}

const TARGET = 0.85;
const LANGS: SupportedLocale[] = ['he', 'en', 'ar', 'ru'];
const args = process.argv.slice(2);
const onlyLang = args.includes('--lang') ? (args[args.indexOf('--lang') + 1] as SupportedLocale) : null;
if (onlyLang && !LANGS.includes(onlyLang)) {
  console.error(`Unknown --lang "${onlyLang}" (use one of: ${LANGS.join(', ')})`);
  process.exit(1);
}
const quiet = args.includes('--quiet');
const tuning = args.includes('--tuning');
const file = args.includes('--file') ? args[args.indexOf('--file') + 1] : 'tests/answer-engine/questions.json';

const questions = (JSON.parse(readFileSync(join(process.cwd(), file), 'utf8')) as TestQuestion[])
  .filter((q) => (!onlyLang || q.lang === onlyLang) && (!tuning || !q.holdout));

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
const unknown = questions.filter((q) => q.expected !== 'quote' && q.expected !== 'out-of-scope' && !approvedIds.has(q.expected));
if (unknown.length) {
  failed = true;
  console.log(`  ✗ ${unknown.length} test questions expect an unknown/draft entry: ${[...new Set(unknown.map((q) => q.expected))].join(', ')}`);
}

// ---- run ------------------------------------------------------------------------
type Outcome = 'correct' | 'suggest' | 'none' | 'wrong';
interface Row { q: TestQuestion; outcome: Outcome; got: string; confidence: number; ms: number }
const rows: Row[] = [];

for (const q of questions) {
  const start = performance.now();
  const r = answerMessage({ message: q.q, pageLocale: q.lang });
  const ms = performance.now() - start;
  const got = r.kind === 'answer' ? `answer:${r.entryId}` : r.kind === 'suggest' ? `suggest:[${r.suggestions?.map((s) => s.id).join(', ')}]` : r.kind;
  let outcome: Outcome;
  if (q.expected === 'out-of-scope') outcome = r.kind === 'answer' ? 'wrong' : r.kind === 'suggest' ? 'suggest' : 'correct';
  else if (q.expected === 'quote') outcome = r.kind === 'quote' ? 'correct' : r.kind === 'answer' ? 'wrong' : r.kind === 'suggest' ? 'suggest' : 'none';
  else if (r.kind === 'answer') outcome = r.entryId === q.expected ? 'correct' : 'wrong';
  else outcome = r.kind === 'suggest' ? 'suggest' : 'none';
  rows.push({ q, outcome, got, confidence: r.confidence, ms });
}

// ---- report ---------------------------------------------------------------------
const pct = (n: number, d: number) => (d ? `${((100 * n) / d).toFixed(1)}%` : '—');
function summary(label: string, subset: Row[]) {
  const n = subset.length;
  const count = (o: Outcome) => subset.filter((r) => r.outcome === o).length;
  console.log(
    `  ${label.padEnd(10)} ${String(n).padStart(4)} questions | correct ${pct(count('correct'), n).padStart(6)} | did-you-mean ${pct(count('suggest'), n).padStart(6)} | no answer ${pct(count('none'), n).padStart(6)} | wrong ${String(count('wrong')).padStart(3)}`,
  );
  return n ? count('correct') / n : 1;
}

console.log('\nLayer 1 only (no AI):');
for (const lang of LANGS) {
  const subset = rows.filter((r) => r.q.lang === lang);
  if (!subset.length) continue;
  const acc = summary(lang, subset);
  if (acc < TARGET) failed = true;
}
summary('all', rows);
const holdout = rows.filter((r) => r.q.holdout);
if (holdout.length) {
  console.log('\nHeld-out questions only (never used for tuning):');
  for (const lang of LANGS) {
    const subset = holdout.filter((r) => r.q.lang === lang);
    if (subset.length) summary(lang, subset);
  }
  summary('all', holdout);
}

const oosWrong = rows.filter((r) => r.q.expected === 'out-of-scope' && r.outcome === 'wrong');
console.log(`\nOut-of-scope questions answered as if in scope: ${oosWrong.length}`);
if (oosWrong.length) failed = true;

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
if (!quiet && failures.length) {
  console.log(`\nNot answered correctly (${failures.length}):`);
  for (const r of failures) {
    const top = searchKnowledge(r.q.q, r.q.lang, 3).map((m) => `${m.entry.id} ${m.confidence}`).join(' | ');
    console.log(`  [${r.q.lang}${r.q.holdout ? ' holdout' : ''}] ${r.outcome.toUpperCase()}  "${r.q.q}"  expected ${r.q.expected} → got ${r.got} (conf ${r.confidence.toFixed(2)})  top: ${top}`);
  }
}

console.log(failed ? '\n✗ FAILED' : '\n✓ PASSED');
process.exit(failed ? 1 : 0);
