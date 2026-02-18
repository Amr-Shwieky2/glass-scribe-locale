import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getGalleryUrl } from '@/hooks/cloudinary';
import type { CloudinaryImage } from '@/lib/cloudinary';

interface ImagePreviewModalProps {
  image: CloudinaryImage;
  images: CloudinaryImage[];
  previewIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  getImageCategory: (img: CloudinaryImage) => string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  image, images, previewIndex, onClose, onPrev, onNext, getImageCategory,
}) => (
  <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
    {/* Header */}
    <div className="p-3 sm:p-4 flex justify-between items-center text-white safe-top">
      <div className="flex-1 mr-4">
        <h3 className="text-base sm:text-lg md:text-xl font-bold truncate">
          {image.context?.custom?.caption || getImageCategory(image) || 'Glass Work'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400">
          {image.width}×{image.height} • {image.format?.toUpperCase()} • {new Date(image.created_at).toLocaleDateString()}
        </p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full flex-shrink-0">
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>

    {/* Main Image */}
    <div className="flex-1 flex items-center justify-center px-2 sm:px-4 relative">
      <img
        src={getGalleryUrl(image.public_id)}
        alt={image.context?.custom?.alt || 'Preview'}
        className="max-h-[70vh] max-w-full object-contain rounded-lg"
      />
      {images.length > 1 && (
        <>
          <button onClick={onPrev} className="absolute left-2 sm:left-4 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={onNext} className="absolute right-2 sm:right-4 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}
    </div>

    {/* Counter */}
    <p className="text-white/60 text-center text-sm sm:text-base pb-4">
      {previewIndex + 1} / {images.length}
    </p>
  </div>
);

export default ImagePreviewModal;
