/**
 * AnimatedPageHeader - Reusable Animated Page Header
 * 
 * A premium animated header section for all pages with:
 * - Floating ambient orbs
 * - Light streaks
 * - Floating particles
 * - Shimmer effects
 * - Continuous motion to attract attention
 */

import React from 'react';
import { motion } from 'framer-motion';

// =============================================================================
// AMBIENT BACKGROUND ANIMATION
// =============================================================================

const AmbientBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary golden orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,77,0.15) 0%, rgba(201,162,77,0.05) 40%, transparent 70%)',
          top: '-10%',
          left: '10%',
        }}
        animate={{
          x: [0, 80, 40, 0],
          y: [0, 50, 80, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Secondary orb - right side */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,77,0.12) 0%, rgba(201,162,77,0.04) 40%, transparent 70%)',
          top: '20%',
          right: '-5%',
        }}
        animate={{
          x: [0, -60, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Small accent orb */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)',
          bottom: '10%',
          left: '40%',
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Light streak 1 - fast */}
      <motion.div
        className="absolute h-[2px] w-[300px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,162,77,0.5), rgba(201,162,77,0.7), rgba(201,162,77,0.5), transparent)',
          top: '30%',
          left: '-300px',
        }}
        animate={{
          x: [0, 'calc(100vw + 600px)'],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 4,
        }}
      />

      {/* Light streak 2 - slower, different height */}
      <motion.div
        className="absolute h-[1px] w-[250px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(255,255,255,0.6), rgba(255,255,255,0.4), transparent)',
          top: '60%',
          left: '-250px',
        }}
        animate={{
          x: [0, 'calc(100vw + 500px)'],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 3,
          delay: 1.5,
        }}
      />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-brand-gold/50"
          style={{
            top: `${25 + i * 15}%`,
            left: `${15 + i * 18}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2.5 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.6,
          }}
        />
      ))}

      {/* Pulsing center glow */}
      <motion.div
        className="absolute w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(201,162,77,0.1) 0%, transparent 50%)',
        }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface AnimatedPageHeaderProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const AnimatedPageHeader: React.FC<AnimatedPageHeaderProps> = ({ 
  children, 
  className = '',
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'py-10 sm:py-12 md:py-16',
    medium: 'py-12 sm:py-16 md:py-20 lg:py-24',
    large: 'py-16 sm:py-20 md:py-24 lg:py-32',
  };

  return (
    <section className={`relative ${sizeClasses[size]} bg-brand-navy text-white overflow-hidden ${className}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#0a1f35] to-brand-navy" />
      
      {/* Static radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,77,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,77,0.08),transparent_50%)]" />
      
      {/* Animated background layer */}
      <AmbientBackground />
      
      {/* Content */}
      <motion.div 
        className="container mx-auto px-4 sm:px-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-brand-navy/50 to-transparent" />
    </section>
  );
};

export default AnimatedPageHeader;
