'use client';
/**
 * One-line "Have a question about …? Ask our AI" button (service pages, in place
 * of the FAQ block). Opens the chat with the service name already in the
 * message box, so the question reaches the AI with its context.
 */
import React from 'react';
import { Sparkles } from 'lucide-react';
import { loadChatPanel, openChat } from './chat-events';

interface AskAiLineProps {
  question: string;
  cta: string;
  /** Start of the visitor's message, e.g. "Question about glass railings: ". */
  draft: string;
}

const AskAiLine: React.FC<AskAiLineProps> = ({ question, cta, draft }) => (
  <button
    type="button"
    onClick={() => openChat({ draft })}
    onPointerEnter={loadChatPanel}
    onFocus={loadChatPanel}
    aria-haspopup="dialog"
    className="group inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-brand-navy/15 bg-white px-5 py-3 text-start text-base text-brand-navy shadow-sm transition-colors hover:border-brand-gold hover:bg-brand-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
  >
    <Sparkles className="h-5 w-5 shrink-0 text-brand-gold" aria-hidden="true" />
    <span>{question}</span>{' '}
    <span className="font-semibold underline decoration-brand-gold decoration-2 underline-offset-4">{cta}</span>
  </button>
);

export default AskAiLine;
