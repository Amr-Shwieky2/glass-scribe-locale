'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Accessibility, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Contrast, 
  Eye,
  Link2,
  Type,
  Pause,
  RotateCcw,
  Keyboard,
  MousePointer
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Accessibility labels in all supported languages
const LABELS = {
  he: {
    title: 'נגישות',
    close: 'סגור',
    reset: 'איפוס',
    fontSize: 'גודל גופן',
    increase: 'הגדל',
    decrease: 'הקטן',
    highContrast: 'ניגודיות גבוהה',
    grayscale: 'גווני אפור',
    highlightLinks: 'הדגש קישורים',
    readableFont: 'גופן קריא',
    stopAnimations: 'עצור אנימציות',
    bigCursor: 'סמן גדול',
    keyboardNav: 'ניווט מקלדת',
    accessibilityStatement: 'הצהרת נגישות',
  },
  en: {
    title: 'Accessibility',
    close: 'Close',
    reset: 'Reset',
    fontSize: 'Font Size',
    increase: 'Increase',
    decrease: 'Decrease',
    highContrast: 'High Contrast',
    grayscale: 'Grayscale',
    highlightLinks: 'Highlight Links',
    readableFont: 'Readable Font',
    stopAnimations: 'Stop Animations',
    bigCursor: 'Big Cursor',
    keyboardNav: 'Keyboard Navigation',
    accessibilityStatement: 'Accessibility Statement',
  },
  ar: {
    title: 'إمكانية الوصول',
    close: 'إغلاق',
    reset: 'إعادة تعيين',
    fontSize: 'حجم الخط',
    increase: 'تكبير',
    decrease: 'تصغير',
    highContrast: 'تباين عالي',
    grayscale: 'تدرج الرمادي',
    highlightLinks: 'تمييز الروابط',
    readableFont: 'خط قابل للقراءة',
    stopAnimations: 'إيقاف الرسوم المتحركة',
    bigCursor: 'مؤشر كبير',
    keyboardNav: 'التنقل بلوحة المفاتيح',
    accessibilityStatement: 'بيان إمكانية الوصول',
  },
  ru: {
    title: 'Доступность',
    close: 'Закрыть',
    reset: 'Сброс',
    fontSize: 'Размер шрифта',
    increase: 'Увеличить',
    decrease: 'Уменьшить',
    highContrast: 'Высокая контрастность',
    grayscale: 'Оттенки серого',
    highlightLinks: 'Выделить ссылки',
    readableFont: 'Читаемый шрифт',
    stopAnimations: 'Остановить анимацию',
    bigCursor: 'Большой курсор',
    keyboardNav: 'Навигация с клавиатуры',
    accessibilityStatement: 'Заявление о доступности',
  },
};

interface AccessibilityState {
  fontSize: number;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  stopAnimations: boolean;
  bigCursor: boolean;
}

const DEFAULT_STATE: AccessibilityState = {
  fontSize: 100,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  readableFont: false,
  stopAnimations: false,
  bigCursor: false,
};

const AccessibilityWidget: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const labels = LABELS[currentLanguage as keyof typeof LABELS] || LABELS.he;
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<AccessibilityState>(DEFAULT_STATE);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        try {
          setState(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  // Apply accessibility settings
  const applySettings = useCallback((settings: AccessibilityState) => {
    const root = document.documentElement;
    const body = document.body;

    // Font size
    // Only override the stylesheet when the user changed the size (avoids a layout shift on load)
    root.style.fontSize = settings.fontSize === 100 ? '' : `${settings.fontSize}%`;

    // High contrast
    if (settings.highContrast) {
      body.classList.add('accessibility-high-contrast');
    } else {
      body.classList.remove('accessibility-high-contrast');
    }

    // Grayscale
    if (settings.grayscale) {
      body.classList.add('accessibility-grayscale');
    } else {
      body.classList.remove('accessibility-grayscale');
    }

    // Highlight links
    if (settings.highlightLinks) {
      body.classList.add('accessibility-highlight-links');
    } else {
      body.classList.remove('accessibility-highlight-links');
    }

    // Readable font
    if (settings.readableFont) {
      body.classList.add('accessibility-readable-font');
    } else {
      body.classList.remove('accessibility-readable-font');
    }

    // Stop animations
    if (settings.stopAnimations) {
      body.classList.add('accessibility-stop-animations');
    } else {
      body.classList.remove('accessibility-stop-animations');
    }

    // Big cursor
    if (settings.bigCursor) {
      body.classList.add('accessibility-big-cursor');
    } else {
      body.classList.remove('accessibility-big-cursor');
    }

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, []);

  // Apply settings on mount and when state changes
  useEffect(() => {
    applySettings(state);
  }, [state, applySettings]);

  const updateState = (key: keyof AccessibilityState, value: boolean | number) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setState(DEFAULT_STATE);
  };

  const increaseFontSize = () => {
    if (state.fontSize < 150) {
      updateState('fontSize', state.fontSize + 10);
    }
  };

  const decreaseFontSize = () => {
    if (state.fontSize > 80) {
      updateState('fontSize', state.fontSize - 10);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Accessibility Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 w-14 h-14 bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-brand-gold/50"
        aria-label={labels.title}
        title={labels.title}
      >
        <Accessibility className="w-7 h-7" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Panel */}
          <div 
            className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-4 sm:right-auto z-50 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto w-full sm:w-80"
            role="dialog"
            aria-modal="true"
            aria-label={labels.title}
          >
            {/* Header */}
            <div className="sticky top-0 bg-brand-navy text-white px-4 py-3 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                <h2 className="font-bold text-lg">{labels.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetAll}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={labels.reset}
                  title={labels.reset}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={labels.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="p-4 space-y-3">
              {/* Font Size */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-brand-navy flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    {labels.fontSize}
                  </span>
                  <span className="text-sm text-gray-600">{state.fontSize}%</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={decreaseFontSize}
                    disabled={state.fontSize <= 80}
                    className="flex-1 py-2 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm font-medium"
                    aria-label={labels.decrease}
                  >
                    <ZoomOut className="w-4 h-4" />
                    A-
                  </button>
                  <button
                    onClick={increaseFontSize}
                    disabled={state.fontSize >= 150}
                    className="flex-1 py-2 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm font-medium"
                    aria-label={labels.increase}
                  >
                    <ZoomIn className="w-4 h-4" />
                    A+
                  </button>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="grid grid-cols-2 gap-2">
                {/* High Contrast */}
                <button
                  onClick={() => updateState('highContrast', !state.highContrast)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-medium ${
                    state.highContrast 
                      ? 'bg-brand-navy text-white border-brand-navy' 
                      : 'bg-white text-brand-navy border-gray-200 hover:border-brand-navy'
                  }`}
                  aria-pressed={state.highContrast}
                >
                  <Contrast className="w-5 h-5" />
                  {labels.highContrast}
                </button>

                {/* Grayscale */}
                <button
                  onClick={() => updateState('grayscale', !state.grayscale)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-medium ${
                    state.grayscale 
                      ? 'bg-brand-navy text-white border-brand-navy' 
                      : 'bg-white text-brand-navy border-gray-200 hover:border-brand-navy'
                  }`}
                  aria-pressed={state.grayscale}
                >
                  <Eye className="w-5 h-5" />
                  {labels.grayscale}
                </button>

                {/* Highlight Links */}
                <button
                  onClick={() => updateState('highlightLinks', !state.highlightLinks)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-medium ${
                    state.highlightLinks 
                      ? 'bg-brand-navy text-white border-brand-navy' 
                      : 'bg-white text-brand-navy border-gray-200 hover:border-brand-navy'
                  }`}
                  aria-pressed={state.highlightLinks}
                >
                  <Link2 className="w-5 h-5" />
                  {labels.highlightLinks}
                </button>

                {/* Readable Font */}
                <button
                  onClick={() => updateState('readableFont', !state.readableFont)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-medium ${
                    state.readableFont 
                      ? 'bg-brand-navy text-white border-brand-navy' 
                      : 'bg-white text-brand-navy border-gray-200 hover:border-brand-navy'
                  }`}
                  aria-pressed={state.readableFont}
                >
                  <Type className="w-5 h-5" />
                  {labels.readableFont}
                </button>

                {/* Stop Animations */}
                <button
                  onClick={() => updateState('stopAnimations', !state.stopAnimations)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-medium ${
                    state.stopAnimations 
                      ? 'bg-brand-navy text-white border-brand-navy' 
                      : 'bg-white text-brand-navy border-gray-200 hover:border-brand-navy'
                  }`}
                  aria-pressed={state.stopAnimations}
                >
                  <Pause className="w-5 h-5" />
                  {labels.stopAnimations}
                </button>

                {/* Big Cursor */}
                <button
                  onClick={() => updateState('bigCursor', !state.bigCursor)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-medium ${
                    state.bigCursor 
                      ? 'bg-brand-navy text-white border-brand-navy' 
                      : 'bg-white text-brand-navy border-gray-200 hover:border-brand-navy'
                  }`}
                  aria-pressed={state.bigCursor}
                >
                  <MousePointer className="w-5 h-5" />
                  {labels.bigCursor}
                </button>
              </div>

              {/* Keyboard Navigation Info */}
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Keyboard className="w-4 h-4" />
                  <span className="font-medium">{labels.keyboardNav}</span>
                </div>
                <p className="text-xs opacity-80">
                  Tab = Navigate | Enter = Select | Esc = Close
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AccessibilityWidget;
