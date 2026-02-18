import type { FC } from 'react';
import { SERVICE_CATEGORIES, type ServiceCategory, formatCategoryName } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';

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
          All Images
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
            {formatCategoryName(category)}
          </Button>
        ))}
      </div>

      {/* Upload Button */}
      <Button
        className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
        onClick={onUpload}
      >
        📤 Upload to {selectedCategory === 'all' ? '...' : formatCategoryName(selectedCategory)}
      </Button>
    </div>
  );
};

export default AdminControls;
