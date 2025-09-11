import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from '@/components/ServiceCard';
import { Eye, Wrench } from 'lucide-react';
import heroImage from '@/assets/hero-glass-installation.jpg';
import railingImage from '@/assets/glass-railing.jpg';
import storefrontImage from '@/assets/storefront-glass.jpg';

const Services = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const services = [
    {
      key: 'shower',
      icon: <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><div className="w-4 h-4 bg-primary rounded-sm"></div></div>,
      image: heroImage
    },
    {
      key: 'railings',
      icon: <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><div className="w-4 h-4 bg-primary rounded-sm"></div></div>,
      image: railingImage
    },
    {
      key: 'storefronts',
      icon: <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><div className="w-4 h-4 bg-primary rounded-sm"></div></div>,
      image: storefrontImage
    },
    {
      key: 'windows',
      icon: <Eye className="w-8 h-8 text-primary" />,
      image: heroImage
    },
    {
      key: 'mirrors',
      icon: <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><div className="w-4 h-4 bg-primary rounded-sm"></div></div>,
      image: railingImage
    },
    {
      key: 'repairs',
      icon: <Wrench className="w-8 h-8 text-primary" />,
      image: storefrontImage
    }
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            {t('services.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional glass installation services for residential and commercial properties throughout Israel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.key}
              title={t(`services.${service.key}.title`)}
              description={t(`services.${service.key}.description`)}
              image={service.image}
              icon={service.icon}
              onLearnMore={() => {
                // Navigate to service detail page
                console.log(`Learn more about ${service.key}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;