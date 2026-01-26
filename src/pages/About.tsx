import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Ruler, ShieldCheck, Users } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();
  const stats = [
    { label: t('about.stats.years'), value: '15+', icon: Ruler },
    { label: t('about.stats.projects'), value: '480+', icon: Building2 },
    { label: t('about.stats.partners'), value: '40+', icon: Users },
    { label: t('about.stats.ontime'), value: '98%', icon: ShieldCheck },
  ];

  return (
    <div className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid gap-10 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
              About
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">
              Shwaki Glassworks - Professional glass installation services.
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground max-w-xl">
              We are a service-based glass installation business operating throughout Israel. With years of experience,
              we provide professional on-site installations by appointment.
            </p>
            <p className="text-sm lg:text-base text-muted-foreground max-w-xl">
              No physical storefront - we come to you. Every project is coordinated closely with clients to ensure
              quality installation and customer satisfaction.
            </p>
          </div>
          <Card className="border-border bg-primary text-white">
            <CardContent className="grid grid-cols-2 gap-5 p-6 lg:p-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    className="space-y-1"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-xl font-semibold">{stat.value}</div>
                    <div className="text-xs text-slate-300">{stat.label}</div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
