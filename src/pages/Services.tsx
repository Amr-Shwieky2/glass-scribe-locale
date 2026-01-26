import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImageGallery } from '@/components/ImageGallery';
import { useServices, getImageUrl } from '@/lib/strapi';
import { Circle } from 'lucide-react';

const Services = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { data: services, isLoading, error } = useServices();

  const directionOffset = isRTL ? 24 : -24;

  if (isLoading) {
    return (
      <div className="bg-white text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{t('common.error')}</p>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="bg-white text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{t('services.noServices')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-foreground">
      <div className="relative overflow-hidden">
        <section className="relative container mx-auto px-4 py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: directionOffset }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            className="max-w-3xl space-y-5 mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/70">
              {t('services.badge')}
            </p>
            <h1 className="text-3xl lg:text-5xl font-semibold leading-tight text-primary">
              {t('services.heading')}
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              {t('services.description')}
            </p>
          </motion.div>

          <div className="space-y-20">
            {services.filter(service => service && service.slug).map((service, index) => {
              const iconUrl = service.icon ? getImageUrl(service.icon) : null;

              const galleryUrls = (service.gallery || [])
                .map(img => getImageUrl(img))
                .filter(Boolean);
              
              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      {iconUrl ? (
                        <img 
                          src={iconUrl} 
                          alt={service.title}
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <Circle className="h-8 w-8 text-accent" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-semibold text-primary">
                        {service.title}
                      </h2>
                      <p className="text-sm lg:text-base text-muted-foreground mt-1">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>
                  {galleryUrls.length > 0 && (
                    <ImageGallery 
                      images={galleryUrls.slice(0, 6)} 
                      columns={3} 
                      category={service.title}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
