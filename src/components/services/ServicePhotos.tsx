'use client';
/**
 * Service landing page photo grid + lightbox. Images come from the server.
 */
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import ImagePreviewModal from '@/components/projects/ImagePreviewModal';
import { getThumbnailUrl, type CloudinaryImage } from '@/lib/cloudinary';

interface ServicePhotosProps {
  images: CloudinaryImage[];
  title: string;
  altFallback: string;
  allPhotosHref: string;
  allPhotosLabel: string;
}

const ServicePhotos: React.FC<ServicePhotosProps> = ({ images, title, altFallback, allPhotosHref, allPhotosLabel }) => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const handlePrev = () => setPreviewIndex((i) => (i === null ? i : i === 0 ? images.length - 1 : i - 1));
  const handleNext = () => setPreviewIndex((i) => (i === null ? i : i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="mt-12 pt-10 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy flex items-center gap-2">
          <Camera className="w-6 h-6 text-brand-gold" />
          {title}
        </h2>
        <Link
          href={allPhotosHref}
          className="text-sm text-brand-gold hover:text-brand-navy font-medium transition-colors"
        >
          {allPhotosLabel}
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <button
            key={img.public_id}
            onClick={() => setPreviewIndex(idx)}
            className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            aria-label={img.context?.custom?.alt || altFallback}
          >
            <Image
              src={getThumbnailUrl(img.public_id, 400)}
              alt={img.context?.custom?.alt || altFallback}
              fill
              sizes="(min-width: 768px) 200px, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/30 transition-colors duration-300 flex items-center justify-center">
              <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        ))}
      </div>

      {previewIndex !== null && (
        <ImagePreviewModal
          image={images[previewIndex]}
          images={images}
          previewIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          getImageCategory={() => altFallback}
        />
      )}
    </div>
  );
};

export default ServicePhotos;
