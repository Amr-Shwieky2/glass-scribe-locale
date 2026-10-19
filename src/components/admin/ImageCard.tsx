'use client';
import { type FC } from 'react';
import Image from 'next/image';
import {
  type CloudinaryImage,
  getThumbnailUrl,
  getCategoryFromPublicId,
  isFeatured,
  type ServiceCategory,
} from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';

const BROKEN_IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='40'%3E%F0%9F%96%BC%3C/text%3E%3C/svg%3E";

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
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);
  
  const getCategoryName = (category: ServiceCategory | string): string => {
    const categoryStrings = ADMIN_STRINGS.categories[category as keyof typeof ADMIN_STRINGS.categories];
    return categoryStrings ? t(categoryStrings) : category;
  };

  const featured = isFeatured(image);
  const serviceCard = isServiceCard(image);
  const heroGallery = isHeroGallery(image);

  return (
    <div className="relative group rounded-lg overflow-hidden bg-white shadow-md">
      {/* Image */}
      <button
        onClick={() => onPreview(image)}
        className="relative block w-full aspect-square cursor-pointer"
      >
        <Image
          src={getThumbnailUrl(image.public_id, 400)}
          alt={image.context?.custom?.alt || 'Gallery image'}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = BROKEN_IMG_FALLBACK; e.currentTarget.srcset = ''; }}
        />
      </button>

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {featured && (
          <Badge className="bg-brand-gold text-brand-navy">
            {t(ADMIN_STRINGS.imageCard.featuredBadge)}
          </Badge>
        )}
        {serviceCard && (
          <Badge className="bg-green-500 text-white">
            {t(ADMIN_STRINGS.imageCard.serviceCardBadge)}
          </Badge>
        )}
        {heroGallery && (
          <Badge className="bg-purple-500 text-white">
            {t(ADMIN_STRINGS.imageCard.heroBadge)}
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
            {t(ADMIN_STRINGS.imageCard.view)}
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
            {featured ? t(ADMIN_STRINGS.imageCard.unfeature) : t(ADMIN_STRINGS.imageCard.feature)}
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
            {serviceCard ? t(ADMIN_STRINGS.imageCard.unsetCard) : t(ADMIN_STRINGS.imageCard.setCard)}
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
            {heroGallery ? t(ADMIN_STRINGS.imageCard.unsetHero) : t(ADMIN_STRINGS.imageCard.setHero)}
          </Button>
        </div>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(image.public_id)}
        >
          {t(ADMIN_STRINGS.imageCard.delete)}
        </Button>
      </div>

      {/* Image Info */}
      <div className="p-2 text-xs text-brand-navy/60">
        <div className="flex items-center gap-1 mb-1">
          <span className="inline-block px-1.5 py-0.5 bg-brand-gold/20 text-brand-navy rounded text-[10px] font-medium">
            {getCategoryName(getCategoryFromPublicId(image.public_id) || 'hero')}
          </span>
        </div>
        {image.width}×{image.height} • {image.format.toUpperCase()}
      </div>
    </div>
  );
};

export default ImageCard;
