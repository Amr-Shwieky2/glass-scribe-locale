import React from 'react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import { getLocalizedText } from '@/data/helpers';
import { UI_STRINGS } from '@/data/ui-strings';
import { PROJECT_CATEGORIES } from '@/data/project-categories';
import type { SupportedLocale, LocalizedText } from '@/data/types';

interface Props {
  locale: SupportedLocale;
  title: LocalizedText;
  subtitle: LocalizedText;
  imageCount: number;
}

const ProjectsHeader: React.FC<Props> = ({ locale, title, subtitle, imageCount }) => (
  <AnimatedPageHeader>
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">
        {getLocalizedText(title, locale)}
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
        {getLocalizedText(subtitle, locale)}
      </p>
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-6">
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-brand-gold">{imageCount || '—'}</p>
          <p className="text-sm text-gray-400">{getLocalizedText(UI_STRINGS.projectPhotos, locale)}</p>
        </div>
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-brand-gold">{PROJECT_CATEGORIES.length}</p>
          <p className="text-sm text-gray-400">{getLocalizedText(UI_STRINGS.projectCategories, locale)}</p>
        </div>
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-brand-gold">100%</p>
          <p className="text-sm text-gray-400">{getLocalizedText(UI_STRINGS.projectSatisfaction, locale)}</p>
        </div>
      </div>
    </div>
  </AnimatedPageHeader>
);

export default ProjectsHeader;
