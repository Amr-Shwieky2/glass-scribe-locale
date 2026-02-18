import { type FC } from 'react';
import {
  SERVICE_CATEGORIES,
  type ServiceCategory,
  formatCategoryName,
} from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CategoryPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (category: ServiceCategory) => void;
}

const CategoryPicker: FC<CategoryPickerProps> = ({ open, onOpenChange, onSelect }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Choose a Category</DialogTitle>
        <p className="text-sm text-brand-navy/60 mt-1">
          Select which category to upload images to. This determines where the images appear on the website.
        </p>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {SERVICE_CATEGORIES.filter(c => c !== 'hero').map((category) => (
          <Button
            key={category}
            variant="outline"
            className="h-auto py-4 px-4 flex flex-col items-center gap-2 hover:bg-brand-gold/10 hover:border-brand-gold text-left"
            onClick={() => onSelect(category)}
          >
            <span className="text-2xl">
              {category === 'shower-enclosures' ? '🚿' :
               category === 'glass-railings' ? '🏠' :
               category === 'mirrors' ? '🪞' :
               category === 'partitions' ? '🏢' :
               category === 'storefronts' ? '🏪' :
               category === 'glass-doors' ? '🚪' :
               category === 'backsplashes' ? '✨' :
               category === 'shelves' ? '📐' :
               category === 'lobbies' ? '🏛️' : '📷'}
            </span>
            <span className="text-sm font-medium text-brand-navy">
              {formatCategoryName(category)}
            </span>
          </Button>
        ))}
        <Button
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col items-center gap-2 hover:bg-brand-gold/10 hover:border-brand-gold"
          onClick={() => onSelect('hero')}
        >
          <span className="text-2xl">🎬</span>
          <span className="text-sm font-medium text-brand-navy">Hero / Homepage</span>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default CategoryPicker;
