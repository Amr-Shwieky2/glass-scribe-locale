export const NAVIGATION = {
  items: [
    {
      href: '/',
      label: {
        en: 'Home',
        he: 'ראשי',
        ar: 'الرئيسية',
        ru: 'Главная',
      },
    },
    {
      href: '/services',
      label: {
        en: 'Services',
        he: 'שירותים',
        ar: 'الخدمات',
        ru: 'Услуги',
      },
    },
    {
      href: '/projects',
      label: {
        en: 'Projects',
        he: 'פרויקטים',
        ar: 'المشاريع',
        ru: 'Проекты',
      },
    },
    {
      href: '/about',
      label: {
        en: 'About',
        he: 'אודות',
        ar: 'حول',
        ru: 'О нас',
      },
    },
    {
      href: '/blog',
      label: {
        en: 'Blog',
        he: 'בלוג',
        ar: 'مدونة',
        ru: 'Блог',
      },
    },
    {
      href: '/contact',
      label: {
        en: 'Contact',
        he: 'צור קשר',
        ar: 'اتصل',
        ru: 'Контакты',
      },
    },
  ],
  cta: {
    label: {
      en: 'Get Quote',
      he: 'הצעת מחיר',
      ar: 'عرض أسعار',
      ru: 'Оценка',
    },
  },
} as const;
