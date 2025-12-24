import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from '@/components/ServiceCard';
import { Eye, Wrench } from 'lucide-react';
import heroImage from '@/assets/hero-glass-installation.jpg';
import railingImage from '@/assets/glass-railing.jpg';
import storefrontImage from '@/assets/storefront-glass.jpg';

const servicesConfig = [
  {
    key: 'shower',
    image: heroImage,
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <div className="h-4 w-4 rounded-sm bg-primary" />
      </div>
    ),
  },
  {
    key: 'railings',
    image: railingImage,
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <div className="h-4 w-4 rounded-sm bg-primary" />
      </div>
    ),
  },
  {
    key: 'storefronts',
    image: storefrontImage,
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <div className="h-4 w-4 rounded-sm bg-primary" />
      </div>
    ),
  },
  {
    key: 'windows',
    image: heroImage,
    icon: <Eye className="h-8 w-8 text-primary" />,
  },
  {
    key: 'mirrors',
    image: railingImage,
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <div className="h-4 w-4 rounded-sm bg-primary" />
      </div>
    ),
  },
  {
    key: 'repairs',
    image: storefrontImage,
    icon: <Wrench className="h-8 w-8 text-primary" />,
  },
];

const Services = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const directionOffset = isRTL ? 24 : -24;

  return (
    <div className="bg-slate-950 text-slate-50">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.4),_transparent_55%),linear-gradient(to_bottom,_rgba(15,23,42,0.85),_transparent_40%)]" />

        <section className="relative container mx-auto px-4 py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: directionOffset }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            className="max-w-3xl space-y-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
              {t('services.badge')}
            </p>
            <h1 className="text-3xl lg:text-5xl font-semibold leading-tight">
              {t('services.heading')}
            </h1>
            <p className="text-sm lg:text-base text-slate-200/90">
              {t('services.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {servicesConfig.map((service, index) => (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="h-full"
              >
                <ServiceCard
                  title={t(`services.${service.key}.title`)}
                  description={t(`services.${service.key}.description`)}
                  image={service.image}
                  icon={service.icon}
                  onLearnMore={() => {
                    const section = document.getElementById('contact-section');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Services;