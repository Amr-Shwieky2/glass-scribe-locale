import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES, PAGE_CONTENT, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  consent: boolean;
  // Honeypot field for spam protection (should remain empty)
  website: string;
  // CSRF token for security
  csrfToken: string;
};

// Security: Sanitize user input to prevent XSS and injection attacks
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
};

// Security: Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Security: Validate phone format (Israeli phone numbers)
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]{7,20}$/;
  return phoneRegex.test(phone);
};

// Consent checkbox labels
const CONSENT_LABELS = {
  he: 'אני מסכים/ה שהמידע שלי ישמש ליצירת קשר בנוגע לפנייתי.',
  en: 'I agree that my data will be used to contact me regarding my request.',
  ar: 'أوافق على استخدام بياناتي للتواصل معي بخصوص طلبي.',
  ru: 'Я согласен, что мои данные будут использоваться для связи со мной по моему запросу.',
};

const PRIVACY_LINK_LABELS = {
  he: 'מדיניות פרטיות',
  en: 'Privacy Policy',
  ar: 'سياسة الخصوصية',
  ru: 'Политика конфиденциальности',
};

const ContactForm: React.FC<{ locale: SupportedLocale }> = ({ locale }) => {
  const content = PAGE_CONTENT.contact;
  const t = (k: Record<string, string>) => getLocalizedText(k, locale);
  const [form, setForm] = useState<ContactFormState>({ name: '', email: '', phone: '', service: '', message: '', consent: false, website: '', csrfToken: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<ContactFormState>>({});

  // Fetch CSRF token on component mount
  const fetchCSRFToken = useCallback(async () => {
    try {
      const response = await fetch('/api/csrf/token');
      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({ ...prev, csrfToken: data.token }));
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }, []);

  useEffect(() => {
    fetchCSRFToken();
  }, [fetchCSRFToken]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormState> = {};
    
    if (!form.name.trim() || form.name.length < 2) {
      newErrors.name = 'Name is required';
    }
    if (!isValidEmail(form.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!isValidPhone(form.phone)) {
      newErrors.phone = 'Valid phone is required';
    }
    if (!form.message.trim() || form.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, it's a bot
    if (form.website) {
      // Silently fail for bots
      setSubmitted(true);
      return;
    }
    
    if (!validateForm()) return;
    
    // Check consent
    if (!form.consent) {
      setSubmitError(locale === 'he' ? 'יש לאשר את הסכמתך לשימוש במידע' : 'Please accept the consent to proceed');
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    // Sanitize all inputs before sending
    const sanitizedForm = {
      name: sanitizeInput(form.name),
      email: sanitizeInput(form.email),
      phone: sanitizeInput(form.phone),
      service: sanitizeInput(form.service),
      message: sanitizeInput(form.message),
      csrfToken: form.csrfToken, // Include CSRF token
    };
    
    try {
      // Send to Telegram via API
      const response = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedForm),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', service: '', message: '', consent: false, website: '', csrfToken: '' });
      } else {
        setSubmitError(result.error || 'Failed to send message');
        // Refresh CSRF token on error
        fetchCSRFToken();
      }
    } catch {
      setSubmitError('Network error. Please try again.');
      // Refresh CSRF token on error
      fetchCSRFToken();
    } finally {
      setSubmitting(false);
    }
  };

  const up = (key: keyof ContactFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };
  
  const field = (id: Extract<keyof ContactFormState, 'name' | 'email' | 'phone'>, label: Record<string, string>, type = 'text') => (
    <div>
      <Label htmlFor={id} className="text-sm sm:text-base">{t(label)}</Label>
      <Input 
        id={id} 
        type={type} 
        required 
        value={form[id]} 
        onChange={up(id)} 
        className={`mt-1.5 sm:mt-2 h-10 sm:h-11 text-sm sm:text-base ${errors[id] ? 'border-red-500' : ''}`}
        maxLength={type === 'email' ? 254 : 100}
        autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'name'}
      />
      {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
    </div>
  );

  if (submitted) return (
    <Card className="border-0 shadow-xl"><CardContent className="p-4 sm:p-6 md:p-8 text-center py-8 sm:py-12">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" /></div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{t(UI_STRINGS.contactThankYou)}</h3>
      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{t(content.form.success)}</p>
      <button onClick={() => setSubmitted(false)} className="btn-animated-navy inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base">{t(UI_STRINGS.contactSendAnother)}</button>
    </CardContent></Card>
  );

  return (
    <Card className="border-0 shadow-xl"><CardContent className="p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-brand-navy">{t(UI_STRINGS.contactSendMessage)}</h2>
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{submitError}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {field('name', content.form.name)}{field('email', content.form.email, 'email')}{field('phone', content.form.phone, 'tel')}
        <div>
          <Label htmlFor="service" className="text-sm sm:text-base">{t(content.form.service)}</Label>
          <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
            <SelectTrigger className="mt-1.5 sm:mt-2 h-10 sm:h-11 text-sm sm:text-base"><SelectValue placeholder={t(UI_STRINGS.contactSelectService)} /></SelectTrigger>
            <SelectContent>{SERVICES.map((s) => <SelectItem key={s.id} value={t(s.title)} className="text-sm sm:text-base">{s.icon} {t(s.title)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="message" className="text-sm sm:text-base">{t(content.form.message)}</Label>
          <Textarea 
            id="message" 
            required 
            rows={4} 
            value={form.message} 
            onChange={up('message')} 
            className={`mt-1.5 sm:mt-2 text-sm sm:text-base ${errors.message ? 'border-red-500' : ''}`}
            maxLength={1000}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>
        
        {/* Honeypot field - hidden from users, catches bots */}
        <div className="hidden" aria-hidden="true">
          <Label htmlFor="website">Website (leave empty)</Label>
          <Input 
            id="website" 
            type="text" 
            value={form.website} 
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        
        {/* CSRF Token - hidden security field */}
        <input type="hidden" name="csrf_token" value={form.csrfToken} />
        
        {/* Consent Checkbox - Required for Israeli Privacy Law compliance */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-navy focus:ring-brand-gold"
              required
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              {CONSENT_LABELS[locale]} {' '}
              <Link 
                to={`/${locale}/privacy`} 
                className="text-brand-gold hover:underline font-medium"
                target="_blank"
              >
                {PRIVACY_LINK_LABELS[locale]}
              </Link>
            </span>
          </label>
        </div>
        
        <Button type="submit" size="lg" className="w-full py-4 sm:py-6 text-base sm:text-lg bg-brand-navy hover:bg-brand-navy/90" disabled={submitting || !form.consent}>
          {submitting ? <><Loader2 className="mr-2 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />{t(content.form.sending)}</> : <><Send className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{t(content.form.submit)}</>}
        </Button>
      </form>
    </CardContent></Card>
  );
};

export default ContactForm;
