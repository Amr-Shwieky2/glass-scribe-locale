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

const isServiceCard = (image: CloudinaryImage) =>
  image.tags?.includes('service-card') ?? false;

const isHeroGallery = (image: CloudinaryImage) =>
  image.tags?.includes('hero-gallery') ?? false;

export interface ImageCardProps {
  image: CloudinaryImage;
  onDelete: (publicId: string) => void;
  onToggleFeatured: (publicId: string, featured: boolean) => void;
  onToggleServiceCard: (publicId: string, isServiceCard: boolean) => void;
  onToggleHeroImage: (publicId: string, isHeroImage: boolean) => void;
  onPreview: (image: CloudinaryImage) => void;
}

const ImageCard: FC<ImageCardProps> = ({
  image,
  onDelete,
  onToggleFeatured,
  onToggleServiceCard,
  onToggleHeroImage,
  onPreview,
}) => {
  const featured = isFeatured(image);
  const serviceCard = isServiceCard(image);
  const heroGallery = isHeroGallery(image);

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

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {featured && (
          <Badge className="bg-brand-gold text-brand-navy">
            ⭐ Featured
          </Badge>
        )}
        {serviceCard && (
          <Badge className="bg-green-500 text-white">
            🏷️ Service Card
          </Badge>
        )}
        {heroGallery && (
          <Badge className="bg-purple-500 text-white">
            🏠 Hero
          </Badge>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-brand-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
        <div className="flex gap-2">
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
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className={`border-green-400 ${
              serviceCard
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-green-400'
            }`}
            onClick={() => onToggleServiceCard(image.public_id, !serviceCard)}
          >
            {serviceCard ? '🏷️ Unset' : '🏷️ Card'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`border-purple-400 ${
              heroGallery
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-purple-400'
            }`}
            onClick={() => onToggleHeroImage(image.public_id, !heroGallery)}
          >
            {heroGallery ? '🏠 Unhero' : '🏠 Hero'}
          </Button>
        </div>
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
