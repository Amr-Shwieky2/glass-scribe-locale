/**
 * Breadcrumbs Component
 * Provides visual breadcrumb navigation for better UX and SEO
 * Supports RTL languages
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SupportedLocale } from '@/data';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const isRTL = locale === 'he' || locale === 'ar';
  
  const Separator = isRTL ? ChevronLeft : ChevronRight;
  
  const homeLabel: Record<SupportedLocale, string> = {
    he: 'בית',
    en: 'Home',
    ar: 'الرئيسية',
    ru: 'Главная',
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`py-4 ${className}`}
    >
      <ol 
        className="flex items-center flex-wrap gap-1 text-sm"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Home link */}
        <li 
          className="flex items-center"
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
        >
          <Link
            to={`/${locale}`}
            className="flex items-center gap-1 text-gray-500 hover:text-brand-gold transition-colors"
            itemProp="item"
          >
            <Home className="w-4 h-4" />
            <span itemProp="name">{homeLabel[locale]}</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li 
            key={index}
            className="flex items-center"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <Separator className="w-4 h-4 mx-1 text-gray-400" />
            {item.href ? (
              <Link
                to={item.href}
                className="text-gray-500 hover:text-brand-gold transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span 
                className="text-brand-navy font-medium"
                itemProp="name"
              >
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
