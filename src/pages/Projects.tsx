import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageGallery } from '@/components/ImageGallery';
import { useProjectCategories, useProjects, useProjectsByCategory, getImageUrl } from '@/lib/strapi';

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: categories, isLoading: categoriesLoading } = useProjectCategories();
  const { data: allProjectsData, isLoading: allProjectsLoading } = useProjects();
  const { data: categoryProjects, isLoading: categoryProjectsLoading } = useProjectsByCategory(
    activeTab !== 'all' ? activeTab : ''
  );

  const allProjects = allProjectsData?.projects || [];
  const currentProjects = activeTab === 'all' ? allProjects : (categoryProjects || []);

  // Convert project gallery images to URLs
  const getProjectImages = (projects: typeof allProjects) => {
    return projects
      .filter(project => project && project.slug)
      .flatMap(project => 
        (project.gallery || []).map(img => getImageUrl(img)).filter(Boolean)
      );
  };

  const isLoading = categoriesLoading || (activeTab === 'all' ? allProjectsLoading : categoryProjectsLoading);

  if (categoriesLoading || allProjectsLoading) {
    return (
      <div className="py-16 lg:py-20 bg-white text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const projectImages = getProjectImages(currentProjects);

  return (
    <div className="py-16 lg:py-20 bg-white text-foreground">
      <div className="container mx-auto px-4">
        <div className="mb-10 lg:mb-14 flex flex-col gap-4">
          <div className="space-y-3">
            <div className="inline-block border border-accent/20 text-xs uppercase tracking-[0.2em] rounded-full px-3 py-1 text-accent">
              {t('projects.badge')}
            </div>
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight text-primary">
              {t('projects.heading')}
            </h1>
            <p className="max-w-2xl text-sm lg:text-base text-muted-foreground">
              {t('projects.description')}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 flex-wrap h-auto gap-2 bg-accent/5">
            <TabsTrigger value="all" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              {t('projects.allProjects')} ({allProjects.length})
            </TabsTrigger>
            {categories?.filter(category => category && category.slug).map(category => {
              const categoryProjectCount = allProjects.filter(
                p => p && p.category?.slug === category.slug
              ).length;
              return (
                <TabsTrigger 
                  key={category.slug} 
                  value={category.slug}
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  {category.title} ({categoryProjectCount})
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              </div>
            ) : projectImages.length > 0 ? (
              <ImageGallery images={projectImages} columns={3} category={t('projects.allProjects')} />
            ) : (
              <p className="text-center text-muted-foreground py-12">{t('projects.noProjects')}</p>
            )}
          </TabsContent>

          {categories?.filter(category => category && category.slug).map(category => (
            <TabsContent key={category.slug} value={category.slug}>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                </div>
              ) : projectImages.length > 0 ? (
                <ImageGallery images={projectImages} columns={3} category={category.title} />
              ) : (
                <p className="text-center text-muted-foreground py-12">{t('projects.noProjects')}</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Projects;
