import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';
import { useProcessSteps, getImageUrl, extractPlainText } from '@/lib/strapi';

const Process: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { data: steps, isLoading } = useProcessSteps();

  return (
    <div className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 lg:mb-14 space-y-3 text-center">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
            {t('process.badge')}
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">
            {t('process.title')}
          </h1>
          <p className="mx-auto max-w-2xl text-sm lg:text-base text-muted-foreground">
            {t('process.description')}
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="mt-4 text-sm text-muted-foreground">{t('common.loading')}</p>
            </div>
          ) : !steps || steps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('process.no_steps')}</p>
            </div>
          ) : (
            <>
              <div className="absolute inset-x-0 top-10 bottom-10 mx-auto w-px bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 md:hidden" />
              <div className="hidden md:block absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10" />

              <div className="space-y-6">
                {steps
                  .filter(step => step && step.stepNumber)
                  .sort((a, b) => a.stepNumber - b.stepNumber)
                  .map((step, index) => {
                    const isLeft = (index % 2 === 0) !== isRTL;
                    const iconUrl = step.icon ? getImageUrl(step.icon) : null;

                    return (
                      <motion.div
                        key={step.stepNumber}
                        initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.45, delay: index * 0.05 }}
                        className={`relative flex flex-col md:flex-row ${
                          isLeft ? 'md:justify-start' : 'md:justify-end'
                        }`}
                      >
                        <div className={`md:w-1/2 ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                          <Card className="border-border/60 bg-gradient-to-br from-white to-slate-50/80 shadow-sm">
                            <CardContent className="flex gap-4 p-5">
                              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                {iconUrl ? (
                                  <img 
                                    src={iconUrl} 
                                    alt="" 
                                    className="h-5 w-5 object-contain"
                                  />
                                ) : (
                                  <Circle className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/70">
                                  {t('process.step_label')} {step.stepNumber}
                                </div>
                                <div className="text-sm font-semibold text-foreground">
                                  {step.title}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {extractPlainText(step.description)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 bg-white md:block" />
                      </motion.div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Process;
