'use client';
/**
 * Plain <a> that fires a GA event on click — lets Server Components render
 * WhatsApp/phone CTAs as real links while keeping conversion tracking.
 */
import React from 'react';
import { trackEvent } from '@/lib/gtag';

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: { action: string; category: string; label: string };
}

const TrackedLink: React.FC<TrackedLinkProps> = ({ event, onClick, children, ...rest }) => (
  <a
    {...rest}
    onClick={(e) => {
      trackEvent(event);
      onClick?.(e);
    }}
  >
    {children}
  </a>
);

export default TrackedLink;
