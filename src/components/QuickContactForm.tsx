import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, CheckCircle } from 'lucide-react';
import { sendContactFormToTelegram } from '@/lib/telegram';

// Simple form schema - only name and phone
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(9, 'Please enter a valid phone number'),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Quick Contact Form - Simple and easy
 * Only requires name and phone number
 */
export const QuickContactForm: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSubmitSuccess(false);

    try {
      await sendContactFormToTelegram({
        name: data.name,
        phone: data.phone,
        email: '', // Not required
        message: 'Quick contact form submission from home page',
      });

      setSubmitSuccess(true);
      reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage('Failed to send message. Please try calling us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <Input
            {...register('name')}
            placeholder={t('contact.form.name_placeholder', 'Your name')}
            className="h-14 text-lg bg-white/95 border-2 border-white/20 focus:border-blue-400 text-gray-900 placeholder:text-gray-500"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              {...register('phone')}
              type="tel"
              placeholder={t('contact.form.phone_placeholder', 'Your phone number')}
              className="h-14 text-lg pl-12 bg-white/95 border-2 border-white/20 focus:border-blue-400 text-gray-900 placeholder:text-gray-500"
              disabled={isSubmitting}
              dir="ltr"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? (
            <span>{t('contact.form.submitting', 'Sending...')}</span>
          ) : (
            <span>{t('contact.form.submit', 'Contact Me')}</span>
          )}
        </Button>

        {/* Success Message */}
        {submitSuccess && (
          <div className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-sm text-green-300">
              {t('contact.form.success', "Thank you! We'll contact you soon.")}
            </p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p className="text-sm text-red-400 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default QuickContactForm;
