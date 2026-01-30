/**
 * Projects Page - Static Version
 * 
 * Displays projects gallery with filtering.
 * All data is static - no backend required.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Grid, List, X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import {
  CONTACT_INFO,
  PAGE_CONTENT,
  UI_STRINGS,
  getLocalizedText,
  type SupportedLocale,
} from '@/data/business';

// =============================================================================
// STATIC PROJECT DATA
// =============================================================================

interface ProjectImage {
  id: number;
  url: string;
  alt?: string;
}

interface ProjectCategory {
  id: string;
  name: { en: string; he: string; ar: string };
  slug: string;
  icon: string;
}

interface Project {
  id: number;
  title: { en: string; he: string; ar: string };
  description: { en: string; he: string; ar: string };
  location: { en: string; he: string; ar: string };
  categoryId: string;
  images: ProjectImage[];
  completedDate: string;
  isFeatured?: boolean;
}

// Categories matching services
const PROJECT_CATEGORIES: ProjectCategory[] = [
  { id: 'shower-glass', name: { en: 'Shower Glass', he: 'מקלחונים', ar: 'زجاج الدش' }, slug: 'shower-glass', icon: '🚿' },
  { id: 'glass-railings', name: { en: 'Glass Railings', he: 'מעקות זכוכית', ar: 'درابزين زجاجي' }, slug: 'glass-railings', icon: '🏠' },
  { id: 'mirrors', name: { en: 'Mirrors', he: 'מראות', ar: 'مرايا' }, slug: 'mirrors', icon: '🪞' },
  { id: 'glass-partitions', name: { en: 'Glass Partitions', he: 'מחיצות זכוכית', ar: 'فواصل زجاجية' }, slug: 'glass-partitions', icon: '🏢' },
  { id: 'storefront', name: { en: 'Storefront Glass', he: 'חזיתות חנויות', ar: 'واجهات المتاجر' }, slug: 'storefront', icon: '🏪' },
  { id: 'custom', name: { en: 'Custom Glass Works', he: 'עבודות זכוכית מותאמות', ar: 'أعمال زجاج مخصصة' }, slug: 'custom', icon: '✨' },
];

// =============================================================================
// SAMPLE PROJECTS DATA
// Replace the image URLs with your actual project images
// =============================================================================

const PROJECTS: Project[] = [
  // ========== SHOWER GLASS PROJECTS ==========
  {
    id: 1,
    title: { 
      en: 'Modern Frameless Shower', 
      he: 'מקלחון ללא מסגרת מודרני', 
      ar: 'دش بدون إطار حديث' 
    },
    description: { 
      en: 'Elegant frameless shower enclosure with premium hardware and crystal-clear tempered glass', 
      he: 'מקלחון אלגנטי ללא מסגרת עם אביזרים פרימיום וזכוכית מחוסמת שקופה', 
      ar: 'حاوية دش أنيقة بدون إطار مع أجهزة متميزة وزجاج مقسى صافي' 
    },
    location: { en: 'Tel Aviv', he: 'תל אביב', ar: 'تل أبيب' },
    categoryId: 'shower-glass',
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', alt: 'Frameless shower' },
      { id: 2, url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', alt: 'Shower detail' },
    ],
    completedDate: '2025-01',
    isFeatured: true,
  },
  {
    id: 2,
    title: { 
      en: 'Corner Shower Enclosure', 
      he: 'מקלחון פינתי', 
      ar: 'حاوية دش زاوية' 
    },
    description: { 
      en: 'Space-saving corner design with sliding glass doors', 
      he: 'עיצוב פינתי חוסך מקום עם דלתות הזזה', 
      ar: 'تصميم زاوية موفر للمساحة مع أبواب منزلقة' 
    },
    location: { en: 'Jerusalem', he: 'ירושלים', ar: 'القدس' },
    categoryId: 'shower-glass',
    images: [
      { id: 3, url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', alt: 'Corner shower' },
    ],
    completedDate: '2024-12',
  },
  {
    id: 3,
    title: { 
      en: 'Luxury Walk-in Shower', 
      he: 'מקלחון כניסה יוקרתי', 
      ar: 'دش فاخر للمشي' 
    },
    description: { 
      en: 'Spacious walk-in design with rain showerhead and glass panels', 
      he: 'עיצוב כניסה מרווח עם ראש מקלחת גשם ופאנלי זכוכית', 
      ar: 'تصميم واسع للمشي مع رأس دش مطري وألواح زجاجية' 
    },
    location: { en: 'Haifa', he: 'חיפה', ar: 'حيفا' },
    categoryId: 'shower-glass',
    images: [
      { id: 4, url: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800', alt: 'Walk-in shower' },
    ],
    completedDate: '2024-11',
  },

  // ========== GLASS RAILINGS PROJECTS ==========
  {
    id: 4,
    title: { 
      en: 'Balcony Glass Railing', 
      he: 'מעקה זכוכית למרפסת', 
      ar: 'درابزين زجاجي للشرفة' 
    },
    description: { 
      en: 'Tempered glass railing with stainless steel posts for stunning sea views', 
      he: 'מעקה זכוכית מחוסמת עם עמודי נירוסטה לנוף ים מדהים', 
      ar: 'درابزين زجاجي مقسى مع أعمدة فولاذية مقاومة للصدأ لإطلالات بحرية مذهلة' 
    },
    location: { en: 'Herzliya', he: 'הרצליה', ar: 'هرتسليا' },
    categoryId: 'glass-railings',
    images: [
      { id: 5, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', alt: 'Balcony railing' },
      { id: 6, url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', alt: 'Railing detail' },
    ],
    completedDate: '2025-01',
    isFeatured: true,
  },
  {
    id: 5,
    title: { 
      en: 'Staircase Glass Railing', 
      he: 'מעקה זכוכית למדרגות', 
      ar: 'درابزين زجاجي للدرج' 
    },
    description: { 
      en: 'Elegant glass railing for interior floating staircase', 
      he: 'מעקה זכוכית אלגנטי למדרגות צפות פנימיות', 
      ar: 'درابزين زجاجي أنيق للدرج العائم الداخلي' 
    },
    location: { en: 'Ramat Gan', he: 'רמת גן', ar: 'رمات غان' },
    categoryId: 'glass-railings',
    images: [
      { id: 7, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', alt: 'Staircase railing' },
    ],
    completedDate: '2024-10',
  },
  {
    id: 6,
    title: { 
      en: 'Pool Area Glass Fence', 
      he: 'גדר זכוכית לאזור הבריכה', 
      ar: 'سياج زجاجي لمنطقة المسبح' 
    },
    description: { 
      en: 'Safety tempered glass fence around luxury swimming pool', 
      he: 'גדר זכוכית מחוסמת בטיחותית סביב בריכת שחייה יוקרתית', 
      ar: 'سياج زجاجي مقسى آمن حول حمام سباحة فاخر' 
    },
    location: { en: 'Caesarea', he: 'קיסריה', ar: 'قيسارية' },
    categoryId: 'glass-railings',
    images: [
      { id: 8, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', alt: 'Pool fence' },
    ],
    completedDate: '2024-09',
  },

  // ========== MIRRORS PROJECTS ==========
  {
    id: 7,
    title: { 
      en: 'Gym Wall Mirror', 
      he: 'מראה קיר לחדר כושר', 
      ar: 'مرآة حائط للصالة الرياضية' 
    },
    description: { 
      en: 'Full wall mirror installation for professional fitness studio', 
      he: 'התקנת מראה קיר מלאה לסטודיו כושר מקצועי', 
      ar: 'تركيب مرآة حائط كاملة لاستوديو اللياقة البدنية المحترف' 
    },
    location: { en: 'Tel Aviv', he: 'תל אביב', ar: 'تل أبيب' },
    categoryId: 'mirrors',
    images: [
      { id: 9, url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', alt: 'Gym mirror' },
    ],
    completedDate: '2024-12',
    isFeatured: true,
  },
  {
    id: 8,
    title: { 
      en: 'Bathroom Vanity Mirror', 
      he: 'מראת יהירות לחדר אמבטיה', 
      ar: 'مرآة حمام فاخرة' 
    },
    description: { 
      en: 'LED backlit mirror with anti-fog coating for luxury bathroom', 
      he: 'מראה מוארת LED עם ציפוי נגד אדים לחדר אמבטיה יוקרתי', 
      ar: 'مرآة بإضاءة خلفية LED مع طلاء مضاد للضباب للحمام الفاخر' 
    },
    location: { en: 'Netanya', he: 'נתניה', ar: 'نتانيا' },
    categoryId: 'mirrors',
    images: [
      { id: 10, url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', alt: 'Bathroom mirror' },
    ],
    completedDate: '2024-11',
  },
  {
    id: 9,
    title: { 
      en: 'Dance Studio Mirrors', 
      he: 'מראות לסטודיו ריקוד', 
      ar: 'مرايا استوديو الرقص' 
    },
    description: { 
      en: 'Professional grade mirrors for dance and yoga studio', 
      he: 'מראות ברמה מקצועית לסטודיו ריקוד ויוגה', 
      ar: 'مرايا بجودة احترافية لاستوديو الرقص واليوغا' 
    },
    location: { en: 'Rishon LeZion', he: 'ראשון לציון', ar: 'ريشون لتسيون' },
    categoryId: 'mirrors',
    images: [
      { id: 11, url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', alt: 'Dance studio' },
    ],
    completedDate: '2024-10',
  },

  // ========== GLASS PARTITIONS PROJECTS ==========
  {
    id: 10,
    title: { 
      en: 'Modern Office Partition', 
      he: 'מחיצת משרד מודרנית', 
      ar: 'فاصل مكتب حديث' 
    },
    description: { 
      en: 'Sleek glass walls creating open yet private office spaces', 
      he: 'קירות זכוכית אלגנטיים היוצרים חללי משרד פתוחים אך פרטיים', 
      ar: 'جدران زجاجية أنيقة تخلق مساحات مكتبية مفتوحة لكن خاصة' 
    },
    location: { en: 'Tel Aviv', he: 'תל אביב', ar: 'تل أبيب' },
    categoryId: 'glass-partitions',
    images: [
      { id: 12, url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', alt: 'Office partition' },
      { id: 13, url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', alt: 'Partition detail' },
    ],
    completedDate: '2025-01',
    isFeatured: true,
  },
  {
    id: 11,
    title: { 
      en: 'Restaurant Divider', 
      he: 'מחיצה למסעדה', 
      ar: 'فاصل مطعم' 
    },
    description: { 
      en: 'Decorative glass partition for restaurant seating areas', 
      he: 'מחיצת זכוכית דקורטיבית לאזורי ישיבה במסעדה', 
      ar: 'فاصل زجاجي ديكوري لمناطق جلوس المطعم' 
    },
    location: { en: 'Jaffa', he: 'יפו', ar: 'يافا' },
    categoryId: 'glass-partitions',
    images: [
      { id: 14, url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', alt: 'Restaurant divider' },
    ],
    completedDate: '2024-11',
  },

  // ========== STOREFRONT PROJECTS ==========
  {
    id: 12,
    title: { 
      en: 'Boutique Storefront', 
      he: 'חזית בוטיק', 
      ar: 'واجهة متجر' 
    },
    description: { 
      en: 'Full glass storefront with automatic sliding doors', 
      he: 'חזית זכוכית מלאה עם דלתות הזזה אוטומטיות', 
      ar: 'واجهة زجاجية كاملة مع أبواب انزلاقية أوتوماتيكية' 
    },
    location: { en: 'Dizengoff, Tel Aviv', he: 'דיזנגוף, תל אביב', ar: 'ديزنغوف، تل أبيب' },
    categoryId: 'storefront',
    images: [
      { id: 15, url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', alt: 'Boutique storefront' },
    ],
    completedDate: '2024-12',
    isFeatured: true,
  },
  {
    id: 13,
    title: { 
      en: 'Cafe Front Window', 
      he: 'חלון חזית בית קפה', 
      ar: 'نافذة واجهة المقهى' 
    },
    description: { 
      en: 'Large display window with minimal framing for street view', 
      he: 'חלון תצוגה גדול עם מסגרת מינימלית לנוף הרחוב', 
      ar: 'نافذة عرض كبيرة مع إطار بسيط لإطلالة على الشارع' 
    },
    location: { en: 'Rothschild, Tel Aviv', he: 'רוטשילד, תל אביב', ar: 'روتشيلد، تل أبيب' },
    categoryId: 'storefront',
    images: [
      { id: 16, url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', alt: 'Cafe window' },
    ],
    completedDate: '2024-10',
  },

  // ========== CUSTOM PROJECTS ==========
  {
    id: 14,
    title: { 
      en: 'Glass Table Top', 
      he: 'משטח שולחן זכוכית', 
      ar: 'سطح طاولة زجاجي' 
    },
    description: { 
      en: 'Custom cut tempered glass table top with polished edges', 
      he: 'משטח שולחן זכוכית מחוסמת בחיתוך מותאם עם שוליים מלוטשים', 
      ar: 'سطح طاولة زجاجي مقسى مقطوع حسب الطلب مع حواف مصقولة' 
    },
    location: { en: 'Raanana', he: 'רעננה', ar: 'رعنانا' },
    categoryId: 'custom',
    images: [
      { id: 17, url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', alt: 'Glass table' },
    ],
    completedDate: '2024-11',
  },
  {
    id: 15,
    title: { 
      en: 'Decorative Glass Panel', 
      he: 'פאנל זכוכית דקורטיבי', 
      ar: 'لوحة زجاجية ديكورية' 
    },
    description: { 
      en: 'Etched glass panel with custom artistic design', 
      he: 'פאנל זכוכית חרוט עם עיצוב אמנותי מותאם', 
      ar: 'لوحة زجاجية محفورة بتصميم فني مخصص' 
    },
    location: { en: 'Jerusalem', he: 'ירושלים', ar: 'القدس' },
    categoryId: 'custom',
    images: [
      { id: 18, url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', alt: 'Decorative panel' },
    ],
    completedDate: '2024-09',
  },
  {
    id: 16,
    title: { 
      en: 'Kitchen Backsplash', 
      he: 'חיפוי גב למטבח', 
      ar: 'واجهة خلفية للمطبخ' 
    },
    description: { 
      en: 'Colored glass backsplash for modern designer kitchen', 
      he: 'חיפוי גב זכוכית צבעונית למטבח מעצבים מודרני', 
      ar: 'واجهة خلفية زجاجية ملونة للمطبخ الحديث المصمم' 
    },
    location: { en: 'Petah Tikva', he: 'פתח תקווה', ar: 'بيتح تكفا' },
    categoryId: 'custom',
    images: [
      { id: 19, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', alt: 'Kitchen backsplash' },
    ],
    completedDate: '2024-08',
    isFeatured: true,
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

const Projects: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.projects;
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial category from URL
  const initialCategory = searchParams.get('category') || undefined;
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Update URL when category changes
  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // Sync with URL on mount/change
  useEffect(() => {
    const urlCategory = searchParams.get('category') || undefined;
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return PROJECTS;
    return PROJECTS.filter(p => p.categoryId === selectedCategory);
  }, [selectedCategory]);

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = PROJECT_CATEGORIES.find(c => c.id === categoryId);
    return category ? getLocalizedText(category.name, locale) : '';
  };

  const handleWhatsApp = () => {
    const phone = CONTACT_INFO.whatsapp;
    const message = encodeURIComponent('Hello, I would like to inquire about a project');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <AnimatedPageHeader>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">
            {getLocalizedText(content.title, locale)}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
            {getLocalizedText(content.subtitle, locale)}
          </p>
          {/* Project Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-6">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-gold">{PROJECTS.length}+</p>
              <p className="text-sm text-gray-400">{locale === 'he' ? 'פרויקטים' : locale === 'ar' ? 'مشاريع' : 'Projects'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-gold">{PROJECT_CATEGORIES.length}</p>
              <p className="text-sm text-gray-400">{locale === 'he' ? 'קטגוריות' : locale === 'ar' ? 'فئات' : 'Categories'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-gold">100%</p>
              <p className="text-sm text-gray-400">{locale === 'he' ? 'שביעות רצון' : locale === 'ar' ? 'رضا' : 'Satisfaction'}</p>
            </div>
          </div>
        </div>
      </AnimatedPageHeader>

      {/* Filters & Controls */}
      <section className="py-4 sm:py-6 md:py-8 bg-white border-b sticky top-16 sm:top-20 z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(undefined)}
                className="rounded-full text-xs sm:text-sm px-3 sm:px-4 flex-shrink-0"
                size="sm"
              >
                {getLocalizedText(content.allCategories, locale)} ({PROJECTS.length})
              </Button>
              {PROJECT_CATEGORIES.map((category) => {
                const count = PROJECTS.filter(p => p.categoryId === category.id).length;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => handleCategoryChange(category.id)}
                    className="rounded-full text-xs sm:text-sm px-3 sm:px-4 flex-shrink-0"
                    size="sm"
                  >
                    <span className="mr-1">{category.icon}</span>
                    {getLocalizedText(category.name, locale)} ({count})
                  </Button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-2 border rounded-full p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-full px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-full px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 sm:py-10 md:py-12 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          {filteredProjects.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                : 'space-y-4 sm:space-y-6'
            }>
              {filteredProjects.map((project) => {
                const imageUrl = project.images?.[0]?.url;
                const hasMultipleImages = project.images && project.images.length > 1;

                if (viewMode === 'list') {
                  return (
                    <div
                      key={project.id}
                      className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row cursor-pointer hover:shadow-xl transition-shadow"
                      onClick={() => {
                        setSelectedProject(project);
                        setSelectedImageIndex(0);
                      }}
                    >
                      {imageUrl && (
                        <div className="md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={getLocalizedText(project.title, locale)}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
                            }}
                          />
                          {project.isFeatured && (
                            <span className="absolute top-2 left-2 px-2 py-1 bg-brand-gold text-brand-navy text-xs font-bold rounded-full">
                              ⭐ {locale === 'he' ? 'מומלץ' : locale === 'ar' ? 'مميز' : 'Featured'}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex-1 p-4 sm:p-6">
                        <span className="inline-block px-2 sm:px-3 py-1 bg-brand-gold/20 text-brand-navy rounded-full text-xs font-medium mb-2 sm:mb-3">
                          {getCategoryName(project.categoryId)}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">
                          {getLocalizedText(project.title, locale)}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
                          {getLocalizedText(project.description, locale)}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {getLocalizedText(project.location, locale)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {project.completedDate}
                          </span>
                        </div>
                        {hasMultipleImages && (
                          <p className="text-xs sm:text-sm text-brand-gold mt-2 sm:mt-3">
                            📷 {project.images.length} {locale === 'he' ? 'תמונות' : locale === 'ar' ? 'صور' : 'images'}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                // Grid View
                return (
                  <div
                    key={project.id}
                    className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg aspect-[4/3] cursor-pointer"
                    onClick={() => {
                      setSelectedProject(project);
                      setSelectedImageIndex(0);
                    }}
                  >
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={getLocalizedText(project.title, locale)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        
                        {/* Featured Badge */}
                        {project.isFeatured && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-brand-gold text-brand-navy text-xs font-bold rounded-full">
                            ⭐ {locale === 'he' ? 'מומלץ' : locale === 'ar' ? 'مميز' : 'Featured'}
                          </span>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                          <span className="inline-block px-2 sm:px-3 py-1 bg-brand-gold/80 text-brand-navy rounded-full text-xs font-medium mb-2">
                            {getCategoryName(project.categoryId)}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold mb-1">
                            {getLocalizedText(project.title, locale)}
                          </h3>
                          <p className="text-xs sm:text-sm opacity-80 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {getLocalizedText(project.location, locale)}
                          </p>
                          {hasMultipleImages && (
                            <p className="text-xs sm:text-sm text-brand-gold mt-2">
                              📷 {project.images.length} {locale === 'he' ? 'תמונות' : locale === 'ar' ? 'صور' : 'images'}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm sm:text-base">
                          {getLocalizedText(project.title, locale)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6">🏗️</div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-navy mb-3 sm:mb-4">
                {getLocalizedText(content.noProjects, locale)}
              </h3>
              <p className="text-brand-navy/70 text-sm sm:text-base mb-6 sm:mb-8">
                {locale === 'he' ? 'צרו קשר כדי לדבר על הפרויקט שלכם' :
                 locale === 'ar' ? 'اتصل بنا للتحدث عن مشروعك' :
                 'Contact us to discuss your project'}
              </p>
              <button onClick={handleWhatsApp} className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                {getLocalizedText(UI_STRINGS.whatsapp, locale)}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Image Gallery Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          {/* Header */}
          <div className="p-3 sm:p-4 flex justify-between items-center text-white safe-top">
            <div className="flex-1 mr-4">
              <h3 className="text-base sm:text-lg md:text-xl font-bold truncate">
                {getLocalizedText(selectedProject.title, locale)}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {getLocalizedText(selectedProject.location, locale)}
              </p>
            </div>
            <button 
              onClick={() => {
                setSelectedProject(null);
                setSelectedImageIndex(0);
              }}
              className="p-2 hover:bg-white/10 rounded-full flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center px-2 sm:px-4 relative">
            <img
              src={selectedProject.images[selectedImageIndex]?.url}
              alt={getLocalizedText(selectedProject.title, locale)}
              className="max-h-[60vh] sm:max-h-[70vh] max-w-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
              }}
            />
            
            {/* Navigation Arrows */}
            {selectedProject.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(i => i === 0 ? selectedProject.images.length - 1 : i - 1)}
                  className="absolute left-2 sm:left-4 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(i => i === selectedProject.images.length - 1 ? 0 : i + 1)}
                  className="absolute right-2 sm:right-4 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Project Description */}
          <div className="px-4 py-2 text-center">
            <p className="text-gray-300 text-sm max-w-2xl mx-auto">
              {getLocalizedText(selectedProject.description, locale)}
            </p>
          </div>
          
          {/* Thumbnails */}
          {selectedProject.images.length > 1 && (
            <div className="p-2 sm:p-4 flex gap-1.5 sm:gap-2 justify-center overflow-x-auto scrollbar-hide safe-bottom">
              {selectedProject.images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    index === selectedImageIndex ? 'border-brand-gold' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Counter */}
          <p className="text-white/60 text-center text-sm sm:text-base pb-2 sm:pb-4">
            {selectedImageIndex + 1} / {selectedProject.images.length}
          </p>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {locale === 'he' ? 'יש לכם פרויקט בראש?' :
             locale === 'ar' ? 'هل لديك مشروع في ذهنك؟' :
             'Have a Project in Mind?'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/80">
            {locale === 'he' ? 'נשמח לשמוע על הפרויקט שלכם ולספק הצעת מחיר ללא התחייבות' :
             locale === 'ar' ? 'نحب أن نسمع عن مشروعك ونقدم عرض أسعار بدون التزام' :
             'We\'d love to hear about your project and provide a no-obligation quote'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={handleWhatsApp}
              className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </button>
            <a 
              href={`tel:${CONTACT_INFO.phone.mobile}`}
              className="btn-animated-gold inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {CONTACT_INFO.phone.mobile}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
