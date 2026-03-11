import { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';
import { Globe, ChevronDown } from 'lucide-react';

// Language display names
const LANG_NAMES: Record<string, string> = {
  he: 'עברית',
  en: 'English',
  ar: 'العربية',
  ru: 'Русский',
};

const LANG_SHORT: Record<string, string> = {
  he: 'עב',
  en: 'EN',
  ar: 'عر',
  ru: 'РУ',
};

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: FC<AdminHeaderProps> = ({ onLogout }) => {
  const { currentLanguage, switchLanguage, supportedLanguages } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);
  const [isLangOpen, setIsLangOpen] = useState(false);

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
        
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{LANG_SHORT[currentLanguage] || 'EN'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLangOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsLangOpen(false)} 
                />
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[140px] z-50">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        switchLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between ${
                        currentLanguage === lang.code ? 'bg-brand-gold/10 text-brand-navy font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{LANG_NAMES[lang.code] || lang.name}</span>
                      {currentLanguage === lang.code && (
                        <span className="text-brand-gold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-red-400 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500"
            onClick={onLogout}
          >
            {t(ADMIN_STRINGS.header.logout)}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
