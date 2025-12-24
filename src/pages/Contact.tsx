import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { sendContactFormToTelegram } from '@/lib/telegram';

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
    <div className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:items-start">
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">{t('contact.heading')}</h1>
            <p className="text-sm lg:text-base text-muted-foreground max-w-xl">
              {t('contact.description')}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+972501234567" className="hover:text-primary">
                  +972-50-123-4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <button
                  type="button"
                  onClick={() => window.open('https://wa.me/972501234567', '_blank')}
                  className="hover:text-primary"
                >
                  WhatsApp
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@fusion-glassworks.com" className="hover:text-primary">
                  info@fusion-glassworks.com
                </a>
              </div>
            </div>
          </div>

          <div className="glass-surface relative overflow-hidden p-6 lg:p-8">
            <div className="glass-highlight" />
            <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100">{t('contact.form.name')}</label>
                <Input
                  {...register('name')}
                  className="border-white/20 bg-slate-900/40 text-slate-50 placeholder:text-slate-400"
                  placeholder={t('contact.form.name_placeholder')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-100">{t('contact.form.phone')}</label>
                  <Input
                    {...register('phone')}
                    className="border-white/20 bg-slate-900/40 text-slate-50 placeholder:text-slate-400"
                    placeholder={t('contact.form.phone_placeholder')}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-100">{t('contact.form.email')}</label>
                  <Input
                    {...register('email')}
                    className="border-white/20 bg-slate-900/40 text-slate-50 placeholder:text-slate-400"
                    placeholder={t('contact.form.email_placeholder')}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100">{t('contact.form.message')}</label>
                <Textarea
                  {...register('message')}
                  className="min-h-[120px] border-white/20 bg-slate-900/40 text-slate-50 placeholder:text-slate-400"
                  placeholder={t('contact.form.message_placeholder')}
                />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cta-button mt-2 w-full justify-center rounded-full bg-primary px-6 py-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/40 hover:shadow-primary/60"
              >
                {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
              </Button>
              {isSubmitSuccessful && (
                <p className="mt-2 text-xs text-emerald-300">
                  {t('contact.form.success')}
                </p>
              )}
              {errorMessage && (
                <p className="mt-2 text-xs text-red-400">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.7)] md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-100"
            onClick={() => window.open('tel:+972501234567')}
          >
            <Phone className="h-4 w-4" /> {t('contact.mobile_cta.call')}
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-3 py-2 text-xs font-medium text-emerald-950"
            onClick={() => window.open('https://wa.me/972501234567', '_blank')}
          >
            <MessageCircle className="h-4 w-4" /> {t('contact.mobile_cta.whatsapp')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
