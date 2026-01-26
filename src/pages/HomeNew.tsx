/**
 * Home Component - Fully CMS-Driven
 * All content loaded from Strapi
 */

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import {
  useHomePage,
  useServices,
  useFeaturedProjects,
  getImageUrl,
  getImageAlt,
  getExcerpt,
} from '@/lib/strapi';

const HomeNew: React.FC = () => {
  const { currentLanguage } = useLanguage();
  
  // Fetch CMS data
  const { data: homePage, isLoading: homeLoading, error: homeError } = useHomePage();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: projects, isLoading: projectsLoading } = useFeaturedProjects(6);

  // WhatsApp handler
  const handleWhatsApp = useCallback(() => {
    const phone = '+972501234567'; // From site settings
    const message = encodeURIComponent('Hello, I would like to inquire about your services');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }, []);

  // Loading state
  if (homeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (homeError || !homePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h2 className="text-2xl font-bold mb-4">Unable to load content</h2>
          <p className="text-muted-foreground mb-6">
            Please check your connection and try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {homePage.heroImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={getImageUrl(homePage.heroImage)}
              alt={getImageAlt(homePage.heroImage, 'Hero background')}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {homePage.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {homePage.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg"
            >
              {homePage.primaryCtaText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg"
            >
              <Link to={`/${currentLanguage}/services`}>
                {homePage.secondaryCtaText}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {homePage.servicesSectionTitle}
            </h2>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4" />
                  <div className="bg-gray-300 h-6 rounded w-3/4 mb-2" />
                  <div className="bg-gray-300 h-4 rounded w-full" />
                </div>
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).filter(service => service && service.slug).map((service) => (
                <Link
                  key={service.slug}
                  to={`/${currentLanguage}/services`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {service.coverImage && (
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={getImageUrl(service.coverImage)}
                          alt={getImageAlt(service.coverImage, service.title)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {service.shortDescription}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to={`/${currentLanguage}/services`}>
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {homePage.featuredProjectsSectionTitle}
            </h2>
          </div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-80 rounded-lg" />
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(project => project && project.slug).map((project) => (
                <Link
                  key={project.slug}
                  to={`/${currentLanguage}/projects`}
                  className="group relative overflow-hidden rounded-lg shadow-lg"
                >
                  {project.coverImage ? (
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={getImageUrl(project.coverImage)}
                        alt={getImageAlt(project.coverImage, project.title)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        {project.category?.title && (
                          <div className="text-sm mb-2 text-blue-300">
                            {project.category.title}
                          </div>
                        )}
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm opacity-90 line-clamp-2">
                            {getExcerpt(project.description, 100)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-80 overflow-hidden bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">{project.title}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured projects yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" asChild variant="outline">
              <Link to={`/${currentLanguage}/projects`}>
                View All Projects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contact us today for a free consultation and quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="bg-white text-accent hover:bg-gray-100 px-8 py-6 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              <Link to={`/${currentLanguage}/contact`}>
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeNew;
