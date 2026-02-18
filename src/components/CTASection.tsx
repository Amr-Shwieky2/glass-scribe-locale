/**
 * CTASection Component
 * Reusable call-to-action section used at the bottom of most pages.
 * Supports custom heading, description, and action buttons.
 */

import { type FC, type ReactNode } from 'react';

interface CTASectionProps {
  /** Background CSS classes (default: brand navy) */
  className?: string;
  children: ReactNode;
}

/**
 * Full-width CTA section with centered content.
 * Wrap your heading, description, and buttons inside.
 *
 * @example
 * <CTASection>
 *   <h2>Ready to start?</h2>
 *   <p>Contact us today</p>
 *   <button>WhatsApp</button>
 * </CTASection>
 */
const CTASection: FC<CTASectionProps> = ({
  className = 'bg-brand-navy text-white',
  children,
}) => (
  <section className={`py-12 sm:py-16 md:py-20 lg:py-24 ${className}`}>
    <div className="container mx-auto px-4 sm:px-6 text-center">
      {children}
    </div>
  </section>
);

export default CTASection;
