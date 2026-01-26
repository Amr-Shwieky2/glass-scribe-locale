import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MessageCircle, Mail, Loader2 } from 'lucide-react';
import { useContactPage, useSiteSettings } from '@/lib/strapi';

const contactSchema = z.object({
  name: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(1, 'Required'),
});

type ContactValues = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { data: contactPage, isLoading: contactLoading } = useContactPage();
  const { data: siteSettings, isLoading: settingsLoading } = useSiteSettings();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (values: ContactValues) => {
    // Simple mailto fallback; can be replaced with API later
    const subject = encodeURIComponent('New inquiry from website');
    const body = encodeURIComponent(
      `Name: ${values.name}\nPhone: ${values.phone}\nEmail: ${values.email}\n\nMessage:\n${values.message}`,
    );
    const recipientEmail = siteSettings?.email || 'info@example.com';
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    reset();
  };

  if (contactLoading || settingsLoading) {
    return (
      <div className="py-16 lg:py-20 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!contactPage || !siteSettings) {
    return (
      <div className="py-16 lg:py-20 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{t('common.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:items-start">
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">{contactPage.pageTitle}</h1>
            <p className="text-sm lg:text-base text-muted-foreground max-w-xl">
              {contactPage.description}
            </p>
            
            {/* Contact Details */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${siteSettings.phone}`} className="hover:text-primary">
                  {siteSettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/${siteSettings.whatsApp}`, '_blank')}
                  className="hover:text-primary"
                >
                  WhatsApp
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-primary">
                  {siteSettings.email}
                </a>
              </div>
            </div>
            
            {/* Opening Hours */}
            {contactPage.openingHours && (
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">{t('contact.openingHours')}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{contactPage.openingHours}</p>
              </div>
            )}
            
            {/* Service Areas */}
            {contactPage.serviceAreas && (
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-foreground mb-2">{t('contact.serviceAreas')}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{contactPage.serviceAreas}</p>
              </div>
            )}
            
            {/* Address */}
            {contactPage.addressText && (
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-foreground mb-2">{t('contact.address')}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{contactPage.addressText}</p>
              </div>
            )}
          </div>

          <div className="glass-surface relative overflow-hidden p-6 lg:p-8">
            <div className="glass-highlight" />
            <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">{t('contact.form.name')}</label>
                <Input
                  {...register('name')}
                  className="border-border bg-white text-foreground placeholder:text-muted-foreground"
                  placeholder={t('contact.form.name_placeholder')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">{t('contact.form.phone')}</label>
                  <Input
                    {...register('phone')}
                    className="border-border bg-white text-foreground placeholder:text-muted-foreground"
                    placeholder={t('contact.form.phone_placeholder')}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">{t('contact.form.email')}</label>
                  <Input
                    {...register('email')}
                    className="border-border bg-white text-foreground placeholder:text-muted-foreground"
                    placeholder={t('contact.form.email_placeholder')}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">{t('contact.form.message')}</label>
                <Textarea
                  {...register('message')}
                  className="min-h-[120px] border-border bg-white text-foreground placeholder:text-muted-foreground"
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
            </form>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      {/* Mobile sticky CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground"
            onClick={() => window.open(`tel:${siteSettings.phone}`)}
          >
            <Phone className="h-4 w-4" /> {t('contact.mobile_cta.call')}
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-3 py-2 text-xs font-medium text-white"
            onClick={() => window.open(`https://wa.me/${siteSettings.whatsApp}`, '_blank')}
          >
            <MessageCircle className="h-4 w-4" /> {t('contact.mobile_cta.whatsapp')}
          </button>
        </div>
      </div>
      
      {/* Map Section - Conditional Render */}
      {contactPage.mapEmbedUrl && (
        <div className="mt-12">
          <div className="container mx-auto px-4">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={contactPage.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('contact.map')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
