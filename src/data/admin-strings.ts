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
    hero: {
      he: 'ראשי',
      en: 'Hero',
      ar: 'رئيسي',
      ru: 'Главная',
    },
  },
  // Hero Gallery Manager
  heroManager: {
    title:             { he: 'תמונת ראשי',                                                                      en: 'Hero Image',                                       ar: 'صورة الصفحة الرئيسية',                             ru: 'Главное изображение' },
    imageSelected:     { he: '✓ תמונה נבחרה',                                                                   en: '✓ Image Selected',                                 ar: '✓ تم اختيار الصورة',                               ru: '✓ Изображение выбрано' },
    howToUseTitle:     { he: '📋 איך להשתמש:',                                                                  en: '📋 How to use:',                                   ar: '📋 كيفية الاستخدام:',                               ru: '📋 Как использовать:' },
    howToUseBody:      { he: 'לחץ על תמונה כדי לבחור אותה כתמונה הראשית שתופיע בדף הבית',                      en: 'Click an image to set it as the main homepage image', ar: 'انقر على صورة لتحديدها كالصورة الرئيسية للصفحة الرئيسية', ru: 'Нажмите на изображение, чтобы выбрать его главным на главной странице' },
    currentImage:      { he: '🖼️ תמונה נוכחית',                                                                 en: '🖼️ Current Image',                                 ar: '🖼️ الصورة الحالية',                                ru: '🖼️ Текущее изображение' },
    remove:            { he: 'הסר',                                                                              en: 'Remove',                                           ar: 'إزالة',                                            ru: 'Удалить' },
    noImageSelected:   { he: 'אין תמונה נבחרת',                                                                 en: 'No Image Selected',                                ar: 'لم يتم اختيار صورة',                               ru: 'Изображение не выбрано' },
    selectFromGallery: { he: 'בחר תמונה מהגלריה למטה',                                                          en: 'Select an image from the gallery below',            ar: 'اختر صورة من المعرض أدناه',                        ru: 'Выберите изображение из галереи ниже' },
    galleryTitle:      { he: '🖼️ בחר תמונה',                                                                    en: '🖼️ Select Image',                                  ar: '🖼️ اختر صورة',                                    ru: '🖼️ Выберите изображение' },
    imageCount:        { he: 'תמונות',                                                                           en: 'images',                                           ar: 'صور',                                              ru: 'изображений' },
    altText:           { he: 'תמונה',                                                                            en: 'Image',                                            ar: 'صورة',                                             ru: 'Изображение' },
    errorLoadTitle:    { he: 'שגיאה',                                                                            en: 'Error',                                            ar: 'خطأ',                                              ru: 'Ошибка' },
    errorLoadDesc:     { he: 'נכשל בטעינת תמונות',                                                              en: 'Failed to load images',                            ar: 'فشل في تحميل الصور',                               ru: 'Не удалось загрузить изображения' },
    successTitle:      { he: '✅ נשמר!',                                                                         en: '✅ Saved!',                                         ar: '✅ تم الحفظ!',                                      ru: '✅ Сохранено!' },
    successDesc:       { he: 'תמונת הראשי עודכנה בהצלחה',                                                       en: 'Hero image updated successfully',                  ar: 'تم تحديث صورة الصفحة الرئيسية بنجاح',              ru: 'Главное изображение успешно обновлено' },
    removedTitle:      { he: '🗑️ הוסר',                                                                          en: '🗑️ Removed',                                       ar: '🗑️ تمت الإزالة',                                   ru: '🗑️ Удалено' },
    removedDesc:       { he: 'תמונת הראשי הוסרה',                                                               en: 'Hero image removed',                               ar: 'تمت إزالة صورة الصفحة الرئيسية',                   ru: 'Главное изображение удалено' },
    errorUpdateTitle:  { he: 'שגיאה',                                                                            en: 'Error',                                            ar: 'خطأ',                                              ru: 'Ошибка' },
    errorUpdateDesc:   { he: 'נכשל בעדכון תמונה',                                                               en: 'Failed to update image',                           ar: 'فشل في تحديث الصورة',                              ru: 'Не удалось обновить изображение' },
  },

  // Service Card Manager
  serviceManager: {
    title:           { he: '🏷️ נהל תמונות כרטיסי שירות',                                                       en: '🏷️ Manage Service Card Images',                    ar: '🏷️ إدارة صور بطاقات الخدمة',                      ru: '🏷️ Управление изображениями карточек услуг' },
    instruction:     { he: 'בחר תמונה לכל שירות. תמונה זו תופיע בסעיף "השירותים שלנו" בדף הבית.',              en: 'Select an image for each service. This image will appear in the "Our Services" section.', ar: 'اختر صورة لكل خدمة. ستظهر هذه الصورة في قسم "خدماتنا".', ru: 'Выберите изображение для каждой услуги. Оно появится в разделе «Наши услуги».' },
    selectImageFor:  { he: 'בחר תמונה עבור:',                                                                   en: 'Select image for:',                                ar: 'اختر صورة لـ:',                                    ru: 'Выберите изображение для:' },
    back:            { he: '← חזרה',                                                                             en: '← Back',                                           ar: '← رجوع',                                           ru: '← Назад' },
    categoryHint:    { he: 'תמונות מקטגוריות תואמות מוצגות ראשונות.',                                           en: 'Images from matching categories are shown first.',  ar: 'يتم عرض الصور من الفئات المطابقة أولاً.',           ru: 'Сначала показываются изображения из совпадающих категорий.' },
    change:          { he: 'שנה',                                                                                en: 'Change',                                           ar: 'تغيير',                                            ru: 'Изменить' },
    clickToSelect:   { he: 'לחץ לבחירה',                                                                        en: 'Click to select',                                  ar: 'انقر للتحديد',                                     ru: 'Нажмите для выбора' },
    successTitle:    { he: 'נשמר',                                                                               en: 'Saved',                                            ar: 'تم الحفظ',                                         ru: 'Сохранено' },
    successDesc:     { he: 'תמונה נקבעה עבור',                                                                  en: 'Image set for',                                    ar: 'تم تعيين الصورة لـ',                               ru: 'Изображение установлено для' },
    removedTitle:    { he: 'הוסר',                                                                               en: 'Removed',                                          ar: 'تمت الإزالة',                                      ru: 'Удалено' },
    removedDesc:     { he: 'תמונה הוסרה מ',                                                                     en: 'Image removed from',                               ar: 'تمت إزالة الصورة من',                              ru: 'Изображение удалено из' },
    errorLoadTitle:  { he: 'שגיאה',                                                                              en: 'Error',                                            ar: 'خطأ',                                              ru: 'Ошибка' },
    errorLoadDesc:   { he: 'נכשל בטעינת תמונות',                                                                en: 'Failed to load images',                            ar: 'فشل في تحميل الصور',                               ru: 'Не удалось загрузить изображения' },
    errorTitle:      { he: 'שגיאה',                                                                              en: 'Error',                                            ar: 'خطأ',                                              ru: 'Ошибка' },
    errorUpdateDesc: { he: 'נכשל בעדכון תמונת שירות',                                                           en: 'Failed to update service image',                   ar: 'فشل في تحديث صورة الخدمة',                         ru: 'Не удалось обновить изображение услуги' },
    errorRemoveDesc: { he: 'נכשל בהסרת תמונה',                                                                  en: 'Failed to remove image',                           ar: 'فشل في إزالة الصورة',                              ru: 'Не удалось удалить изображение' },
  },

  // Tabs + Unanswered questions (what the website assistant couldn't answer)
  tabs: {
    images:     { he: 'תמונות', en: 'Images', ar: 'الصور', ru: 'Изображения' },
    unanswered: { he: 'שאלות ללא מענה', en: 'Unanswered questions', ar: 'أسئلة بدون إجابة', ru: 'Вопросы без ответа' },
  },
  unanswered: {
    intro: {
      he: 'שאלות שהעוזר באתר לא ידע לענות עליהן בביטחון (500 האחרונות), מקובצות לפי דמיון. מספרי טלפון ומיילים הוסרו, וגם שמות אחרי ״קוראים לי…״.',
      en: "Questions the website assistant couldn't answer with confidence (the last 500), grouped by similarity. Phone numbers, e-mails and names after “my name is…” are removed.",
      ar: 'أسئلة لم يستطع مساعد الموقع الإجابة عنها بثقة (آخر 500)، مجمّعة حسب التشابه. تمت إزالة أرقام الهواتف والبريد، والأسماء بعد «اسمي…».',
      ru: 'Вопросы, на которые ассистент сайта не смог уверенно ответить (последние 500), сгруппированы по сходству. Телефоны и e-mail удалены, а также имена после «меня зовут…».',
    },
    copy:      { he: 'העתקת הרשימה', en: 'Copy list', ar: 'نسخ القائمة', ru: 'Скопировать список' },
    copied:    { he: 'הועתק', en: 'Copied', ar: 'تم النسخ', ru: 'Скопировано' },
    refresh:   { he: 'רענון', en: 'Refresh', ar: 'تحديث', ru: 'Обновить' },
    empty:     { he: 'אין עדיין שאלות ללא מענה.', en: 'No unanswered questions yet.', ar: 'لا توجد أسئلة بدون إجابة بعد.', ru: 'Пока нет вопросов без ответа.' },
    loadError: { he: 'טעינת הרשימה נכשלה.', en: 'Failed to load the list.', ar: 'فشل تحميل القائمة.', ru: 'Не удалось загрузить список.' },
    times:     { he: 'פעמים', en: 'times', ar: 'مرات', ru: 'раз' },
    total:     { he: 'סה"כ שאלות', en: 'Total questions', ar: 'مجموع الأسئلة', ru: 'Всего вопросов' },
    answeredByAi: { he: 'נענתה ע"י AI חינמי', en: 'answered by free AI', ar: 'أجاب عنها الذكاء الاصطناعي المجاني', ru: 'ответил бесплатный ИИ' },
    outOfScope: { he: 'מחוץ לתחום', en: 'out of scope', ar: 'خارج النطاق', ru: 'не по теме' },
    didYouMean: { he: 'הוצעו שאלות דומות', en: 'offered "Did you mean"', ar: 'عُرض "هل تقصد"', ru: 'предложено «Вы имели в виду»' },
    priceGeneral: { he: 'קיבלו תשובת מחיר כללית', en: 'got the general price answer', ar: 'حصلوا على جواب السعر العام', ru: 'получили общий ответ о цене' },
    alsoAsked: { he: 'גם נשאל:', en: 'Also asked:', ar: 'سُئل أيضاً:', ru: 'Также спрашивали:' },
  },
} as const;

export type AdminLocale = 'he' | 'en' | 'ar' | 'ru';

export const getAdminText = (
  strings: Record<string, string>,
  locale: AdminLocale
): string => strings[locale] || strings.en;
