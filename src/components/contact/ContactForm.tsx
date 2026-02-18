import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { CONTACT_INFO, SERVICES, PAGE_CONTENT, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

const ContactForm: React.FC<{ locale: SupportedLocale }> = ({ locale }) => {
  const content = PAGE_CONTENT.contact;
  const t = (k: Record<string, string>) => getLocalizedText(k, locale);
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const msg = `*New Inquiry from Website*\n---------------------------\n*Name:* ${form.name}\n*Email:* ${form.email}\n*Phone:* ${form.phone}\n*Service:* ${form.service}\n*Message:* ${form.message}`;
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setSubmitting(false);
    setSubmitted(true);
  };

  const up = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value });
  const field = (id: string, label: Record<string, string>, type = 'text') => (
    <div>
      <Label htmlFor={id} className="text-sm sm:text-base">{t(label)}</Label>
      <Input id={id} type={type} required value={(form as any)[id]} onChange={up(id)} className="mt-1.5 sm:mt-2 h-10 sm:h-11 text-sm sm:text-base" />
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
          <Textarea id="message" required rows={4} value={form.message} onChange={up('message')} className="mt-1.5 sm:mt-2 text-sm sm:text-base" />
        </div>
        <Button type="submit" size="lg" className="w-full py-4 sm:py-6 text-base sm:text-lg bg-brand-navy hover:bg-brand-navy/90" disabled={submitting}>
          {submitting ? <><Loader2 className="mr-2 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />{t(content.form.sending)}</> : <><Send className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{t(content.form.submit)}</>}
        </Button>
      </form>
    </CardContent></Card>
  );
};

export default ContactForm;
