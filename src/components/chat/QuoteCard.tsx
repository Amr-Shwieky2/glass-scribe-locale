'use client';
/**
 * Quote-request confirmation card. The model only pre-fills it; nothing is
 * sent until the visitor checks the details, ticks consent and presses Send.
 * If sending fails, the card offers WhatsApp with the details pre-filled so
 * the lead is never lost.
 */
import React, { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { isValidPhone } from '@/lib/validation';
import { CHAT_LIMITS, QUOTE_FIELD_LIMITS as LIMITS, type QuoteDraft } from '@/lib/chat-protocol';
import { CONSENT_LABELS, PRIVACY_LINK_LABELS } from '@/data/consent';
import type { ChatStrings } from '@/data/chat';
import type { SupportedLocale } from '@/data/types';

interface QuoteCardProps {
  locale: SupportedLocale;
  s: ChatStrings;
  draft: QuoteDraft;
  /** What the visitor wrote in the chat (≤ 600 chars) — shown and editable, sent with the lead. */
  summary: string;
  whatsappNumber: string;
  onSent: () => void;
  onCancel: () => void;
  onWhatsAppClick?: () => void;
}

type Field = 'name' | 'phone' | 'city' | 'service' | 'details' | 'summary';

async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/csrf/token', { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).token ?? null;
  } catch {
    return null;
  }
}

const QuoteCard: React.FC<QuoteCardProps> = ({ locale, s, draft, summary, whatsappNumber, onSent, onCancel, onWhatsAppClick }) => {
  const uid = useId();
  const [fields, setFields] = useState<Record<Field, string>>({
    name: draft.name, phone: draft.phone, city: draft.city, service: draft.service, details: draft.details,
    summary: summary.slice(0, CHAT_LIMITS.maxSummaryChars),
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field | 'consent', string>>>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    fetchCsrfToken().then(setToken);
  }, []);

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    const name = fields.name.trim();
    if (name.length < 2 || name.length > LIMITS.name) next.name = s.nameInvalid;
    if (!isValidPhone(fields.phone.trim())) next.phone = s.phoneInvalid;
    if (!consent) next.consent = s.consentRequired;
    setErrors(next);
    // Take keyboard / screen-reader users straight to the first problem
    const firstInvalid = (['name', 'phone', 'consent'] as const).find((k) => next[k]);
    if (firstInvalid) document.getElementById(`${uid}-${firstInvalid}`)?.focus();
    return !firstInvalid;
  };

  const post = (csrfToken: string | null) =>
    fetch('/api/chat/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fields.name.trim(),
        phone: fields.phone.trim(),
        city: fields.city.trim(),
        service: fields.service.trim(),
        details: fields.details.trim(),
        language: draft.language,
        consent: true,
        csrfToken,
        page: window.location.pathname,
        summary: fields.summary.trim().slice(0, CHAT_LIMITS.maxSummaryChars),
      }),
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || !validate()) return;
    setSending(true);
    setFailed(false);
    try {
      let res = await post(token ?? (await fetchCsrfToken()));
      if (res.status === 403) {
        // Token expired (they're valid for 1 hour) — get a fresh one and retry once
        const fresh = await fetchCsrfToken();
        setToken(fresh);
        res = await post(fresh);
      }
      if (res.ok) {
        onSent();
        return;
      }
      setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const leadText = [
    s.whatsappLeadPrefix,
    `${s.fieldName}: ${fields.name}`,
    `${s.fieldPhone}: ${fields.phone}`,
    fields.city && `${s.fieldCity}: ${fields.city}`,
    fields.service && `${s.fieldService}: ${fields.service}`,
    fields.details && `${s.fieldDetails}: ${fields.details}`,
  ].filter(Boolean).join('\n');

  const input = (field: Exclude<Field, 'details' | 'summary'>, label: string, type = 'text', autoComplete?: string) => (
    <div>
      <label htmlFor={`${uid}-${field}`} className="block text-xs font-semibold text-brand-navy/80 mb-1">{label}</label>
      <input
        id={`${uid}-${field}`}
        type={type}
        dir="auto"
        value={fields[field]}
        onChange={set(field)}
        maxLength={LIMITS[field]}
        autoComplete={autoComplete}
        aria-invalid={!!errors[field]}
        aria-describedby={errors[field] ? `${uid}-${field}-err` : undefined}
        className={`w-full rounded-lg border px-3 py-2 text-base text-brand-navy bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors[field] && <p id={`${uid}-${field}-err`} role="alert" className="mt-1 text-xs text-red-600">{errors[field]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-brand-gold/60 bg-white p-4 shadow-sm space-y-3" aria-labelledby={`${uid}-title`} noValidate>
      <h3 id={`${uid}-title`} className="font-bold text-brand-navy">{s.quoteTitle}</h3>
      {input('name', s.fieldName, 'text', 'name')}
      {input('phone', s.fieldPhone, 'tel', 'tel')}
      {input('city', s.fieldCity, 'text', 'address-level2')}
      {input('service', s.fieldService)}
      <div>
        <label htmlFor={`${uid}-details`} className="block text-xs font-semibold text-brand-navy/80 mb-1">{s.fieldDetails}</label>
        <textarea
          id={`${uid}-details`}
          dir="auto"
          rows={3}
          value={fields.details}
          onChange={set('details')}
          maxLength={LIMITS.details}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-brand-navy bg-white resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        />
      </div>

      {/* What the visitor wrote in the chat — visible and editable, because it is sent with the request */}
      <div>
        <label htmlFor={`${uid}-summary`} className="block text-xs font-semibold text-brand-navy/80 mb-1">{s.fieldSummary}</label>
        <textarea
          id={`${uid}-summary`}
          dir="auto"
          rows={3}
          value={fields.summary}
          onChange={set('summary')}
          maxLength={CHAT_LIMITS.maxSummaryChars}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-brand-navy bg-white resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        />
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            id={`${uid}-consent`}
            type="checkbox"
            checked={consent}
            onChange={(e) => { setConsent(e.target.checked); if (errors.consent) setErrors((er) => ({ ...er, consent: undefined })); }}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
            className="mt-1 h-4 w-4 accent-brand-navy"
          />
          <span>
            {CONSENT_LABELS[locale]}{' '}
            {/* New tab: on mobile the chat is a full-screen sheet and would hide the page */}
            <Link href={`/${locale}/privacy`} target="_blank" rel="noopener" className="underline text-brand-navy hover:text-brand-gold">{PRIVACY_LINK_LABELS[locale]}</Link>
          </span>
        </label>
        {errors.consent && <p id={`${uid}-consent-err`} role="alert" className="mt-1 text-xs text-red-600">{errors.consent}</p>}
      </div>

      {failed && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800 space-y-2">
          <p>{s.sendFailed}</p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(leadText)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="inline-flex items-center rounded-full bg-brand-gold px-4 py-2 font-semibold text-brand-navy"
          >
            {s.whatsapp}
          </a>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={sending}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-4 py-2.5 font-semibold text-brand-navy hover:bg-brand-gold/90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
        >
          {sending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {sending ? s.sending : s.sendRequest}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={sending}
          className="rounded-full border-2 border-brand-navy/20 px-4 py-2.5 font-semibold text-brand-navy hover:bg-brand-light disabled:opacity-60"
        >
          {s.cancel}
        </button>
      </div>
    </form>
  );
};

export default QuoteCard;
