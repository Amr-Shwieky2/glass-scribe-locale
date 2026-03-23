export interface ProjectCategory {
  id: string;
  cloudinaryFolder: string;
  name: { en: string; he: string; ar: string; ru: string };
  slug: string;
  icon: string;
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  { id: 'shower-glass', cloudinaryFolder: 'shower-enclosures', name: { en: 'Shower Glass', he: 'מקלחונים', ar: 'زجاج الدش', ru: 'Душевое стекло' }, slug: 'shower-glass', icon: '🚿' },
  { id: 'glass-railings', cloudinaryFolder: 'glass-railings', name: { en: 'Glass Railings', he: 'מעקות זכוכית', ar: 'درابزين زجاجي', ru: 'Стеклянные ограждения' }, slug: 'glass-railings', icon: '🏠' },
  { id: 'mirrors', cloudinaryFolder: 'mirrors', name: { en: 'Mirrors', he: 'מראות', ar: 'مرايا', ru: 'Зеркала' }, slug: 'mirrors', icon: '🪞' },
  { id: 'glass-partitions', cloudinaryFolder: 'partitions', name: { en: 'Glass Partitions', he: 'מחיצות זכוכית', ar: 'فواصل زجاجية', ru: 'Стеклянные перегородки' }, slug: 'glass-partitions', icon: '🏢' },
  { id: 'storefront', cloudinaryFolder: 'storefronts', name: { en: 'Storefront Glass', he: 'חזיתות חנויות', ar: 'واجهات المتاجر', ru: 'Витринное стекло' }, slug: 'storefront', icon: '🏪' },
  { id: 'glass-doors', cloudinaryFolder: 'glass-doors', name: { en: 'Glass Doors', he: 'דלתות זכוכית', ar: 'أبواب زجاجية', ru: 'Стеклянные двери' }, slug: 'glass-doors', icon: '🚪' },
  { id: 'backsplashes', cloudinaryFolder: 'backsplashes', name: { en: 'Backsplashes', he: 'חיפויי קיר', ar: 'واجهات خلفية', ru: 'Стеклянные фартуки' }, slug: 'backsplashes', icon: '✨' },
  { id: 'shelves', cloudinaryFolder: 'shelves', name: { en: 'Glass Shelves', he: 'מדפי זכוכית', ar: 'أرفف زجاجية', ru: 'Стеклянные полки' }, slug: 'shelves', icon: '📐' },
];
