import { type FC } from 'react';
import {
  type CloudinaryImage,
  getThumbnailUrl,
  formatCategoryName,
  getCategoryFromPublicId,
  isFeatured,
} from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ImageCardProps {
  image: CloudinaryImage;
  onDelete: (publicId: string) => void;
  onToggleFeatured: (publicId: string, featured: boolean) => void;
  onPreview: (image: CloudinaryImage) => void;
}

const ImageCard: FC<ImageCardProps> = ({
  image,
  onDelete,
  onToggleFeatured,
  onPreview,
}) => {
  const featured = isFeatured(image);

  return (
    <div className="relative group rounded-lg overflow-hidden bg-white shadow-md">
      {/* Image */}
      <button
        onClick={() => onPreview(image)}
        className="w-full aspect-square cursor-pointer"
      >
        <img
          src={getThumbnailUrl(image.public_id, 400)}
          alt={image.context?.custom?.alt || 'Gallery image'}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </button>

      {/* Featured Badge */}
      {featured && (
        <Badge className="absolute top-2 left-2 bg-brand-gold text-brand-navy">
          ⭐ Featured
        </Badge>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-brand-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <Button
          size="sm"
          variant="outline"
          className="bg-white/10 border-white text-white hover:bg-white hover:text-brand-navy"
          onClick={() => onPreview(image)}
        >
          👁️ View
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={`border-brand-gold ${
            featured
              ? 'bg-brand-gold text-brand-navy'
              : 'bg-white/10 text-brand-gold'
          }`}
          onClick={() => onToggleFeatured(image.public_id, !featured)}
        >
          {featured ? '⭐ Unfeat' : '☆ Feature'}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(image.public_id)}
        >
          🗑️ Delete
        </Button>
      </div>

      {/* Image Info */}
      <div className="p-2 text-xs text-brand-navy/60">
        <div className="flex items-center gap-1 mb-1">
          <span className="inline-block px-1.5 py-0.5 bg-brand-gold/20 text-brand-navy rounded text-[10px] font-medium">
            {formatCategoryName(getCategoryFromPublicId(image.public_id) || 'hero')}
          </span>
        </div>
        {image.width}×{image.height} • {image.format.toUpperCase()}
      </div>
    </div>
  );
};

export default ImageCard;
