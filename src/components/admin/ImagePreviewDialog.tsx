import { type FC } from 'react';
import Image from 'next/image';
import { type CloudinaryImage, getGalleryUrl } from '@/lib/cloudinary';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImagePreviewDialogProps {
  image: CloudinaryImage | null;
  onClose: () => void;
}

const ImagePreviewDialog: FC<ImagePreviewDialogProps> = ({ image, onClose }) => (
  <Dialog open={!!image} onOpenChange={() => onClose()}>
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Image Preview</DialogTitle>
      </DialogHeader>
      {image && (
        <div className="space-y-4">
          <Image
            src={getGalleryUrl(image.public_id)}
            alt={image.context?.custom?.alt || 'Preview'}
            width={image.width || 1200}
            height={image.height || 900}
            sizes="(min-width: 768px) 672px, 100vw"
            className="w-full h-auto rounded-lg"
          />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-brand-navy/60">Dimensions:</span>{' '}
              {image.width}×{image.height}
            </div>
            <div>
              <span className="text-brand-navy/60">Format:</span>{' '}
              {image.format.toUpperCase()}
            </div>
            <div>
              <span className="text-brand-navy/60">Created:</span>{' '}
              {new Date(image.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="text-brand-navy/60">Tags:</span>{' '}
              {image.tags?.join(', ') || 'None'}
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default ImagePreviewDialog;
