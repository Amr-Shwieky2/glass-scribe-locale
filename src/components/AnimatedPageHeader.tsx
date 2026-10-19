/**
 * AnimatedPageHeader - Reusable Animated Page Header (Server Component)
 * The content slides in with a CSS transform only, so the page <h1> is visible
 * in the server HTML from the first paint (good for LCP and crawlers).
 */

import React from 'react';
import AmbientBackground from './animated/AmbientBackground';

interface AnimatedPageHeaderProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'py-10 sm:py-12 md:py-16',
  medium: 'py-12 sm:py-16 md:py-20 lg:py-24',
  large: 'py-16 sm:py-20 md:py-24 lg:py-32',
};

const AnimatedPageHeader: React.FC<AnimatedPageHeaderProps> = ({ children, className = '', size = 'medium' }) => (
  <section className={`relative ${sizeClasses[size]} bg-brand-navy text-white overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#0a1f35] to-brand-navy" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,77,0.1),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,77,0.08),transparent_50%)]" />
    <AmbientBackground />
    <div
      className="container mx-auto px-4 sm:px-6 relative z-10 animate-rise"
      style={{ '--rise-from': '20px' } as React.CSSProperties}
    >
      {children}
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-brand-navy/50 to-transparent" />
  </section>
);

export default AnimatedPageHeader;
