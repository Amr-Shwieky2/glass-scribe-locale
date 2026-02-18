import { useState, type FC } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import type { CloudinaryImage } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminImages } from '@/hooks/useAdminImages';
import AdminHeader from './AdminHeader';
import AdminControls from './AdminControls';
import AdminStats from './AdminStats';
import ImageCard from './ImageCard';
import CategoryPicker from './CategoryPicker';
import ImagePreviewDialog from './ImagePreviewDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const AdminDashboard: FC = () => {
  const { logout } = useAdmin();
  const {
    images, isLoading, selectedCategory, setSelectedCategory,
    showUploadPicker, setShowUploadPicker,
    handleDelete, handleToggleFeatured, handleUpload, openUploadWidget,
  } = useAdminImages();

  const [previewImage, setPreviewImage] = useState<CloudinaryImage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const onConfirmDelete = async (id: string) => { await handleDelete(id); setDeleteConfirm(null); };

  return (
    <div className="min-h-screen bg-brand-light">
      <AdminHeader onLogout={logout} />
      <main className="container mx-auto px-4 py-8">
        <AdminControls selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} onUpload={handleUpload} />
        <AdminStats images={images} />
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold" /></div>
        ) : images.length === 0 ? (
          <Card className="text-center py-20"><CardContent>
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">No Images Yet</h3>
            <p className="text-brand-navy/60 mb-6">Upload your first images to get started.</p>
            <Button className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy" onClick={handleUpload}>📤 Upload Images</Button>
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image) => (
              <ImageCard key={image.public_id} image={image} onDelete={(id) => setDeleteConfirm(id)} onToggleFeatured={handleToggleFeatured} onPreview={setPreviewImage} />
            ))}
          </div>
        )}
      </main>
      <CategoryPicker open={showUploadPicker} onOpenChange={setShowUploadPicker} onSelect={openUploadWidget} />
      <ImagePreviewDialog image={previewImage} onClose={() => setPreviewImage(null)} />
      <DeleteConfirmDialog publicId={deleteConfirm} onConfirm={onConfirmDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
};

export default AdminDashboard;
