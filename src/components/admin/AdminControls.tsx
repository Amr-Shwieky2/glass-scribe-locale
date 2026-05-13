'use client';
import type { FC } from 'react';
import { SERVICE_CATEGORIES, type ServiceCategory } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';

interface AdminControlsProps {
  selectedCategory: ServiceCategory | 'all';
  onCategoryChange: (category: ServiceCategory | 'all') => void;
  onUpload: () => void;
}

const AdminControls: FC<AdminControlsProps> = ({
  selectedCategory,
  onCategoryChange,
  onUpload,
}) => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);
  
  const getCategoryName = (category: ServiceCategory): string => {
    const categoryStrings = ADMIN_STRINGS.categories[category as keyof typeof ADMIN_STRINGS.categories];
    return categoryStrings ? t(categoryStrings) : category;
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className={
            selectedCategory === 'all'
              ? 'bg-brand-gold text-brand-navy'
              : ''
          }
          onClick={() => onCategoryChange('all')}
        >
          {t(ADMIN_STRINGS.controls.allImages)}
        </Button>
        {SERVICE_CATEGORIES.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? 'default' : 'outline'}
            className={
              selectedCategory === category
                ? 'bg-brand-gold text-brand-navy'
                : ''
            }
            onClick={() => onCategoryChange(category)}
          >
            {getCategoryName(category)}
          </Button>
        ))}
      </div>

      {/* Upload Button */}
      <Button
        className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
        onClick={onUpload}
      >
        {t(ADMIN_STRINGS.controls.uploadTo)} {selectedCategory === 'all' ? '...' : getCategoryName(selectedCategory)}
      </Button>
    </div>
  );
};

export default AdminControls;
