import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, FileSpreadsheet, Users, ArrowRight } from 'lucide-react';

const Contractors: React.FC = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      title: t('contractors.benefits.coordination.title'),
      description: t('contractors.benefits.coordination.description'),
      icon: Users,
    },
    {
      title: t('contractors.benefits.documentation.title'),
      description: t('contractors.benefits.documentation.description'),
      icon: FileSpreadsheet,
    },
    {
      title: t('contractors.benefits.logistics.title'),
      description: t('contractors.benefits.logistics.description'),
      icon: Building2,
    },
  ];

  return (
    <div className="py-16 lg:py-20 bg-secondary text-foreground">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:items-end">
          <div className="space-y-3">
            <Badge variant="outline" className="border-white/20 text-xs uppercase tracking-[0.2em] rounded-full px-3 py-1 text-slate-200">
              Trade partners
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
              A glass partner for contractors & architects
            </h1>
            <p className="max-w-xl text-sm lg:text-base text-slate-300">
              Shwaki Glassworks supports contractors, builders and architects with professional glass installation services,
              and reliable onsite execution.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="text-xs text-slate-400">Send drawings or BOQs directly to our estimating team.</div>
            <Button
              size="lg"
              className="cta-button inline-flex items-center gap-2 rounded-full bg-primary px-6 py-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/40 hover:shadow-primary/60"
              onClick={() => {
                window.location.href = 'mailto:info@shwaki-glass.co.il?subject=Glass%20installation%20inquiry';
              }}
            >
              Email drawings
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Card className="h-full border-border bg-white">
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm font-semibold text-slate-50">{benefit.title}</div>
                    <p className="text-xs text-slate-300">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="border-border bg-secondary">
          <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                {t('contractors.next_steps.badge')}
              </div>
              <div className="text-sm font-medium text-slate-50">
                {t('contractors.next_steps.heading')}
              </div>
              <p className="text-xs text-slate-300">
                {t('contractors.next_steps.description')}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-xs text-slate-300">
              <span>info@shwaki-glass.co.il</span>
              <span>+972-50-123-4567</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contractors;
