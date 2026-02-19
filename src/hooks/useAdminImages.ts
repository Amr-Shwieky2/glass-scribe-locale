import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import {
  type ServiceCategory,
  type CloudinaryImage,
  getUploadWidgetConfig,
  fetchImagesByCategory,
  fetchAllImages,
  deleteImage,
  toggleFeatured,
  toggleServiceCard,
  toggleHeroImage,
  formatCategoryName,
} from '@/lib/cloudinary';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: ReturnType<typeof getUploadWidgetConfig>,
        callback: (error: Error | null, result: { event: string; info?: CloudinaryImage }) => void
      ) => { open: () => void };
    };
  }
}

export function useAdminImages() {
  const { token } = useAdmin();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadPicker, setShowUploadPicker] = useState(false);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response =
        selectedCategory === 'all'
          ? await fetchAllImages()
          : await fetchImagesByCategory(selectedCategory);
      setImages(response.resources || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load images.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, toast]);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleDelete = async (publicId: string) => {
    if (!token) return;
    try {
      await deleteImage(publicId, token);
      setImages((prev) => prev.filter((img) => img.public_id !== publicId));
      toast({ title: 'Deleted', description: 'Image deleted successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete image.', variant: 'destructive' });
    }
  };

  const handleToggleFeatured = async (publicId: string, featured: boolean) => {
    if (!token) return;
    try {
      await toggleFeatured(publicId, featured, token);
      setImages((prev) =>
        prev.map((img) =>
          img.public_id === publicId
            ? { ...img, tags: featured ? [...(img.tags || []), 'featured'] : (img.tags || []).filter((t) => t !== 'featured') }
            : img
        )
      );
      toast({ title: featured ? 'Featured' : 'Unfeatured', description: `Image ${featured ? 'added to' : 'removed from'} featured.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update image.', variant: 'destructive' });
    }
  };

  const handleToggleServiceCard = async (publicId: string, isServiceCard: boolean) => {
    if (!token) return;
    try {
      await toggleServiceCard(publicId, isServiceCard, token);
      setImages((prev) =>
        prev.map((img) =>
          img.public_id === publicId
            ? { ...img, tags: isServiceCard ? [...(img.tags || []), 'service-card'] : (img.tags || []).filter((t) => t !== 'service-card') }
            : img
        )
      );
      toast({ title: isServiceCard ? 'Set as Service Card' : 'Removed as Service Card', description: `Image ${isServiceCard ? 'set as' : 'removed as'} service card.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update service card.', variant: 'destructive' });
    }
  };

  const handleToggleHeroImage = async (publicId: string, isHeroImage: boolean) => {
    if (!token) return;
    try {
      await toggleHeroImage(publicId, isHeroImage, token);
      setImages((prev) =>
        prev.map((img) =>
          img.public_id === publicId
            ? { ...img, tags: isHeroImage ? [...(img.tags || []), 'hero-gallery'] : (img.tags || []).filter((t) => t !== 'hero-gallery') }
            : img
        )
      );
      toast({ title: isHeroImage ? 'Added to Hero' : 'Removed from Hero', description: `Image ${isHeroImage ? 'added to' : 'removed from'} hero gallery.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update hero image.', variant: 'destructive' });
    }
  };

  const openUploadWidget = (category: ServiceCategory) => {
    setShowUploadPicker(false);
    const widget = window.cloudinary?.createUploadWidget(
      getUploadWidgetConfig(category),
      (error, result) => {
        if (error) { toast({ title: 'Upload Error', description: 'Failed to upload image.', variant: 'destructive' }); return; }
        if (result.event === 'success' && result.info) {
          setImages((prev) => [result.info as CloudinaryImage, ...prev]);
          toast({ title: 'Uploaded', description: `Image uploaded to ${formatCategoryName(category)}.` });
        }
      }
    );
    widget?.open();
  };

  const handleUpload = () => {
    if (selectedCategory !== 'all') openUploadWidget(selectedCategory);
    else setShowUploadPicker(true);
  };

  // Load Cloudinary widget script
  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return {
    images, isLoading, selectedCategory, setSelectedCategory,
    showUploadPicker, setShowUploadPicker,
    handleDelete, handleToggleFeatured, handleToggleServiceCard, handleToggleHeroImage, handleUpload, openUploadWidget,
  };
}
