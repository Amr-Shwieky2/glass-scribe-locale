'use client';
import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { getLocalizedText } from '@/data/helpers';
import { UI_STRINGS } from '@/data/ui-strings';
import { CONTACT_INFO } from '@/data/contact';
import type { SupportedLocale } from '@/data/types';

interface Props { locale: SupportedLocale; onWhatsApp: () => void; }

const ProjectsCTA: React.FC<Props> = ({ locale, onWhatsApp }) => (
  <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
    <div className="container mx-auto px-4 sm:px-6 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
        {getLocalizedText(UI_STRINGS.ctaHaveProject, locale)}
      </h2>
      <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/80">
        {getLocalizedText(UI_STRINGS.ctaNoObligation, locale)}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <button onClick={onWhatsApp} className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg">
          <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{getLocalizedText(UI_STRINGS.whatsapp, locale)}
        </button>
        <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="btn-animated-gold inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg">
          <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{CONTACT_INFO.phone}
        </a>
      </div>
    </div>
  </section>
);

export default ProjectsCTA;
