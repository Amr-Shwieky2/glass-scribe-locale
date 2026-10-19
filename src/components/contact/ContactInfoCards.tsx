import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/data/contact';
import { BUSINESS_INFO } from '@/data/business-info';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';
import TrackedLink from '@/components/TrackedLink';

const iconBox = (bg: string) => `w-10 h-10 sm:w-12 sm:h-12 ${bg} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`;
const iconCls = 'w-5 h-5 sm:w-6 sm:h-6';

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <Card className="border-0 shadow-lg">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        {icon}
        <div className="min-w-0">
          <h3 className="font-bold text-brand-navy mb-1 sm:mb-2 text-sm sm:text-base">{title}</h3>
          {children}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ContactInfoCards: React.FC<{ locale: SupportedLocale }> = ({ locale }) => {
  const t = (k: Record<string, string>) => getLocalizedText(k, locale);
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-brand-navy">{t(UI_STRINGS.contactGetInTouch)}</h2>
      <div className="space-y-4 sm:space-y-6">
        <InfoCard icon={<div className={iconBox('bg-brand-gold/20')}><Phone className={`${iconCls} text-brand-gold`} /></div>} title={t(UI_STRINGS.contactPhone)}>
          <TrackedLink href={`tel:${CONTACT_INFO.phoneIntl}`} event={{ action: 'click_call', category: 'Contact', label: 'Contact Page Card' }} className="block text-brand-navy/70 hover:text-brand-gold transition-colors text-sm sm:text-base">{CONTACT_INFO.phone}</TrackedLink>
        </InfoCard>
        <InfoCard icon={<div className={iconBox('bg-brand-gold/20')}><Mail className={`${iconCls} text-brand-gold`} /></div>} title={t(UI_STRINGS.contactEmail)}>
          <a href={`mailto:${CONTACT_INFO.email}`} className="text-brand-navy/70 hover:text-brand-gold transition-colors text-sm sm:text-base break-all">{CONTACT_INFO.email}</a>
        </InfoCard>
        <InfoCard icon={<div className={iconBox('bg-brand-navy/10')}><MapPin className={`${iconCls} text-brand-navy`} /></div>} title={t(UI_STRINGS.contactLocation)}>
          <p className="text-gray-600 text-sm sm:text-base">{t(BUSINESS_INFO.location)}</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">{t(BUSINESS_INFO.serviceArea)}</p>
        </InfoCard>
        <InfoCard icon={<div className={iconBox('bg-brand-gold/20')}><Clock className={`${iconCls} text-brand-gold`} /></div>} title={t(UI_STRINGS.contactWorkingHours)}>
          <p className="text-gray-600 text-sm sm:text-base">{t(CONTACT_INFO.workingHours)}</p>
        </InfoCard>
      </div>
      <div className="mt-6 sm:mt-8">
        <TrackedLink
          href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          event={{ action: 'click_whatsapp', category: 'Contact', label: 'Contact Page Card' }}
          className="btn-animated-gold-filled w-full inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
        >
          <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{t(UI_STRINGS.contactWhatsappMessage)}
        </TrackedLink>
        <p className="text-center text-gray-500 text-sm mt-3">{t(CONTACT_INFO.responseTime)}</p>
      </div>
    </div>
  );
};

export default ContactInfoCards;
