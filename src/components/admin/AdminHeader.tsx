import { type FC } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: FC<AdminHeaderProps> = ({ onLogout }) => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Shwaki Brothers" className="w-10 h-10" />
          <div>
            <h1 className="text-lg font-bold">{t(ADMIN_STRINGS.header.title)}</h1>
            <p className="text-xs text-white/60">{t(ADMIN_STRINGS.login.subtitle)}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-white/30 text-white hover:bg-white/10"
          onClick={onLogout}
        >
          {t(ADMIN_STRINGS.header.logout)}
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
