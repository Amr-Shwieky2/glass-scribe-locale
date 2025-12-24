import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import heroImage from '@/assets/hero-glass-installation.jpg';
import railingImage from '@/assets/glass-railing.jpg';
import storefrontImage from '@/assets/storefront-glass.jpg';

const galleryItems = [
  {
    id: 1,
    title: 'Highrise curtain wall',
    type: 'Commercial tower',
    image: heroImage,
  },
  {
    id: 2,
    title: 'Floating glass staircase',
    type: 'Luxury residence',
    image: railingImage,
  },
  {
    id: 3,
    title: 'Minimal storefront system',
    type: 'Retail flagship',
    image: storefrontImage,
  },
  {
    id: 4,
    title: 'Frameless balcony glazing',
    type: 'Residential tower',
    image: railingImage,
  },
  {
    id: 5,
    title: 'Lobby feature wall',
    type: 'Hotel lobby',
    image: heroImage,
  },
  {
    id: 6,
    title: 'Conference room partitions',
    type: 'Corporate office',
    image: storefrontImage,
  },
];

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <div className="py-16 lg:py-20 bg-slate-950 text-slate-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 lg:mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="border-white/20 text-xs uppercase tracking-[0.2em] rounded-full px-3 py-1 text-slate-200">
              {t('projects.badge')}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
              {t('projects.heading')}
            </h1>
            <p className="max-w-2xl text-sm lg:text-base text-slate-300">
              {t('projects.description')}
            </p>
          </div>
          <div className="text-xs lg:text-sm text-slate-400">
            {currentLanguage.toUpperCase()}  b7 Glass projects & case studies
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Card className="group overflow-hidden border-slate-800 bg-slate-900/60">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-md">
                      <Eye className="h-4 w-4" /> {t('projects.view_details')}
                    </span>
                  </div>
                </div>
                <CardContent className="flex flex-col gap-1 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-primary/70">{item.type}</div>
                  <div className="text-sm font-medium text-slate-50">{item.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
