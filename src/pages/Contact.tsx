/**
 * Contact Page - Static Content
 */

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2, CheckCircle } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import {
  CONTACT_INFO,
  BUSINESS_INFO,
  SERVICES,
  PAGE_CONTENT,
  getLocalizedText,
  type SupportedLocale,
} from '@/data/business';

const Contact: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.contact;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Send via WhatsApp (simple solution without backend)
    const message = `
*New Inquiry from Website*
---------------------------
*Name:* ${formState.name}
*Email:* ${formState.email}
*Phone:* ${formState.phone}
*Service:* ${formState.service}
*Message:* ${formState.message}
    `.trim();

    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <AnimatedPageHeader>
        <div className="max-w-3xl mx-auto text-center">
          {/* Help Desk Cartoon */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/help-desk.png" 
              alt="Contact Support"
              className="w-18 h-18 sm:w-24 sm:h-24 object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">
            {getLocalizedText(content.title, locale)}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 px-2">
            {getLocalizedText(content.subtitle, locale)}
          </p>
        </div>
      </AnimatedPageHeader>

      {/* Contact Content */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-brand-navy">
                {locale === 'he' ? 'פרטי התקשרות' :
                 locale === 'ar' ? 'معلومات الاتصال' :
                 'Get in Touch'}
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Phone Numbers */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-gold/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-navy mb-1 sm:mb-2 text-sm sm:text-base">
                          {locale === 'he' ? 'טלפון' : locale === 'ar' ? 'هاتف' : 'Phone'}
                        </h3>
                        <a href={`tel:${CONTACT_INFO.phone.mobile}`} className="block text-brand-navy/70 hover:text-brand-gold transition-colors text-sm sm:text-base">
                          {locale === 'he' ? 'נייד' : locale === 'ar' ? 'جوال' : 'Mobile'}: {CONTACT_INFO.phone.mobile}
                        </a>
                        <a href={`tel:${CONTACT_INFO.phone.office}`} className="block text-brand-navy/70 hover:text-brand-gold transition-colors text-sm sm:text-base">
                          {locale === 'he' ? 'משרד' : locale === 'ar' ? 'مكتب' : 'Office'}: {CONTACT_INFO.phone.office}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-gold/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-brand-navy mb-1 sm:mb-2 text-sm sm:text-base">
                          {locale === 'he' ? 'אימייל' : locale === 'ar' ? 'بريد إلكتروني' : 'Email'}
                        </h3>
                        <a href={`mailto:${CONTACT_INFO.email}`} className="text-brand-navy/70 hover:text-brand-gold transition-colors text-sm sm:text-base break-all">
                          {CONTACT_INFO.email}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-navy/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-brand-navy" />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-navy mb-1 sm:mb-2 text-sm sm:text-base">
                          {locale === 'he' ? 'מיקום' : locale === 'ar' ? 'الموقع' : 'Location'}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {getLocalizedText(BUSINESS_INFO.location, locale)}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                          {getLocalizedText(BUSINESS_INFO.serviceArea, locale)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Working Hours */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-gold/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-navy mb-1 sm:mb-2 text-sm sm:text-base">
                          {locale === 'he' ? 'שעות פעילות' : locale === 'ar' ? 'ساعات العمل' : 'Working Hours'}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {getLocalizedText(CONTACT_INFO.workingHours, locale)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-6 sm:mt-8">
                <button
                  onClick={handleWhatsApp}
                  className="btn-animated-gold-filled w-full inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                >
                  <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  {locale === 'he' ? 'שלחו הודעה בוואטסאפ' :
                   locale === 'ar' ? 'أرسل رسالة على واتساب' :
                   'Message Us on WhatsApp'}
                </button>
                <p className="text-center text-gray-500 text-sm mt-3">
                  {getLocalizedText(CONTACT_INFO.responseTime, locale)}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                        {locale === 'he' ? 'תודה!' :
                         locale === 'ar' ? 'شكراً!' :
                         'Thank You!'}
                      </h3>
                      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                        {getLocalizedText(content.form.success, locale)}
                      </p>
                      <button 
                        onClick={() => setIsSubmitted(false)} 
                        className="btn-animated-navy inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
                      >
                        {locale === 'he' ? 'שלחו הודעה נוספת' :
                         locale === 'ar' ? 'أرسل رسالة أخرى' :
                         'Send Another Message'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-brand-navy">
                        {locale === 'he' ? 'שלחו לנו הודעה' :
                         locale === 'ar' ? 'أرسل لنا رسالة' :
                         'Send Us a Message'}
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                          <Label htmlFor="name" className="text-sm sm:text-base">{getLocalizedText(content.form.name, locale)}</Label>
                          <Input
                            id="name"
                            required
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="mt-1.5 sm:mt-2 h-10 sm:h-11 text-sm sm:text-base"
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-sm sm:text-base">{getLocalizedText(content.form.email, locale)}</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="mt-1.5 sm:mt-2 h-10 sm:h-11 text-sm sm:text-base"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-sm sm:text-base">{getLocalizedText(content.form.phone, locale)}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={formState.phone}
                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                            className="mt-1.5 sm:mt-2 h-10 sm:h-11 text-sm sm:text-base"
                          />
                        </div>

                        <div>
                          <Label htmlFor="service" className="text-sm sm:text-base">{getLocalizedText(content.form.service, locale)}</Label>
                          <Select
                            value={formState.service}
                            onValueChange={(value) => setFormState({ ...formState, service: value })}
                          >
                            <SelectTrigger className="mt-1.5 sm:mt-2 h-10 sm:h-11 text-sm sm:text-base">
                              <SelectValue placeholder={locale === 'he' ? 'בחרו שירות' : locale === 'ar' ? 'اختر خدمة' : 'Select a service'} />
                            </SelectTrigger>
                            <SelectContent>
                              {SERVICES.map((service) => (
                                <SelectItem key={service.id} value={getLocalizedText(service.title, locale)} className="text-sm sm:text-base">
                                  {service.icon} {getLocalizedText(service.title, locale)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-sm sm:text-base">{getLocalizedText(content.form.message, locale)}</Label>
                          <Textarea
                            id="message"
                            required
                            rows={4}
                            value={formState.message}
                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                            className="mt-1.5 sm:mt-2 text-sm sm:text-base"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full py-4 sm:py-6 text-base sm:text-lg bg-brand-navy hover:bg-brand-navy/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                              {getLocalizedText(content.form.sending, locale)}
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                              {getLocalizedText(content.form.submit, locale)}
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
