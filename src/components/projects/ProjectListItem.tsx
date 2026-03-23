import React from 'react';
import { Calendar } from 'lucide-react';
import { getThumbnailUrl } from '@/hooks/cloudinary';
import { UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';
import type { CloudinaryImage } from '@/lib/cloudinary';

interface ProjectListItemProps {
  img: CloudinaryImage;
  categoryLabel: string;
  featured: boolean;
  altText: string;
  locale: SupportedLocale;
  onClick: () => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  img, categoryLabel, featured, altText, locale, onClick,
}) => (
  <div
    className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row cursor-pointer hover:shadow-xl transition-shadow"
    onClick={onClick}
  >
    <div className="md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden">
      <img
        src={getThumbnailUrl(img.public_id, 600)}
        alt={altText}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        loading="lazy"
        width={600}
        height={338}
      />
      {featured && (
        <span className="absolute top-2 left-2 px-2 py-1 bg-brand-gold text-brand-navy text-xs font-bold rounded-full">
          ⭐ {getLocalizedText(UI_STRINGS.projectFeatured, locale)}
        </span>
      )}
    </div>
    <div className="flex-1 p-4 sm:p-6">
      {categoryLabel && (
        <span className="inline-block px-2 sm:px-3 py-1 bg-brand-gold/20 text-brand-navy rounded-full text-xs font-medium mb-2 sm:mb-3">
          {categoryLabel}
        </span>
      )}
      <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">
        {img.context?.custom?.caption || altText}
      </h3>
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(img.created_at).toLocaleDateString()}
        </span>
        <span className="text-gray-400">
          {img.width}×{img.height} • {img.format?.toUpperCase()}
        </span>
      </div>
    </div>
  </div>
);

export default ProjectListItem;
