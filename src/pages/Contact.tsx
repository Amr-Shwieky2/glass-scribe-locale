import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail } from 'lucide-react';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { sendContactFormToTelegram } from '@/lib/telegram';
import { BUSINESS_INFO, getWhatsAppLink } from '@/constants/contact';

const contactSchema = z.object({
  name: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(1, 'Required'),
});

type ContactValues = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      setErrorMessage('');
      
      // Send to Telegram
      const telegramSuccess = await sendContactFormToTelegram({
        name: values.name,
        phone: values.phone,
        email: values.email || '',
        message: values.message,
        language: currentLanguage,
      });

      if (telegramSuccess) {
        setIsSubmitSuccessful(true);
        reset();
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitSuccessful(false);
        }, 5000);
      } else {
        setErrorMessage('Failed to send message. Please try WhatsApp or call us directly.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage('An error occurred. Please contact us via WhatsApp or phone.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('contact.heading')}
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {t('contact.get_in_touch', 'Get In Touch')}
              </h2>
              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={BUSINESS_INFO.phone.link}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('contact.phone', 'Phone')}
                    </div>
                    <div className="text-base font-semibold text-foreground" dir="ltr">
                      {BUSINESS_INFO.phone.display}
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={() => window.open(BUSINESS_INFO.whatsapp.link, '_blank')}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group w-full text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white group-hover:scale-110 transition-transform">
                    <WhatsAppIcon size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      WhatsApp
                    </div>
                    <div className="text-base font-semibold text-foreground">
                      {t('contact.chat_now', 'Chat with us now')}
                    </div>
                  </div>
                </button>

                {/* Email */}
                <a
                  href={BUSINESS_INFO.email.link}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('contact.email', 'Email')}
                    </div>
                    <div className="text-sm font-semibold text-foreground break-all">
                      {BUSINESS_INFO.email.address}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">
                {t('contact.why_choose', 'Why Choose Us?')}
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>{t('contact.benefit_1', '15+ years of experience')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>{t('contact.benefit_2', 'Professional installation')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>{t('contact.benefit_3', 'Fast response time')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>{t('contact.benefit_4', 'Nationwide service')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {t('contact.form.title', 'Send us a message')}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {t('contact.form.name')}
                </label>
                <Input
                  {...register('name')}
                  className="h-12 border-slate-300 bg-slate-50 focus:bg-white text-foreground placeholder:text-slate-400"
                  placeholder={t('contact.form.name_placeholder')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t('contact.form.phone')}
                  </label>
                  <Input
                    {...register('phone')}
                    className="h-12 border-slate-300 bg-slate-50 focus:bg-white text-foreground placeholder:text-slate-400"
                    placeholder={t('contact.form.phone_placeholder')}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t('contact.form.email')}
                  </label>
                  <Input
                    {...register('email')}
                    className="h-12 border-slate-300 bg-slate-50 focus:bg-white text-foreground placeholder:text-slate-400"
                    placeholder={t('contact.form.email_placeholder')}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {t('contact.form.message')}
                </label>
                <Textarea
                  {...register('message')}
                  className="min-h-[140px] border-slate-300 bg-slate-50 focus:bg-white text-foreground placeholder:text-slate-400 resize-none"
                  placeholder={t('contact.form.message_placeholder')}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
              >
                {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
              </Button>

              {isSubmitSuccessful && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                  {t('contact.form.success')}
                </div>
              )}
              {errorMessage && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-blue-500 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            onClick={() => window.open(BUSINESS_INFO.phone.link)}
          >
            <Phone className="h-4 w-4" /> {t('contact.mobile_cta.call')}
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#20BA5A] transition-colors shadow-lg"
            onClick={() => window.open(BUSINESS_INFO.whatsapp.link, '_blank')}
          >
            <WhatsAppIcon size={16} className="h-4 w-4" /> {t('contact.mobile_cta.whatsapp')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
