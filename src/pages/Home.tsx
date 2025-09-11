import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Shield, 
  Users,
  Star,
  Zap,
  Eye,
  Wrench
} from 'lucide-react';
import heroImage from '@/assets/hero-glass-installation.jpg';
import railingImage from '@/assets/glass-railing.jpg';
import storefrontImage from '@/assets/storefront-glass.jpg';

const Home = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello, I'd like a quote for glass installation. Language: ${currentLanguage}`);
    window.open(`https://wa.me/972501234567?text=${message}`, '_blank');
  };

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

  const processSteps = [
    { key: 'step1', icon: <Phone className="w-6 h-6" /> },
    { key: 'step2', icon: <Eye className="w-6 h-6" /> },
    { key: 'step3', icon: <Zap className="w-6 h-6" /> },
    { key: 'step4', icon: <CheckCircle className="w-6 h-6" /> },
    { key: 'step5', icon: <Shield className="w-6 h-6" /> }
  ];

  const whyUs = [
    { icon: <Clock className="w-6 h-6 text-primary" />, title: "Fast Lead Time", description: "Quick turnaround from measurement to installation" },
    { icon: <Eye className="w-6 h-6 text-primary" />, title: "Precise Measurement", description: "Professional on-site measurement for perfect fit" },
    { icon: <Shield className="w-6 h-6 text-primary" />, title: "Safety Glass", description: "Tempered and laminated glass options available" },
    { icon: <CheckCircle className="w-6 h-6 text-primary" />, title: "Full Warranty", description: "Comprehensive warranty on all installations" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Professional Glass Installation
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t('hero.subtitle')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="cta-button flex items-center space-x-2"
                  onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span>{t('hero.cta.quote')}</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleWhatsApp}
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('hero.cta.whatsapp')}</span>
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 bg-primary/20 rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">500+ Happy Customers</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  <span className="text-sm text-muted-foreground ml-2">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Professional glass installation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-success" />
                  <div>
                    <div className="font-semibold">15+ Years</div>
                    <div className="text-sm text-muted-foreground">Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t('services.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional glass installation services for residential and commercial properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.key} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={t(`services.${service.key}.title`)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    {service.icon}
                    <h3 className="text-xl font-semibold text-foreground">
                      {t(`services.${service.key}.title`)}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {t(`services.${service.key}.description`)}
                  </p>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose GlassMax?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t('process.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.key} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {t(`process.${step.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`process.${step.key}.description`)}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="quote-form" className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote. We respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={handleWhatsApp}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('hero.cta.whatsapp')}</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open('tel:+972501234567')}
                className="flex items-center space-x-2 bg-white/10 border-white/20 hover:bg-white/20"
              >
                <Phone className="w-5 h-5" />
                <span>{t('hero.cta.call')}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;