import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PAGE_CONTENT, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

interface HomeTestimonialsProps {
  locale: SupportedLocale;
}

const REEL_IDS = ['DT5ewAzArhq', 'DT-neXFgvGn', 'DURWhbljZKb', 'DUlRLW7jXvJ'];

const HomeTestimonials: React.FC<HomeTestimonialsProps> = ({ locale }) => {
  const content = PAGE_CONTENT.home;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-brand-navy">
            {getLocalizedText(content.sections.testimonials.title, locale)}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-brand-navy/70 max-w-2xl mx-auto px-2">
            {getLocalizedText(content.sections.testimonials.subtitle, locale)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {REEL_IDS.map((reelId) => (
            <div key={reelId} className="flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
              <div className="relative w-full" style={{ paddingBottom: '125%' }}>
                <iframe
                  src={`https://www.instagram.com/reel/${reelId}/embed/`}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title={`Shwaki Glassworks Reel ${reelId}`}
                />
              </div>
              <a
                href={`https://www.instagram.com/reel/${reelId}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-brand-navy hover:text-brand-gold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {getLocalizedText(UI_STRINGS.instagramView, locale)}
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <a
            href="https://www.instagram.com/shwaki_glassworks/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-animated-navy inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
          >
            {getLocalizedText(UI_STRINGS.instagramFollow, locale)}
            <ExternalLink className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
