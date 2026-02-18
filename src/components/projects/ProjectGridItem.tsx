import React from 'react';
import { getThumbnailUrl } from '@/hooks/cloudinary';
import { UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';
import type { CloudinaryImage } from '@/lib/cloudinary';

interface ProjectGridItemProps {
  img: CloudinaryImage;
  categoryLabel: string;
  featured: boolean;
  altText: string;
  locale: SupportedLocale;
  onClick: () => void;
}

const ProjectGridItem: React.FC<ProjectGridItemProps> = ({
  img, categoryLabel, featured, altText, locale, onClick,
}) => (
  <div
    className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg aspect-[4/3] cursor-pointer"
    onClick={onClick}
  >
    <img
      src={getThumbnailUrl(img.public_id, 600)}
      alt={altText}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {featured && (
      <span className="absolute top-3 left-3 px-2 py-1 bg-brand-gold text-brand-navy text-xs font-bold rounded-full">
        ⭐ {getLocalizedText(UI_STRINGS.projectFeatured, locale)}
      </span>
    )}

    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {categoryLabel && (
        <span className="inline-block px-2 py-0.5 bg-brand-gold/80 text-brand-navy rounded-full text-xs font-medium mb-1">
          {categoryLabel}
        </span>
      )}
      <p className="text-sm font-medium truncate">
        {img.context?.custom?.caption || altText}
      </p>
    </div>
  </div>
);

export default ProjectGridItem;
