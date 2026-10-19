'use client';
/**
 * Cookie Consent Banner Component
 * GDPR/Israeli Privacy Law compliant cookie notice
 */

import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { notifyCookieConsent } from '@/components/chat/chat-events';

const LABELS = {
  he: {
    title: 'הגדרות עוגיות',
    description: 'אתר זה משתמש בעוגיות לשמירת העדפות השפה שלך ולניתוח אנונימי של התנועה באתר.',
    essential: 'עוגיות חיוניות',
    essentialDesc: 'נדרשות לפעולה תקינה של האתר (העדפת שפה, הגדרות נגישות)',
    analytics: 'עוגיות ניתוח',
    analyticsDesc: 'מסייעות לנו להבין כיצד מבקרים משתמשים באתר',
    acceptAll: 'אישור הכל',
    acceptEssential: 'חיוניות בלבד',
    settings: 'הגדרות',
    save: 'שמור הגדרות',
    privacyPolicy: 'מדיניות פרטיות',
  },
  en: {
    title: 'Cookie Settings',
    description: 'This website uses cookies to save your language preferences and for anonymous traffic analysis.',
    essential: 'Essential Cookies',
    essentialDesc: 'Required for website functionality (language preference, accessibility settings)',
    analytics: 'Analytics Cookies',
    analyticsDesc: 'Help us understand how visitors use the site',
    acceptAll: 'Accept All',
    acceptEssential: 'Essential Only',
    settings: 'Settings',
    save: 'Save Settings',
    privacyPolicy: 'Privacy Policy',
  },
  ar: {
    title: 'إعدادات ملفات تعريف الارتباط',
    description: 'يستخدم هذا الموقع ملفات تعريف الارتباط لحفظ تفضيلات اللغة الخاصة بك ولتحليل حركة المرور بشكل مجهول.',
    essential: 'ملفات تعريف الارتباط الأساسية',
    essentialDesc: 'مطلوبة لعمل الموقع (تفضيل اللغة، إعدادات إمكانية الوصول)',
    analytics: 'ملفات تعريف ارتباط التحليلات',
    analyticsDesc: 'تساعدنا على فهم كيفية استخدام الزوار للموقع',
    acceptAll: 'قبول الكل',
    acceptEssential: 'الأساسية فقط',
    settings: 'الإعدادات',
    save: 'حفظ الإعدادات',
    privacyPolicy: 'سياسة الخصوصية',
  },
  ru: {
    title: 'Настройки файлов cookie',
    description: 'Этот веб-сайт использует файлы cookie для сохранения ваших языковых настроек и анонимного анализа трафика.',
    essential: 'Необходимые файлы cookie',
    essentialDesc: 'Требуются для работы сайта (языковые настройки, настройки доступности)',
    analytics: 'Аналитические файлы cookie',
    analyticsDesc: 'Помогают нам понять, как посетители используют сайт',
    acceptAll: 'Принять все',
    acceptEssential: 'Только необходимые',
    settings: 'Настройки',
    save: 'Сохранить настройки',
    privacyPolicy: 'Политика конфиденциальности',
  },
};

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
}

// Production domain for Plausible Analytics
const PLAUSIBLE_DOMAIN = 'shwakiglassworks.com';

const CookieConsent: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const labels = LABELS[currentLanguage as keyof typeof LABELS] || LABELS.he;
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    analytics: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
        // Enable analytics if consented
        if (saved.analytics) {
          enableAnalytics();
        }
      } catch {
        // Invalid stored value, show banner
        setVisible(true);
      }
    }
  }, []);

  const enableAnalytics = () => {
    // Dynamically inject Plausible Analytics script only when user consents
    if (typeof window !== 'undefined' && !document.getElementById('plausible-script')) {
      const script = document.createElement('script');
      script.id = 'plausible-script';
      script.defer = true;
      script.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
      script.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(script);
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setPreferences(prefs);
    setVisible(false);
    notifyCookieConsent(); // lets the chat launcher appear once the banner is gone
    
    if (prefs.analytics) {
      enableAnalytics();
    }
  };

  const acceptAll = () => {
    savePreferences({ essential: true, analytics: true });
  };

  const acceptEssential = () => {
    savePreferences({ essential: true, analytics: false });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Main Banner */}
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6 text-brand-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-brand-navy text-lg mb-2">{labels.title}</h3>
              <p className="text-gray-700 text-sm mb-4">{labels.description}</p>
              
              {/* Settings Panel */}
              {showSettings && (
                <div className="mb-4 space-y-3 bg-gray-50 rounded-xl p-4">
                  {/* Essential Cookies */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="mt-1 w-4 h-4 rounded border-gray-300"
                    />
                    <div>
                      <p className="font-medium text-brand-navy text-sm">{labels.essential}</p>
                      <p className="text-gray-500 text-xs">{labels.essentialDesc}</p>
                    </div>
                  </div>
                  
                  {/* Analytics Cookies */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                    />
                    <div>
                      <p className="font-medium text-brand-navy text-sm">{labels.analytics}</p>
                      <p className="text-gray-500 text-xs">{labels.analyticsDesc}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {showSettings ? (
                  <button
                    onClick={() => savePreferences(preferences)}
                    className="px-4 py-2 bg-brand-navy text-white rounded-full text-sm font-medium hover:bg-brand-navy/90 transition-colors"
                  >
                    {labels.save}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={acceptAll}
                      className="px-4 py-2 bg-brand-navy text-white rounded-full text-sm font-medium hover:bg-brand-navy/90 transition-colors"
                    >
                      {labels.acceptAll}
                    </button>
                    <button
                      onClick={acceptEssential}
                      className="px-4 py-2 bg-gray-200 text-brand-navy rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      {labels.acceptEssential}
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-4 py-2 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-1"
                    >
                      <Settings className="w-4 h-4" />
                      {labels.settings}
                    </button>
                  </>
                )}
                <a
                  href={`/${currentLanguage}/privacy`}
                  className="px-4 py-2 text-brand-navy hover:text-brand-gold hover:underline text-sm font-medium"
                >
                  {labels.privacyPolicy}
                </a>
              </div>
            </div>
            
            {/* Close button */}
            <button
              onClick={acceptEssential}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
