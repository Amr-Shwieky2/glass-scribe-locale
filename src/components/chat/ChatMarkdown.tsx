'use client';
/**
 * Minimal, safe Markdown for assistant messages: paragraphs, line breaks,
 * **bold**, "- " / "1. " lists and [links](…). Everything is rendered as React
 * elements (never raw HTML). Links are allowed only to our own pages
 * (site-relative "/…"), WhatsApp (https://wa.me/…) and phone (tel:…); any
 * other link is shown as plain text.
 */
import React from 'react';
import Link from 'next/link';

type LinkKind = 'internal' | 'whatsapp' | 'tel';

function classifyHref(href: string): LinkKind | null {
  if (/^\/(?!\/)[^\s]*$/.test(href)) return 'internal';
  if (/^https:\/\/wa\.me\/\d{6,15}(\?[^\s]*)?$/.test(href)) return 'whatsapp';
  if (/^tel:\+?[\d-]{6,20}$/.test(href)) return 'tel';
  return null;
}

interface ChatMarkdownProps {
  text: string;
  onLinkClick?: (kind: LinkKind) => void;
}

const LINK_CLASS = 'font-semibold underline decoration-brand-gold decoration-2 underline-offset-2 hover:text-brand-gold focus-visible:outline-2';

function renderInline(text: string, keyPrefix: string, onLinkClick?: ChatMarkdownProps['onLinkClick']): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*([^*\n]{1,200})\*\*|\[([^\]\n]{1,120})\]\(([^)\s]{1,300})\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${m.index}`;
    if (m[1] !== undefined) {
      nodes.push(<strong key={key} className="font-semibold">{m[1]}</strong>);
    } else {
      const label = m[2];
      const href = m[3];
      const kind = classifyHref(href);
      if (kind === 'internal') {
        nodes.push(<Link key={key} href={href} className={LINK_CLASS} onClick={() => onLinkClick?.(kind)}>{label}</Link>);
      } else if (kind) {
        nodes.push(
          <a
            key={key}
            href={href}
            className={LINK_CLASS}
            onClick={() => onLinkClick?.(kind)}
            {...(kind === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {label}
          </a>
        );
      } else {
        nodes.push(label); // disallowed link: keep the text only
      }
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ text, onLinkClick }) => {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const k = `p${blocks.length}`;
    blocks.push(
      <p key={k}>
        {paragraph.flatMap((line, i) => (i ? [<br key={`${k}-br${i}`} />, ...renderInline(line, `${k}-${i}`, onLinkClick)] : renderInline(line, `${k}-${i}`, onLinkClick)))}
      </p>
    );
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    const k = `l${blocks.length}`;
    const items = list.items.map((item, i) => <li key={`${k}-${i}`}>{renderInline(item, `${k}-${i}`, onLinkClick)}</li>);
    blocks.push(
      list.ordered
        ? <ol key={k} className="list-decimal ps-5 space-y-1">{items}</ol>
        : <ul key={k} className="list-disc ps-5 space-y-1">{items}</ul>
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\d{1,2}[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      flushParagraph();
      const ordered = !!numbered;
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((bullet ?? numbered)![1]);
    } else if (!line) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line.replace(/^#{1,6}\s+/, ''));
    }
  }
  flushParagraph();
  flushList();

  return <div className="space-y-2 leading-relaxed break-words">{blocks}</div>;
};

export default ChatMarkdown;
