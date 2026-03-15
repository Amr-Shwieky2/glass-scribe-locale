/**
 * Admin Dashboard Translations
 * Supports: Hebrew (he), English (en), Arabic (ar), Russian (ru)
 */

export const ADMIN_STRINGS = {
  // Login Form
  login: {
    title: {
      he: 'התחברות מנהל',
      en: 'Admin Login',
      ar: 'تسجيل دخول المسؤول',
      ru: 'Вход администратора',
    },
    subtitle: {
      he: 'אחים שוואקי זכוכית',
      en: 'Shwaki Brothers Glassworks',
      ar: 'إخوان شواكي للزجاج',
      ru: 'Братья Шваки - Стекольные работы',
    },
    password: {
      he: 'סיסמה',
      en: 'Password',
      ar: 'كلمة المرور',
      ru: 'Пароль',
    },
    passwordPlaceholder: {
      he: 'הזן סיסמת מנהל',
      en: 'Enter admin password',
      ar: 'أدخل كلمة مرور المسؤول',
      ru: 'Введите пароль администратора',
    },
    loginButton: {
      he: 'התחבר',
      en: 'Login',
      ar: 'تسجيل الدخول',
      ru: 'Войти',
    },
    loggingIn: {
      he: 'מתחבר...',
      en: 'Logging in...',
      ar: 'جاري التسجيل...',
      ru: 'Вход...',
    },
    failed: {
      he: 'ההתחברות נכשלה',
      en: 'Login Failed',
      ar: 'فشل تسجيل الدخول',
      ru: 'Ошибка входа',
    },
    invalidPassword: {
      he: 'סיסמה שגויה',
      en: 'Invalid password',
      ar: 'كلمة مرور غير صحيحة',
      ru: 'Неверный пароль',
    },
  },

  // Header
  header: {
    title: {
      he: 'לוח בקרה',
      en: 'Admin Panel',
      ar: 'لوحة التحكم',
      ru: 'Панель управления',
    },
    logout: {
      he: 'התנתק',
      en: 'Logout',
      ar: 'تسجيل الخروج',
      ru: 'Выйти',
    },
  },

  // Dashboard
  dashboard: {
    manageHeroGallery: {
      he: '🖼️ נהל תמונת ראשי',
      en: '🖼️ Manage Hero Image',
      ar: '🖼️ إدارة صورة الصفحة الرئيسية',
      ru: '🖼️ Управление главным изображением',
    },
    manageServiceCards: {
      he: '🏷️ נהל כרטיסי שירות',
      en: '🏷️ Manage Service Cards',
      ar: '🏷️ إدارة بطاقات الخدمة',
      ru: '🏷️ Управление карточками услуг',
    },
    noImagesYet: {
      he: 'אין תמונות עדיין',
      en: 'No Images Yet',
      ar: 'لا توجد صور بعد',
      ru: 'Пока нет изображений',
    },
    uploadFirst: {
      he: 'העלה את התמונות הראשונות שלך כדי להתחיל.',
      en: 'Upload your first images to get started.',
      ar: 'قم بتحميل صورك الأولى للبدء.',
      ru: 'Загрузите первые изображения, чтобы начать.',
    },
    uploadImages: {
      he: '📤 העלה תמונות',
      en: '📤 Upload Images',
      ar: '📤 تحميل الصور',
      ru: '📤 Загрузить изображения',
    },
  },

  // Controls
  controls: {
    allImages: {
      he: 'כל התמונות',
      en: 'All Images',
      ar: 'جميع الصور',
      ru: 'Все изображения',
    },
    uploadTo: {
      he: '📤 העלה ל',
      en: '📤 Upload to',
      ar: '📤 تحميل إلى',
      ru: '📤 Загрузить в',
    },
  },

  // Stats
  stats: {
    totalImages: {
      he: 'סה"כ תמונות',
      en: 'Total Images',
      ar: 'إجمالي الصور',
      ru: 'Всего изображений',
    },
    featured: {
      he: 'מומלצות',
      en: 'Featured',
      ar: 'مميزة',
      ru: 'Избранные',
    },
    categories: {
      he: 'קטגוריות',
      en: 'Categories',
      ar: 'الفئات',
      ru: 'Категории',
    },
    cloudName: {
      he: 'שם ענן',
      en: 'Cloud Name',
      ar: 'اسم السحابة',
      ru: 'Имя облака',
    },
  },

  // Image Card
  imageCard: {
    view: {
      he: '👁️ צפה',
      en: '👁️ View',
      ar: '👁️ عرض',
      ru: '👁️ Просмотр',
    },
    feature: {
      he: '☆ הוסף למומלצות',
      en: '☆ Feature',
      ar: '☆ تمييز',
      ru: '☆ Избранное',
    },
    unfeature: {
      he: '⭐ הסר ממומלצות',
      en: '⭐ Unfeat',
      ar: '⭐ إلغاء التمييز',
      ru: '⭐ Убрать',
    },
    setCard: {
      he: '🏷️ כרטיס',
      en: '🏷️ Card',
      ar: '🏷️ بطاقة',
      ru: '🏷️ Карточка',
    },
    unsetCard: {
      he: '🏷️ הסר כרטיס',
      en: '🏷️ Unset',
      ar: '🏷️ إلغاء',
      ru: '🏷️ Убрать',
    },
    setHero: {
      he: '🏠 ראשי',
      en: '🏠 Hero',
      ar: '🏠 رئيسي',
      ru: '🏠 Главная',
    },
    unsetHero: {
      he: '🏠 הסר מראשי',
      en: '🏠 Unhero',
      ar: '🏠 إلغاء',
      ru: '🏠 Убрать',
    },
    delete: {
      he: '🗑️ מחק',
      en: '🗑️ Delete',
      ar: '🗑️ حذف',
      ru: '🗑️ Удалить',
    },
    featuredBadge: {
      he: '⭐ מומלץ',
      en: '⭐ Featured',
      ar: '⭐ مميز',
      ru: '⭐ Избранное',
    },
    serviceCardBadge: {
      he: '🏷️ כרטיס שירות',
      en: '🏷️ Service Card',
      ar: '🏷️ بطاقة خدمة',
      ru: '🏷️ Карточка услуги',
    },
    heroBadge: {
      he: '🏠 ראשי',
      en: '🏠 Hero',
      ar: '🏠 رئيسي',
      ru: '🏠 Главная',
    },
  },

  // Delete Dialog
  deleteDialog: {
    title: {
      he: 'למחוק תמונה?',
      en: 'Delete Image?',
      ar: 'حذف الصورة؟',
      ru: 'Удалить изображение?',
    },
    description: {
      he: 'לא ניתן לבטל פעולה זו. התמונה תימחק לצמיתות מ-Cloudinary.',
      en: 'This action cannot be undone. The image will be permanently deleted from Cloudinary.',
      ar: 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف الصورة نهائياً من Cloudinary.',
      ru: 'Это действие нельзя отменить. Изображение будет удалено из Cloudinary навсегда.',
    },
    cancel: {
      he: 'ביטול',
      en: 'Cancel',
      ar: 'إلغاء',
      ru: 'Отмена',
    },
    confirm: {
      he: 'מחק',
      en: 'Delete',
      ar: 'حذف',
      ru: 'Удалить',
    },
  },

  // Category Picker
  categoryPicker: {
    title: {
      he: 'בחר קטגוריה',
      en: 'Choose a Category',
      ar: 'اختر فئة',
      ru: 'Выберите категорию',
    },
    description: {
      he: 'בחר לאיזו קטגוריה להעלות תמונות. זה קובע היכן התמונות יופיעו באתר.',
      en: 'Select which category to upload images to. This determines where the images appear on the website.',
      ar: 'حدد الفئة لتحميل الصور إليها. هذا يحدد مكان ظهور الصور على الموقع.',
      ru: 'Выберите категорию для загрузки изображений. Это определяет, где изображения появятся на сайте.',
    },
    heroHomepage: {
      he: 'ראשי / דף הבית',
      en: 'Hero / Homepage',
      ar: 'رئيسي / الصفحة الرئيسية',
      ru: 'Главная / Домашняя страница',
    },
  },

  // Category Names
  categories: {
    'shower-enclosures': {
      he: 'מקלחונים',
      en: 'Shower Enclosures',
      ar: 'كابينة استحمام',
      ru: 'Душевые кабины',
    },
    'glass-railings': {
      he: 'מעקות זכוכית',
      en: 'Glass Railings',
      ar: 'درابزين زجاجي',
      ru: 'Стеклянные ограждения',
    },
    mirrors: {
      he: 'מראות',
      en: 'Mirrors',
      ar: 'مرايا',
      ru: 'Зеркала',
    },
    partitions: {
      he: 'מחיצות',
      en: 'Partitions',
      ar: 'فواصل',
      ru: 'Перегородки',
    },
    storefronts: {
      he: 'חזיתות חנויות',
      en: 'Storefronts',
      ar: 'واجهات المحلات',
      ru: 'Витрины',
    },
    'glass-doors': {
      he: 'דלתות זכוכית',
      en: 'Glass Doors',
      ar: 'أبواب زجاجية',
      ru: 'Стеклянные двери',
    },
    backsplashes: {
      he: 'חיפוי קירות',
      en: 'Backsplashes',
      ar: 'خلفيات زجاجية',
      ru: 'Фартуки',
    },
    shelves: {
      he: 'מדפים',
      en: 'Shelves',
      ar: 'رفوف',
      ru: 'Полки',
    },
    lobbies: {
      he: 'לובי',
      en: 'Lobbies',
      ar: 'بهو',
      ru: 'Лобби',
    },
    hero: {
      he: 'ראשי',
      en: 'Hero',
      ar: 'رئيسي',
      ru: 'Главная',
    },
  },
} as const;

export type AdminLocale = 'he' | 'en' | 'ar' | 'ru';

export const getAdminText = (
  strings: Record<string, string>,
  locale: AdminLocale
): string => strings[locale] || strings.en;
