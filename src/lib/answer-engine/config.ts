/**
 * Confidence thresholds of the answer engine (0–1), in one place. Tuned with
 * the test set: `npm run test:answers` (tests/answer-engine/questions.json).
 * The best entry is answered directly when it is either confident with a small
 * lead over the runner-up, or less confident but clearly ahead of it.
 */
export const THRESHOLDS = {
  /** Answer at or above this confidence… */
  answer: 0.6,
  /** …when the runner-up is at least this much lower. */
  margin: 0.02,
  /** Or answer at or above this confidence… */
  answerLow: 0.42,
  /** …when the runner-up is at least this much lower. */
  marginLow: 0.08,
  /** …or this much lower for a message with at least `longWords` content words. */
  marginLowLong: 0.05,
  longWords: 8,
  /** "Did you mean…?" at or above this. */
  suggest: 0.3,
  /** Suggestions shown in "Did you mean…?". */
  maxSuggestions: 3,
  /** Related-question buttons under an answer. */
  maxRelated: 2,
  /** A message with at most this many content words is read together with the previous one. */
  followUpWords: 4,
  /** A message naming a city with at most this many content words (and nothing else asked) is a coverage question. */
  cityOnlyWords: 3,
  /** A message tied to us only by "price", "glass" or "install" counts as off-domain when this share of it is words the knowledge base never uses. */
  weakAnchorUnknown: 0.3,
  /** Without a glass/service word, a message needs at least this many content words to be answered. */
  unanchoredMinWords: 2,
  /** Knowledge base entries at least this confident are given to the free-tier AI as grounding. */
  groundingMin: 0.15,
};
