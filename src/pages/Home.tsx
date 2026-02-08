/**
 * Home Page
 * 
 * Main landing page with hero, services, projects, and testimonials.
 * All data is static - no backend required.
 */

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Phone, MessageCircle } from 'lucide-react';
import HeroGallery from '@/components/HeroGallery';
import { useFeaturedImages, useCloudinaryImages, getGalleryUrl, getThumbnailUrl } from '@/hooks/useCloudinaryImages';
import { getCategoryFromPublicId, formatCategoryName } from '@/lib/cloudinary';
import {
  BUSINESS_INFO,
  CONTACT_INFO,
  SERVICES,
  TESTIMONIALS,
  PAGE_CONTENT,
  UI_STRINGS,
  getLocalizedText,
  getLocalizedArray,
  type SupportedLocale,
} from '@/data/business';

// Static fallback projects (used when Cloudinary has no featured images)
const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: { en: 'Modern Frameless Shower', he: 'מקלחון ללא מסגרת מודרני', ar: 'دش بدون إطار حديث' },
    category: { name: { en: 'Shower Glass', he: 'מקלחונים', ar: 'زجاج الدش' } },
    location: { en: 'Tel Aviv', he: 'תל אביב', ar: 'تل أبيب' },
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
  },
  {
    id: 2,
    title: { en: 'Balcony Glass Railing', he: 'מעקה זכוכית למרפסת', ar: 'درابزين زجاجي للشرفة' },
    category: { name: { en: 'Glass Railings', he: 'מעקות זכוכית', ar: 'درابزين زجاجي' } },
    location: { en: 'Herzliya', he: 'הרצליה', ar: 'هرتسليا' },
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  },
  {
    id: 3,
    title: { en: 'Gym Wall Mirror', he: 'מראה קיר לחדר כושר', ar: 'مرآة حائط للصالة الرياضية' },
    category: { name: { en: 'Mirrors', he: 'מראות', ar: 'مرايا' } },
    location: { en: 'Tel Aviv', he: 'תל אביב', ar: 'تل أبيب' },
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  },
  {
    id: 4,
    title: { en: 'Modern Office Partition', he: 'מחיצת משרד מודרנית', ar: 'فاصل مكتب حديث' },
    category: { name: { en: 'Glass Partitions', he: 'מחיצות זכוכית', ar: 'فواصل زجاجية' } },
    location: { en: 'Tel Aviv', he: 'תל אביב', ar: 'تل أبيب' },
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  },
  {
    id: 5,
    title: { en: 'Boutique Storefront', he: 'חזית בוטיק', ar: 'واجهة متجر' },
    category: { name: { en: 'Storefront Glass', he: 'חזיתות חנויות', ar: 'واجهات المتاجر' } },
    location: { en: 'Dizengoff, Tel Aviv', he: 'דיזנגוף, תל אביב', ar: 'ديزنغوف، تل أبيب' },
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  },
  {
    id: 6,
    title: { en: 'Kitchen Backsplash', he: 'חיפוי גב למטבח', ar: 'واجهة خلفية للمطبخ' },
    category: { name: { en: 'Custom Glass', he: 'עבודות מותאמות', ar: 'أعمال مخصصة' } },
    location: { en: 'Petah Tikva', he: 'פתח תקווה', ar: 'بيتح تكفا' },
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
  },
];

const Home: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;

  // Fetch Cloudinary featured images
  const { images: featuredImages, isLoading: featuredLoading } = useFeaturedImages({ limit: 6 });

  // WhatsApp handler
  const handleWhatsApp = useCallback(() => {
    const phone = CONTACT_INFO.whatsapp;
    const message = encodeURIComponent('Hello, I would like to inquire about your services');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }, []);

  // Call handler
  const handleCall = useCallback(() => {
    window.location.href = `tel:${CONTACT_INFO.phone.mobile}`;
  }, []);

  const content = PAGE_CONTENT.home;

  return (
    <div className="min-h-screen">
      {/* Premium Animated Hero Gallery */}
      <HeroGallery />

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-brand-navy">
              {getLocalizedText(content.sections.services.title, locale)}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-navy/70 max-w-2xl mx-auto px-2">
              {getLocalizedText(content.sections.services.subtitle, locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {SERVICES.map((service) => (
              <Link 
                key={service.id}
                to={`/${currentLanguage}/projects?category=${service.id}`}
                className="service-card-animated block"
              >
                <div className="card-inner">
                  {/* Mac-style dots */}
                  <div className="service-card-dots">
                    <span className="service-card-dot red"></span>
                    <span className="service-card-dot yellow"></span>
                    <span className="service-card-dot green"></span>
                  </div>

                  {/* Service Image */}
                  <div className="card-image">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={getLocalizedText(service.title, locale)}
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-navy/50 flex items-center justify-center">
                        <span className="text-4xl">{service.icon}</span>
                      </div>
                    )}
                    <span className="card-icon">{service.icon}</span>
                  </div>
                  
                  {/* Card Content */}
                  <div className="card-content">
                    <h3 className="card-title">
                      {getLocalizedText(service.title, locale)}
                    </h3>
                    <p className="card-description">
                      {getLocalizedText(service.description, locale)}
                    </p>
                    <ul className="card-features">
                      {getLocalizedArray(service.features, locale).slice(0, 3).map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Hover arrow */}
                  <div className="card-arrow">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 lg:mt-12">
            <Link 
              to={`/${currentLanguage}/services`}
              className="btn-animated-navy inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              {getLocalizedText(UI_STRINGS.viewAll, locale)}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-brand-navy">
              {getLocalizedText(content.sections.projects.title, locale)}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-navy/70 max-w-2xl mx-auto px-2">
              {getLocalizedText(content.sections.projects.subtitle, locale)}
            </p>
          </div>

          {/* Featured Projects Grid - Cloudinary images with static fallback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredImages.length > 0 ? (
              // Show Cloudinary featured images
              featuredImages.slice(0, 6).map((img) => {
                const category = getCategoryFromPublicId(img.public_id);
                const categoryLabel = category ? formatCategoryName(category) : 'Glass Works';
                return (
                  <Link
                    key={img.public_id}
                    to={`/${currentLanguage}/projects`}
                    className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg aspect-[4/3]"
                  >
                    <img
                      src={getGalleryUrl(img.public_id)}
                      alt={img.context?.custom?.alt || categoryLabel}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                      <span className="inline-block px-2 sm:px-3 py-1 bg-brand-gold/80 text-brand-navy rounded-full text-xs font-medium mb-2">
                        {categoryLabel}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold">{img.context?.custom?.caption || categoryLabel}</h3>
                    </div>
                  </Link>
                );
              })
            ) : (
              // Fallback: static data
              FALLBACK_PROJECTS.map((project) => (
                <Link
                  key={project.id}
                  to={`/${currentLanguage}/projects`}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg aspect-[4/3]"
                >
                  <img
                    src={project.image}
                    alt={getLocalizedText(project.title, locale)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <span className="inline-block px-2 sm:px-3 py-1 bg-brand-gold/80 text-brand-navy rounded-full text-xs font-medium mb-2">
                      {getLocalizedText(project.category.name, locale)}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold">{getLocalizedText(project.title, locale)}</h3>
                    <p className="text-xs sm:text-sm text-white/70 mt-1">📍 {getLocalizedText(project.location, locale)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-8 sm:mt-10 lg:mt-12">
            <Link 
              to={`/${currentLanguage}/projects`}
              className="btn-animated-navy inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              {getLocalizedText(PAGE_CONTENT.projects.allCategories, locale)}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-brand-navy">
              {getLocalizedText(content.sections.testimonials.title, locale)}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-navy/70 max-w-2xl mx-auto px-2">
              {getLocalizedText(content.sections.testimonials.subtitle, locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <p className="text-brand-navy/70 mb-4 sm:mb-6 italic leading-relaxed text-sm sm:text-base">
                    "{getLocalizedText(testimonial.text, locale)}"
                  </p>
                  <div className="border-t border-brand-light pt-3 sm:pt-4">
                    <p className="font-bold text-brand-navy text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-brand-navy/60">
                      {getLocalizedText(testimonial.location, locale)} • {getLocalizedText(testimonial.project, locale)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
            {locale === 'he' ? 'מוכנים לשנות את המרחב שלכם?' :
             locale === 'ar' ? 'مستعد لتحويل مساحتك؟' :
             'Ready to Transform Your Space?'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto text-white/80 px-2">
            {locale === 'he' ? 'צרו קשר היום לייעוץ והצעת מחיר ללא עלות' :
             locale === 'ar' ? 'اتصل بنا اليوم للحصول على استشارة وعرض أسعار مجاني' :
             'Contact us today for a free consultation and quote'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg sm:max-w-none mx-auto">
            <button
              onClick={handleWhatsApp}
              className="btn-animated-gold-filled inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </button>
            <Link 
              to={`/${currentLanguage}/contact`}
              className="btn-animated-gold inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              {locale === 'he' ? 'צרו קשר' :
               locale === 'ar' ? 'اتصل بنا' :
               'Contact Us'}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>

          {/* Contact Details */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 text-brand-gold/80 text-sm sm:text-base">
            <a href={`tel:${CONTACT_INFO.phone.mobile}`} className="hover:text-brand-gold transition-colors py-1">
              📱 {CONTACT_INFO.phone.mobile}
            </a>
            <a href={`tel:${CONTACT_INFO.phone.office}`} className="hover:text-brand-gold transition-colors py-1">
              ☎️ {CONTACT_INFO.phone.office}
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-brand-gold transition-colors py-1">
              ✉️ {CONTACT_INFO.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
