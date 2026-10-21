/**
 * Checks knowledge base content against the rules in src/data/knowledge/index.ts.
 *   npx tsx --tsconfig tsconfig.json scripts/check-knowledge.ts            all topics
 *   npx tsx --tsconfig tsconfig.json scripts/check-knowledge.ts showers    one topic file
 * Exits with code 1 when there is a problem.
 */
import { validateKnowledgeBase, KNOWLEDGE_BASE } from '@/data/knowledge';
import type { KnowledgeEntry } from '@/data/knowledge/types';

async function main() {
  const topic = process.argv[2];
  const entries: KnowledgeEntry[] = topic
    ? (await import(`../src/data/knowledge/${topic}.ts`)).default
    : KNOWLEDGE_BASE;
  // relatedIds may point to entries in other topic files
  const errors = validateKnowledgeBase(entries, new Set(KNOWLEDGE_BASE.map((e) => e.id)));
  const approved = entries.filter((e) => e.status === 'approved').length;
  console.log(`${topic ?? 'all topics'}: ${entries.length} entries (${approved} approved, ${entries.length - approved} draft)`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  if (errors.length) process.exit(1);
  console.log('  ✓ no problems');
}

main();
