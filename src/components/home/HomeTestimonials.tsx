import React from 'react';
import { SOCIAL_LINKS } from '@/data/contact';
import { ExternalLink, Instagram } from 'lucide-react';
import { PAGE_CONTENT } from '@/data/page-content';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';

interface HomeTestimonialsProps {
  locale: SupportedLocale;
}

// Instagram reels
const REEL_IDS = ['DT5ewAzArhq', 'DT-neXFgvGn', 'DURWhbljZKb', 'DUJXJWODWL3'];

const HomeTestimonials: React.FC<HomeTestimonialsProps> = ({ locale }) => {
  const content = PAGE_CONTENT.home;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-brand-navy" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy">
              {getLocalizedText(content.sections.testimonials.title, locale)}
            </h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-brand-navy/70 max-w-2xl mx-auto px-2">
            {getLocalizedText(content.sections.testimonials.subtitle, locale)}
          </p>
        </div>

        {/* Instagram Reels Grid - Playable inside website, cropped to hide likes/comments */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {REEL_IDS.map((reelId) => (
            <div 
              key={reelId} 
              className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-brand-navy"
            >
              {/* Container that clips the iframe to hide likes/comments */}
              <div 
                className="relative w-full overflow-hidden" 
                style={{ paddingBottom: '160%' }}
              >
                {/* Iframe positioned to crop bottom (likes/comments area) */}
                <iframe
                  src={`https://www.instagram.com/reel/${reelId}/embed/?hidecaption=true`}
                  className="absolute border-0"
                  allowFullScreen
                  loading="lazy"
                  title={`Shwaki Glassworks Video ${reelId}`}
                  style={{ 
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '120%', // Taller than container to push likes off screen
                    border: 'none',
                  }}
                />
              </div>
              
              {/* Gradient overlay at bottom to clean up any remaining UI */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-navy via-brand-navy/80 to-transparent pointer-events-none" />
              
              {/* Link to Instagram - Floating button */}
              <a
                href={`https://www.instagram.com/reel/${reelId}/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View video ${reelId} on Instagram`}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 py-2 px-3 bg-white hover:bg-brand-gold rounded-full text-xs font-medium text-brand-navy shadow-lg transition-all hover:scale-105 z-10"
              >
                <Instagram className="w-4 h-4" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
            </div>
          ))}
        </div>

        {/* Follow button */}
        <div className="text-center mt-8 sm:mt-10">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-animated-navy inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            {getLocalizedText(UI_STRINGS.instagramFollow, locale)}
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
