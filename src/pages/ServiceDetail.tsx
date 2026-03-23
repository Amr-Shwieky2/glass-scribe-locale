import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Phone, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getServiceSeoPageByServiceId, 
  SERVICE_SEO_SECTION_TITLES, 
  LOCATION_SEO_LINKS,
  LOCATION_SEO_ALIAS_PREFIX
} from '@/data/service-seo-content';
import { getLocalizedText, getLocalizedArray, CONTACT_INFO, UI_STRINGS, type SupportedLocale } from '@/data';
import ServiceJsonLd from '@/components/ServiceJsonLd';

const ServiceDetail: React.FC = () => {
  const { lang, serviceId } = useParams<{ lang: string; serviceId: string }>();
  const { currentLanguage, isRTL } = useLanguage();
  const locale = (lang || currentLanguage) as SupportedLocale;

  const service = useMemo(() => {
    if (!serviceId) return null;
    return getServiceSeoPageByServiceId(serviceId);
  }, [serviceId]);

  if (!service) {
    return <Navigate to={`/${locale}/services`} replace />;
  }

  const t = (obj: unknown) => getLocalizedText(obj as Record<SupportedLocale, string>, locale);
  const titles = SERVICE_SEO_SECTION_TITLES;

  const whatsappMessage = `שלום, אשמח לקבל הצעת מחיר עבור ${t(service.heroTitle)}`;

  return (
    <div className="min-h-screen bg-brand-light">
      <Helmet>
        <title>{t(service.metaTitle)}</title>
        <meta name="description" content={t(service.metaDescription)} />
        <meta name="keywords" content={t(service.keywords)} />
        <link rel="canonical" href={`https://www.shwakiglassworks.com/${locale}/services/${serviceId}`} />
        <meta property="og:title" content={t(service.metaTitle)} />
        <meta property="og:description" content={t(service.metaDescription)} />
        <meta property="og:type" content="article" />
      </Helmet>

      <ServiceJsonLd service={service} locale={locale} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-brand-navy text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Link 
            to={`/${locale}/services`}
            className="inline-flex items-center text-brand-gold hover:text-white transition-colors mb-6 text-sm font-medium"
          >
            {isRTL ? <ArrowRight className="ml-2 w-4 h-4" /> : <ArrowLeft className="mr-2 w-4 h-4" />}
            {locale === 'he' ? 'כל השירותים' : locale === 'ar' ? 'جميع الخدمات' : locale === 'ru' ? 'Все услуги' : 'All Services'}
          </Link>
          <p className="text-brand-gold font-medium mb-4">{t(service.eyebrow)}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{t(service.heroTitle)}</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t(service.heroSubtitle)}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left / Right Column: Typography & Text */}
          <div className="lg:col-span-2 space-y-12">
            <div className="prose prose-lg max-w-none text-brand-navy">
              <p className="text-xl leading-relaxed text-brand-navy/90 font-medium mb-8">
                {t(service.intro)}
              </p>
              
              <h2 className="text-2xl font-bold text-brand-navy mt-10 mb-4">{t(titles.overview)}</h2>
              <p className="leading-relaxed text-gray-700">{t(service.overview)}</p>

              <h2 className="text-2xl font-bold text-brand-navy mt-10 mb-4">{t(titles.options)}</h2>
              <p className="leading-relaxed text-gray-700">{t(service.options)}</p>

              <h2 className="text-2xl font-bold text-brand-navy mt-10 mb-4">{t(titles.process)}</h2>
              <p className="leading-relaxed text-gray-700">{t(service.process)}</p>

              <h2 className="text-2xl font-bold text-brand-navy mt-10 mb-4">{t(titles.benefits)}</h2>
              <p className="leading-relaxed text-gray-700">{t(service.benefits)}</p>
            </div>

            {/* FAQs */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-brand-navy mb-8">{t(titles.faq)}</h2>
              <div className="space-y-6">
                {service.faqs.map((faq: { question: unknown, answer: unknown }, idx: number) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-brand-navy mb-3">{t(faq.question)}</h3>
                    <p className="text-gray-700 leading-relaxed">{t(faq.answer)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* CTA Box */}
            <div className="bg-brand-navy text-white p-8 rounded-2xl shadow-xl sticky top-24">
              <h3 className="text-2xl font-bold mb-4 text-brand-gold">{t(UI_STRINGS.ctaReadyToStart)}</h3>
              <p className="text-white/80 mb-8">{t(UI_STRINGS.ctaContactToday)}</p>
              
              <div className="space-y-4">
                <a 
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-brand-gold text-brand-navy py-4 px-6 rounded-xl font-bold hover:bg-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t(UI_STRINGS.whatsapp)}
                </a>
                <a 
                  href={`tel:${CONTACT_INFO.phoneIntl}`}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 text-white py-4 px-6 rounded-xl font-bold hover:bg-white/20 border border-white/20 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-brand-navy mb-4 border-b pb-2">{t(titles.highlights)}</h3>
              <ul className="space-y-3">
                {getLocalizedArray(service.highlights, locale).map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-brand-navy mb-4 border-b pb-2">{t(titles.areas)}</h3>
              <p className="text-sm text-gray-600 mb-4">{t(service.areasSummary)}</p>
              <div className="flex flex-wrap gap-2">
                {service.relatedLocations.map((slug: string) => {
                  const loc = LOCATION_SEO_LINKS.find(l => l.slug === slug);
                  if (!loc) return null;
                  return (
                    <Link 
                      key={slug}
                      to={`/${locale}/${LOCATION_SEO_ALIAS_PREFIX}-${slug}`}
                      className="text-xs bg-gray-50 hover:bg-brand-navy hover:text-white text-brand-navy border border-gray-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {t(loc.label)}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
