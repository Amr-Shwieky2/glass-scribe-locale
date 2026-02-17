/**
 * @fileoverview Admin Panel Page
 * @description Image management dashboard for Shwaki Brothers Glassworks.
 * 
 * FEATURES:
 * - Password login
 * - Category-based image browser
 * - Upload via Cloudinary widget
 * - Delete images
 * - Toggle featured status
 * - Image preview modal
 */

import { useState, useEffect, useCallback, type FC } from 'react';
import { useAdmin, ProtectedRoute } from '@/contexts/AdminContext';
import {
  SERVICE_CATEGORIES,
  type ServiceCategory,
  type CloudinaryImage,
  fetchImagesByCategory,
  fetchAllImages,
  deleteImage,
  toggleFeatured,
  getThumbnailUrl,
  getGalleryUrl,
  formatCategoryName,
  getCategoryFromPublicId,
  isFeatured,
  getUploadWidgetConfig,
  CLOUDINARY_CONFIG,
} from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// =============================================================================
// DECLARE CLOUDINARY WIDGET
// =============================================================================

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

// =============================================================================
// LOGIN FORM COMPONENT
// =============================================================================

const LoginForm: FC = () => {
  const { login } = useAdmin();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(password);

    if (!result.success) {
      toast({
        title: 'Login Failed',
        description: result.error || 'Invalid password',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="/logo.png"
            alt="Shwaki Brothers"
            className="w-20 h-20 mx-auto mb-4"
          />
          <CardTitle className="text-2xl text-brand-navy">Admin Login</CardTitle>
          <p className="text-brand-navy/60 text-sm mt-2">
            Shwaki Brothers Glassworks
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// =============================================================================
// IMAGE CARD COMPONENT
// =============================================================================

interface ImageCardProps {
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

// =============================================================================
// ADMIN DASHBOARD COMPONENT
// =============================================================================

const AdminDashboard: FC = () => {
  const { logout, token } = useAdmin();
  const { toast } = useToast();

  // State
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<CloudinaryImage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUploadPicker, setShowUploadPicker] = useState(false);

  // Load images
  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response =
        selectedCategory === 'all'
          ? await fetchAllImages()
          : await fetchImagesByCategory(selectedCategory);
      setImages(response.resources || []);
    } catch (error) {
      console.error('Failed to load images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, toast]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Handle delete
  const handleDelete = async (publicId: string) => {
    if (!token) return;

    try {
      await deleteImage(publicId, token);
      setImages((prev) => prev.filter((img) => img.public_id !== publicId));
      toast({
        title: 'Deleted',
        description: 'Image deleted successfully.',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image.',
        variant: 'destructive',
      });
    }
    setDeleteConfirm(null);
  };

  // Handle toggle featured
  const handleToggleFeatured = async (publicId: string, featured: boolean) => {
    if (!token) return;

    try {
      await toggleFeatured(publicId, featured, token);
      setImages((prev) =>
        prev.map((img) =>
          img.public_id === publicId
            ? {
                ...img,
                tags: featured
                  ? [...(img.tags || []), 'featured']
                  : (img.tags || []).filter((t) => t !== 'featured'),
              }
            : img
        )
      );
      toast({
        title: featured ? 'Featured' : 'Unfeatured',
        description: `Image ${featured ? 'added to' : 'removed from'} featured.`,
      });
    } catch (error) {
      console.error('Toggle featured error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update image.',
        variant: 'destructive',
      });
    }
  };

  // Open the Cloudinary upload widget for a specific category
  const openUploadWidget = (category: ServiceCategory) => {
    setShowUploadPicker(false);
    const config = getUploadWidgetConfig(category);

    const widget = window.cloudinary?.createUploadWidget(config, (error, result) => {
      if (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload Error',
          description: 'Failed to upload image.',
          variant: 'destructive',
        });
        return;
      }

      if (result.event === 'success' && result.info) {
        setImages((prev) => [result.info as CloudinaryImage, ...prev]);
        toast({
          title: 'Uploaded',
          description: `Image uploaded to ${formatCategoryName(category)}.`,
        });
      }
    });

    widget?.open();
  };

  // Handle upload button click
  const handleUpload = () => {
    // If a specific category is already selected, upload directly to it
    if (selectedCategory !== 'all') {
      openUploadWidget(selectedCategory);
    } else {
      // Show category picker
      setShowUploadPicker(true);
    }
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

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <header className="bg-brand-navy text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Shwaki Brothers" className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-white/60">Shwaki Brothers Glassworks</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={
                selectedCategory === 'all'
                  ? 'bg-brand-gold text-brand-navy'
                  : ''
              }
              onClick={() => setSelectedCategory('all')}
            >
              All Images
            </Button>
            {SERVICE_CATEGORIES.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={
                  selectedCategory === category
                    ? 'bg-brand-gold text-brand-navy'
                    : ''
                }
                onClick={() => setSelectedCategory(category)}
              >
                {formatCategoryName(category)}
              </Button>
            ))}
          </div>

          {/* Upload Button */}
          <Button
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
            onClick={handleUpload}
          >
            📤 Upload to {selectedCategory === 'all' ? '...' : formatCategoryName(selectedCategory)}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-brand-navy">{images.length}</div>
              <div className="text-sm text-brand-navy/60">Total Images</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-brand-gold">
                {images.filter(isFeatured).length}
              </div>
              <div className="text-sm text-brand-navy/60">Featured</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-brand-navy">
                {SERVICE_CATEGORIES.length}
              </div>
              <div className="text-sm text-brand-navy/60">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-brand-navy">
                {CLOUDINARY_CONFIG.cloudName}
              </div>
              <div className="text-sm text-brand-navy/60">Cloud Name</div>
            </CardContent>
          </Card>
        </div>

        {/* Image Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
          </div>
        ) : images.length === 0 ? (
          <Card className="text-center py-20">
            <CardContent>
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">
                No Images Yet
              </h3>
              <p className="text-brand-navy/60 mb-6">
                Upload your first images to get started.
              </p>
              <Button
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
                onClick={handleUpload}
              >
                📤 Upload Images
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image) => (
              <ImageCard
                key={image.public_id}
                image={image}
                onDelete={(id) => setDeleteConfirm(id)}
                onToggleFeatured={handleToggleFeatured}
                onPreview={setPreviewImage}
              />
            ))}
          </div>
        )}
      </main>

      {/* Upload Category Picker */}
      <Dialog open={showUploadPicker} onOpenChange={setShowUploadPicker}>
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
                onClick={() => openUploadWidget(category)}
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
              onClick={() => openUploadWidget('hero')}
            >
              <span className="text-2xl">🎬</span>
              <span className="text-sm font-medium text-brand-navy">Hero / Homepage</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="space-y-4">
              <img
                src={getGalleryUrl(previewImage.public_id)}
                alt={previewImage.context?.custom?.alt || 'Preview'}
                className="w-full rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-brand-navy/60">Dimensions:</span>{' '}
                  {previewImage.width}×{previewImage.height}
                </div>
                <div>
                  <span className="text-brand-navy/60">Format:</span>{' '}
                  {previewImage.format.toUpperCase()}
                </div>
                <div>
                  <span className="text-brand-navy/60">Created:</span>{' '}
                  {new Date(previewImage.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-brand-navy/60">Tags:</span>{' '}
                  {previewImage.tags?.join(', ') || 'None'}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The image will be permanently deleted
              from Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// =============================================================================
// ADMIN PAGE COMPONENT
// =============================================================================

const Admin: FC = () => {
  return (
    <ProtectedRoute fallback={<LoginForm />}>
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default Admin;
