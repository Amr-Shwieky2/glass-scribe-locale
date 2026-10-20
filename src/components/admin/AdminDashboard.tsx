'use client';
import { useState, type FC } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CloudinaryImage } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminImages } from '@/hooks/useAdminImages';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';
import AdminHeader from './AdminHeader';
import AdminControls from './AdminControls';
import AdminStats from './AdminStats';
import ImageCard from './ImageCard';
import CategoryPicker from './CategoryPicker';
import ImagePreviewDialog from './ImagePreviewDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import HeroGalleryManager from './HeroGalleryManager';
import ServiceCardManager from './ServiceCardManager';
import UnansweredQuestions from './UnansweredQuestions';

const AdminDashboard: FC = () => {
  const { logout } = useAdmin();
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);
  
  const {
    images, isLoading, selectedCategory, setSelectedCategory,
    showUploadPicker, setShowUploadPicker,
    handleDelete, handleToggleFeatured, handleToggleServiceCard, handleToggleHeroImage, handleUpload, openUploadWidget,
  } = useAdminImages();

  const [previewImage, setPreviewImage] = useState<CloudinaryImage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showHeroManager, setShowHeroManager] = useState(false);
  const [showServiceCardManager, setShowServiceCardManager] = useState(false);
  const [tab, setTab] = useState<'images' | 'unanswered'>('images');

  const onConfirmDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await handleDelete(id);
      setDeleteConfirm(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <AdminHeader onLogout={logout} />
      <main className="container mx-auto px-4 py-8">
        <div role="tablist" aria-label="Admin" className="mb-6 inline-flex rounded-xl bg-white p-1 shadow-sm border border-gray-200">
          {(['images', 'unanswered'] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`admin-tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`admin-panel-${id}`}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === id ? 'bg-brand-navy text-white' : 'text-brand-navy hover:bg-brand-light'}`}
            >
              {t(ADMIN_STRINGS.tabs[id])}
            </button>
          ))}
        </div>

        {tab === 'unanswered' ? (
          <div role="tabpanel" id="admin-panel-unanswered" aria-labelledby="admin-tab-unanswered">
            <UnansweredQuestions locale={locale} />
          </div>
        ) : (
        <div role="tabpanel" id="admin-panel-images" aria-labelledby="admin-tab-images">
        {/* Home Page Image Managers */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={() => setShowHeroManager(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {t(ADMIN_STRINGS.dashboard.manageHeroGallery)}
          </Button>
          <Button
            onClick={() => setShowServiceCardManager(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {t(ADMIN_STRINGS.dashboard.manageServiceCards)}
          </Button>
        </div>

        <AdminControls selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} onUpload={handleUpload} />
        <AdminStats images={images} />
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold" /></div>
        ) : images.length === 0 ? (
          <Card className="text-center py-20"><CardContent>
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">{t(ADMIN_STRINGS.dashboard.noImagesYet)}</h3>
            <p className="text-brand-navy/60 mb-6">{t(ADMIN_STRINGS.dashboard.uploadFirst)}</p>
            <Button className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy" onClick={handleUpload}>{t(ADMIN_STRINGS.dashboard.uploadImages)}</Button>
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image) => (
              <ImageCard key={image.public_id} image={image} onDelete={(id) => setDeleteConfirm(id)} onToggleFeatured={handleToggleFeatured} onToggleServiceCard={handleToggleServiceCard} onToggleHeroImage={handleToggleHeroImage} onPreview={setPreviewImage} />
            ))}
          </div>
        )}
        </div>
        )}
      </main>
      <CategoryPicker open={showUploadPicker} onOpenChange={setShowUploadPicker} onSelect={openUploadWidget} />
      <ImagePreviewDialog image={previewImage} onClose={() => setPreviewImage(null)} />
      <DeleteConfirmDialog publicId={deleteConfirm} onConfirm={onConfirmDelete} onCancel={() => setDeleteConfirm(null)} isLoading={isDeleting} />
      <HeroGalleryManager open={showHeroManager} onOpenChange={setShowHeroManager} />
      <ServiceCardManager open={showServiceCardManager} onOpenChange={setShowServiceCardManager} />
    </div>
  );
};

export default AdminDashboard;
