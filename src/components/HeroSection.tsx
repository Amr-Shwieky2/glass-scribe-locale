/**
 * HeroSection - Cinematic Full-Screen Hero (Server Component)
 *
 * Exactly one <h1>, present and visible in the server HTML. Entrance motion is
 * CSS transform-only (no opacity:0 waiting for JS) and is disabled under
 * prefers-reduced-motion. The background is the LCP image, so it's a
 * prioritized next/image.
 */
import React from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import { CONTACT_INFO } from '@/data/contact';
import type { SupportedLocale } from '@/data/types';
import { getHeroUrl } from '@/lib/cloudinary/urls';

// Text content for different languages
const HERO_TEXT: Record<SupportedLocale, { line1: string; line2: string; tagline: string; cta: string }> = {
  he: {
    line1: 'אומנות',
    line2: 'הזכוכית',
    tagline: 'יוצרים מרחבים של אור ושקיפות',
    cta: 'דברו איתנו',
  },
  en: {
    line1: 'The Art',
    line2: 'of Glass',
    tagline: 'Creating spaces of light and transparency',
    cta: 'Contact Us',
  },
  ar: {
    line1: 'فن',
    line2: 'الزجاج',
    tagline: 'نخلق مساحات من الضوء والشفافية',
    cta: 'تواصل معنا',
  },
  ru: {
    line1: 'Искусство',
    line2: 'Стекла',
    tagline: 'Создаём пространства света и прозрачности',
    cta: 'Свяжитесь с нами',
  },
};

const SCROLL_LABEL: Record<SupportedLocale, string> = {
  he: 'גללו לתוכן',
  en: 'Scroll to content',
  ar: 'انتقل إلى المحتوى',
  ru: 'Прокрутить к содержимому',
};

const delay = (ms: number) => ({ '--anim-delay': `${ms}ms` }) as React.CSSProperties;

interface HeroSectionProps {
  locale: SupportedLocale;
  /** Cloudinary public_id of the hero background (server-fetched), if any. */
  heroImageId?: string;
  /** id of the section the scroll indicator jumps to. */
  nextSectionId: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ locale, heroImageId, nextSectionId }) => {
  const text = HERO_TEXT[locale] || HERO_TEXT.en;
  const imageUrl = heroImageId ? getHeroUrl(heroImageId) : null;

  return (
    <section className="relative h-screen overflow-hidden bg-brand-navy">
      {/* Background Image (LCP) */}
      {imageUrl ? (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt="Premium glass work"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={60}
            className="object-cover"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-navy/30" />
        </div>
      ) : (
        /* Fallback gradient background if no image */
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-slate-800 to-brand-navy">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </div>
      )}

      {/* Animated Gold Line */}
      <div
        className="absolute left-8 md:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-gold to-transparent opacity-50 origin-top animate-scale-y"
        style={delay(500)}
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            {/* Main Title - single <h1>, each line rises out of its own mask */}
            <h1 className="mb-6 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none">
              <span className="block overflow-hidden mb-2 pb-1">
                <span className="block text-white animate-rise" style={{ ...delay(300), '--rise-from': '0.6em' } as React.CSSProperties}>
                  {text.line1}
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="block animate-rise" style={{ ...delay(500), '--rise-from': '0.6em' } as React.CSSProperties}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold">
                    {text.line2}
                  </span>
                </span>
              </span>
            </h1>

            {/* Tagline */}
            <div className="overflow-hidden mb-10">
              <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-light animate-rise" style={{ ...delay(900), '--rise-from': '30px' } as React.CSSProperties}>
                {text.tagline}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 animate-rise" style={{ ...delay(1200), '--rise-from': '20px' } as React.CSSProperties}>
              {/* Phone Button */}
              <a
                href={`tel:${CONTACT_INFO.phoneIntl}`}
                className="group relative inline-flex items-center gap-3 bg-brand-gold text-brand-navy font-bold text-lg px-8 py-4 rounded-full overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-[0.98]"
              >
                {/* Button shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[600ms]" aria-hidden="true" />
                <Phone className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{text.cta}</span>
              </a>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 bg-brand-gold text-brand-navy font-bold text-lg px-8 py-4 rounded-full overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-[0.98]"
              >
                {/* Button shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[600ms]" aria-hidden="true" />
                {/* WhatsApp Icon */}
                <svg
                  className="w-5 h-5 relative z-10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="relative z-10">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-8 right-8 md:top-16 md:right-16 animate-fade-soft" style={delay(1000)} aria-hidden="true">
        <div className="w-20 h-20 md:w-32 md:h-32 border-t-2 border-r-2 border-brand-gold/50" />
      </div>

      <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 animate-fade-soft" style={delay(1100)} aria-hidden="true">
        <div className="w-20 h-20 md:w-32 md:h-32 border-b-2 border-l-2 border-brand-gold/50" />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-soft" style={delay(1500)}>
        <a
          href={`#${nextSectionId}`}
          className="flex flex-col items-center animate-float-y"
          style={{ '--float-distance': '10px', '--float-duration': '2s' } as React.CSSProperties}
          aria-label={SCROLL_LABEL[locale]}
        >
          <span className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <span
              className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-float-y"
              style={{ '--float-distance': '12px', '--float-duration': '1.5s' } as React.CSSProperties}
            />
          </span>
        </a>
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute w-1 h-1 bg-brand-gold/40 rounded-full opacity-20 animate-particle"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            '--float-duration': `${3 + i * 0.5}s`,
            '--anim-delay': `${i * 300}ms`,
          } as React.CSSProperties}
        />
      ))}
    </section>
  );
};

export default HeroSection;
