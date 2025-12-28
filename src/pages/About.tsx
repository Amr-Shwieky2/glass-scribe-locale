import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Ruler, ShieldCheck, Users, Award, Target, Heart, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();
  const stats = [
    { label: t('about.stats.years'), value: '15+', icon: Ruler, gradient: 'from-blue-500 to-cyan-600' },
    { label: t('about.stats.projects'), value: '480+', icon: Building2, gradient: 'from-purple-500 to-pink-600' },
    { label: t('about.stats.partners'), value: '40+', icon: Users, gradient: 'from-orange-500 to-red-600' },
    { label: t('about.stats.ontime'), value: '98%', icon: ShieldCheck, gradient: 'from-green-500 to-emerald-600' },
  ];

  const values = [
    {
      icon: Award,
      title: t('about.value_quality', 'Quality Excellence'),
      description: t('about.value_quality_desc', 'Every installation meets the highest standards'),
    },
    {
      icon: Target,
      title: t('about.value_precision', 'Precision Engineering'),
      description: t('about.value_precision_desc', 'Meticulous attention to every detail'),
    },
    {
      icon: Heart,
      title: t('about.value_care', 'Customer Care'),
      description: t('about.value_care_desc', 'Your satisfaction is our priority'),
    },
    {
      icon: Sparkles,
      title: t('about.value_innovation', 'Innovation'),
      description: t('about.value_innovation_desc', 'Modern solutions for contemporary spaces'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="py-16 lg:py-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs uppercase tracking-widest font-semibold border-blue-500 text-blue-600 mb-4">
              {t('about.badge')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
              {t('about.heading')}
            </h1>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 lg:p-10 space-y-6">
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                {t('about.description1')}
              </p>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                {t('about.description2')}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-slate-200 bg-white hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-white mx-auto shadow-lg`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="text-3xl lg:text-4xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-12">
              {t('about.our_values', 'Our Values')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="border-slate-200 bg-white hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full group">
                      <CardContent className="p-6 flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg text-foreground">
                            {value.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {value.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-8 lg:p-12 text-center text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              {t('about.cta_title', 'Ready to Transform Your Space?')}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {t('about.cta_description', 'Let us bring your vision to life with precision and care')}
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors duration-300 shadow-lg"
            >
              {t('about.cta_button', 'Get In Touch')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
