import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import { PROJECT_CATEGORIES } from '@/data/project-categories';
import { getLocalizedText, type SupportedLocale, type LocalizedText } from '@/data';

interface ProjectFiltersProps {
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  locale: SupportedLocale;
  allCategoriesText: LocalizedText;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  selectedCategory, onCategoryChange, viewMode, onViewModeChange, locale, allCategoriesText,
}) => (
  <section className="py-4 sm:py-6 md:py-8 bg-white border-b sticky top-16 sm:top-20 z-20">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            onClick={() => onCategoryChange(undefined)}
            className="rounded-full text-xs sm:text-sm px-3 sm:px-4 flex-shrink-0"
            size="sm"
          >
            {getLocalizedText(allCategoriesText, locale)}
          </Button>
          {PROJECT_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => onCategoryChange(category.id)}
              className="rounded-full text-xs sm:text-sm px-3 sm:px-4 flex-shrink-0"
              size="sm"
            >
              <span className="mr-1">{category.icon}</span>
              {getLocalizedText(category.name, locale)}
            </Button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center gap-2 border rounded-full p-1">
          <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => onViewModeChange('grid')} className="rounded-full px-3">
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => onViewModeChange('list')} className="rounded-full px-3">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default ProjectFilters;
