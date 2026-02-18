import { type FC } from 'react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: FC<AdminHeaderProps> = ({ onLogout }) => (
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
        onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  </header>
);

export default AdminHeader;
