import { type FC } from 'react';
import {
  type CloudinaryImage,
  SERVICE_CATEGORIES,
  isFeatured,
  CLOUDINARY_CONFIG,
} from '@/lib/cloudinary';
import { Card, CardContent } from '@/components/ui/card';

interface AdminStatsProps {
  images: CloudinaryImage[];
}

const AdminStats: FC<AdminStatsProps> = ({ images }) => (
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
);

export default AdminStats;
