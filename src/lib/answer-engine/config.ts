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
  /** Without a glass/service word, a message needs at least this many content words to be answered… */
  unanchoredMinWords: 2,
  /** …and is not answered when this share of it is words that neither the knowledge base nor the match explains. */
  unanchoredUnknown: 0.4,
  /**
   * A match that explains only a message's product and loose words (price, glass, time, a room) is a guess when this
   * share of a short message is words the knowledge base never uses ("how much does a railing weigh")…
   */
  thinUnknown: 0.4,
  /** …or, under `answer` confidence, when this share of it is words the match doesn't explain. */
  thinUncovered: 0.5,
  /**
   * Last check on every direct answer: a confident wrong answer is worse than "Did you mean…?" or the hand-off.
   * At most this share of the message may be words the knowledge base never uses that the match leaves
   * unexplained ("how long is the warranty on my sofa", "hotel reviews in eilat")…
   */
  maxUnknown: 1,
  /** …and at most this share words the match doesn't explain at all; */
  maxUncovered: 1,
  /** for a long message (at least `longWords` content words: the visitor's situation, then the question): */
  maxUnknownLong: 1,
  maxUncoveredLong: 1,
  /**
   * A short message (at most this many content words: "מראה קטנה", "glass door tomorrow?") is answered directly only
   * when it says everything the matched wording says (at least `shortDocCoverage` of it) and nothing else — otherwise
   * it is too open to guess, and "Did you mean…?" lets the visitor choose.
   */
  shortWords: 2,
  shortDocCoverage: 1,
  /** …and leaves at most this share of the message unexplained. */
  shortUncovered: 0,
  /** …and at most this share words that occur nowhere in the entry (see Match.entryUncovered); */
  maxEntryUncovered: 0.35,
  maxEntryUncoveredLong: 0.6,
  /**
   * The quote/callback flow (with or without a phone number) starts for a message about our work, or with nothing
   * besides the request, places and times ("call me back, I'm in Haifa") — or, in a bare callback (no quote or
   * measurement word, no "about…"), with at most this many words the knowledge base doesn't use: a name ("דני
   * 0541234567"). "I need a quote for a website design", "תתקשרו אליי לגבי ההלוואה", "call me 052… about a pizza" don't.
   */
  quoteRestWords: 1,
  /**
   * Our hours and contact details (generated, or a contact entry) answer a message that doesn't speak to us ("your",
   * "שלכם") only when at most this share of its words, besides how it is put, places, times and premises, is missing
   * from those entries: "שעות פתיחה של חדר הכושר", "رقم تلفون العيادة" name someone else (see aboutUsOnly in index.ts).
   */
  maxGeneratedUncovered: 0.2,
  /** Knowledge base entries at least this confident are given to the free-tier AI as grounding. */
  groundingMin: 0.15,
};
