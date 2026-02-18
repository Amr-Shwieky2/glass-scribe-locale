/**
 * Contractors Page - Orchestrator
 */

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import ContractorBenefits from '@/components/contractors/ContractorBenefits';
import ContractorServices from '@/components/contractors/ContractorServices';
import { CONTACT_INFO, PAGE_CONTENT, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

const Contractors: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.contractors;

  const handleWhatsApp = () => {
    const message = getLocalizedText(UI_STRINGS.contractorsWhatsappMessage, locale);
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(getLocalizedText(UI_STRINGS.contractorsEmailSubject, locale))}`;
  };

  return (
    <div className="min-h-screen">
      <AnimatedPageHeader className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-xs sm:text-sm font-medium text-blue-300">🏗️ {getLocalizedText(UI_STRINGS.contractorsBadge, locale)}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">{getLocalizedText(content.title, locale)}</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">{getLocalizedText(content.subtitle, locale)}</p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Button size="lg" onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-700 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </Button>
            <Button size="lg" onClick={handleEmail} variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
              <Mail className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{getLocalizedText(UI_STRINGS.contractorsSendEmail, locale)}
            </Button>
          </div>
        </div>
      </AnimatedPageHeader>

      <ContractorBenefits locale={locale} />
      <ContractorServices locale={locale} />

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{getLocalizedText(UI_STRINGS.ctaLetsWorkTogether, locale)}</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">{getLocalizedText(UI_STRINGS.ctaSimpleContact, locale)}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" onClick={handleWhatsApp} className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-full font-bold">
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />WhatsApp
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-full">
              <a href={`tel:${CONTACT_INFO.phoneIntl}`}><Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{CONTACT_INFO.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contractors;
