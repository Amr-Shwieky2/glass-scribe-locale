/**
 * HeroGallery - Premium Cinematic Hero Section
 * 
 * A gallery-style animated hero that tells a visual story of craftsmanship.
 * Inspired by high-end architecture studios and premium fabrication brands.
 * 
 * Structure:
 * - Background layer with ambient gradient animation
 * - Continuous motif animation (floating light reflections)
 * - 7 visual frames revealing in sequence
 * - 6 text blocks paired with frames
 * 
 * Motion Philosophy: Unhurried, deliberate, cinematic
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data/business';
import { useHeroImages, getHeroUrl } from '@/hooks/useCloudinaryImages';

// =============================================================================
// CONFIGURATION
// =============================================================================

// Fallback gallery frames (used when no Cloudinary hero images exist)
const FALLBACK_FRAMES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    alt: 'Premium glass installation'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    alt: 'Modern shower enclosure'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    alt: 'Glass railing with view'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    alt: 'Light through glass'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    alt: 'Modern storefront'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    alt: 'Office glass partition'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    alt: 'Finished installation'
  },
];

// Text blocks - the narrative
const TEXT_BLOCKS = {
  en: [
    { main: 'Crafted', accent: 'with precision' },
    { main: 'Every space', accent: 'transformed' },
    { main: 'Light,', accent: 'elevated' },
    { main: 'Clarity', accent: 'in every detail' },
    { main: 'Where vision', accent: 'meets craft' },
    { main: 'Premium', accent: 'glass solutions' },
  ],
  he: [
    { main: 'מעוצב', accent: 'בדיוק' },
    { main: 'כל מרחב', accent: 'משתנה' },
    { main: 'אור,', accent: 'מורם' },
    { main: 'בהירות', accent: 'בכל פרט' },
    { main: 'איפה חזון', accent: 'פוגש אומנות' },
    { main: 'פתרונות', accent: 'זכוכית פרימיום' },
  ],
  ar: [
    { main: 'مصنوع', accent: 'بدقة' },
    { main: 'كل مساحة', accent: 'تتحول' },
    { main: 'ضوء،', accent: 'مرتفع' },
    { main: 'وضوح', accent: 'في كل تفصيل' },
    { main: 'حيث الرؤية', accent: 'تلتقي بالحرفة' },
    { main: 'حلول', accent: 'زجاجية متميزة' },
  ],
  ru: [
    { main: 'Создано', accent: 'с точностью' },
    { main: 'Каждое пространство', accent: 'преображено' },
    { main: 'Свет,', accent: 'возвышенный' },
    { main: 'Ясность', accent: 'в каждой детали' },
    { main: 'Где видение', accent: 'встречает мастерство' },
    { main: 'Премиум', accent: 'стеклянные решения' },
  ],
};

// Animation timing
const TIMING = {
  initialDelay: 0.3,
  frameDuration: 1.0,
  textDuration: 0.8,
  staggerDelay: 0.6,
  motifDuration: 20,
};

// Custom easing - "luxury" feel (cubic bezier)
const luxuryEase = [0.25, 0.1, 0.25, 1] as const;

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const frameVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: TIMING.frameDuration,
      ease: luxuryEase as unknown as [number, number, number, number],
    },
  },
};

const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: TIMING.textDuration,
      ease: luxuryEase as unknown as [number, number, number, number],
    },
  },
};

const ctaVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: luxuryEase as unknown as [number, number, number, number],
    },
  },
};

// =============================================================================
// MOTIF COMPONENT - Ambient floating light reflections (ENHANCED)
// =============================================================================

const AmbientMotif: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary orb - larger and more visible */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,77,0.15) 0%, rgba(201,162,77,0.05) 40%, transparent 70%)',
          top: '5%',
          left: '15%',
        }}
        animate={{
          x: [0, 150, 80, 0],
          y: [0, 80, 150, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Secondary orb - enhanced */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,77,0.12) 0%, rgba(201,162,77,0.04) 40%, transparent 70%)',
          bottom: '10%',
          right: '5%',
        }}
        animate={{
          x: [0, -120, -60, 0],
          y: [0, -100, 60, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Tertiary orb - center focus */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)',
          top: '40%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        animate={{
          x: ['-50%', 'calc(-50% + 80px)', 'calc(-50% - 60px)', '-50%'],
          y: [0, -60, 80, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      {/* Fast-moving light streak 1 */}
      <motion.div
        className="absolute h-[2px] w-[400px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,162,77,0.4), rgba(201,162,77,0.6), rgba(201,162,77,0.4), transparent)',
          top: '25%',
          left: '-400px',
        }}
        animate={{
          x: [0, 'calc(100vw + 800px)'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 3,
        }}
      />

      {/* Fast-moving light streak 2 */}
      <motion.div
        className="absolute h-[1px] w-[300px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), rgba(255,255,255,0.5), rgba(255,255,255,0.3), transparent)',
          top: '65%',
          left: '-300px',
        }}
        animate={{
          x: [0, 'calc(100vw + 600px)'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 4,
          delay: 2,
        }}
      />

      {/* Diagonal light streak */}
      <motion.div
        className="absolute h-[1px] w-[500px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,162,77,0.3), transparent)',
          top: '45%',
          left: '-500px',
          transform: 'rotate(-15deg)',
        }}
        animate={{
          x: [0, 'calc(100vw + 1000px)'],
          y: [0, 200],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 5,
          delay: 1,
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-brand-gold/40"
          style={{
            top: `${20 + i * 12}%`,
            left: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Pulsing glow effect behind content */}
      <motion.div
        className="absolute w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,162,77,0.08) 0%, transparent 50%)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
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
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

// =============================================================================
// FLOATING FRAME WRAPPER - Adds continuous subtle motion to frames
// =============================================================================

interface FloatingWrapperProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const FloatingWrapper: React.FC<FloatingWrapperProps> = ({ children, index, className = '' }) => {
  // Different motion patterns for each frame
  const patterns = [
    { y: [0, -8, 0], x: [0, 4, 0], rotate: [0, 0.5, 0] },
    { y: [0, 6, 0], x: [0, -5, 0], rotate: [0, -0.5, 0] },
    { y: [0, -6, 0], x: [0, -4, 0], rotate: [0, 0.3, 0] },
    { y: [0, 8, 0], x: [0, 6, 0], rotate: [0, -0.3, 0] },
    { y: [0, -5, 0], x: [0, 3, 0], rotate: [0, 0.4, 0] },
    { y: [0, 7, 0], x: [0, -3, 0], rotate: [0, -0.4, 0] },
    { y: [0, -7, 0], x: [0, 5, 0], rotate: [0, 0.2, 0] },
  ];
  
  const pattern = patterns[index % patterns.length];
  
  return (
    <motion.div
      className={className}
      animate={pattern}
      transition={{
        duration: 4 + index * 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.3,
      }}
    >
      {children}
    </motion.div>
  );
};

// =============================================================================
// GALLERY FRAME COMPONENT
// =============================================================================

interface GalleryFrameProps {
  frame: { id: number; image: string; alt: string };
  index: number;
  isVisible: boolean;
  delay: number;
}

const GalleryFrame: React.FC<GalleryFrameProps> = ({ frame, index, isVisible, delay }) => {
  // Calculate position based on index for asymmetric layout
  const positions = [
    // Frame 1 - Top left, medium
    { className: 'lg:col-span-2 lg:row-span-2', size: 'large' },
    // Frame 2 - Top right, small
    { className: 'lg:col-start-3', size: 'small' },
    // Frame 3 - Right side, tall
    { className: 'lg:col-start-4 lg:row-span-2', size: 'tall' },
    // Frame 4 - Center, small
    { className: 'lg:col-start-3', size: 'small' },
    // Frame 5 - Bottom left, small
    { className: '', size: 'small' },
    // Frame 6 - Bottom center, medium
    { className: 'lg:col-span-2', size: 'medium' },
    // Frame 7 - Bottom right, featured
    { className: 'lg:col-start-4', size: 'featured' },
  ];

  const position = positions[index] || positions[0];

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg ${position.className}`}
      variants={frameVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ delay }}
      style={{
        aspectRatio: position.size === 'tall' ? '3/4' : position.size === 'large' ? '4/3' : '16/9',
      }}
    >
      <img
        src={frame.image}
        alt={frame.alt}
        className="w-full h-full object-cover"
        loading={index < 3 ? 'eager' : 'lazy'}
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
      
      {/* Frame number indicator */}
      <div className="absolute bottom-3 left-3 text-white/40 text-xs font-mono">
        {String(index + 1).padStart(2, '0')}
      </div>
    </motion.div>
  );
};

// =============================================================================
// TEXT BLOCK COMPONENT
// =============================================================================

interface TextBlockProps {
  text: { main: string; accent: string };
  index: number;
  isVisible: boolean;
  delay: number;
}

const TextBlock: React.FC<TextBlockProps> = ({ text, index, isVisible, delay }) => {
  return (
    <motion.div
      className="hero-text-block"
      variants={textVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      <span className="text-white/90 font-light">{text.main}</span>
      <span className="text-brand-gold font-medium ml-2">{text.accent}</span>
    </motion.div>
  );
};

// =============================================================================
// MAIN HERO GALLERY COMPONENT
// =============================================================================

const HeroGallery: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [visibleElements, setVisibleElements] = useState<number>(0);
  
  const texts = TEXT_BLOCKS[locale] || TEXT_BLOCKS.en;

  // Fetch hero images from Cloudinary (admin-uploaded)
  const { images: heroImages } = useHeroImages();

  // Build GALLERY_FRAMES: Cloudinary images first, then fill with fallbacks to always have 7
  const GALLERY_FRAMES = useMemo(() => {
    const cloudFrames = heroImages.map((img, i) => ({
      id: i + 1,
      image: getHeroUrl(img.public_id),
      alt: img.context?.custom?.alt || `Glass work ${i + 1}`,
    }));

    // Merge: use Cloudinary images first, pad with fallbacks
    const merged = [...cloudFrames];
    for (let i = merged.length; i < 7; i++) {
      merged.push(FALLBACK_FRAMES[i]);
    }
    return merged.slice(0, 7);
  }, [heroImages]);

  // Timeline-based reveal sequence
  useEffect(() => {
    if (!isInView) return;

    const totalElements = 13; // 7 frames + 6 texts
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setVisibleElements(current);
      
      if (current >= totalElements) {
        clearInterval(interval);
      }
    }, TIMING.staggerDelay * 1000);

    return () => clearInterval(interval);
  }, [isInView]);

  // Calculate which elements should be visible
  // Sequence: F1 -> T1 -> F2 -> T2 -> ... -> F7 (no T7)
  const getFrameVisibility = (frameIndex: number) => {
    const position = frameIndex * 2; // F1=0, F2=2, F3=4, etc.
    return visibleElements > position;
  };

  const getTextVisibility = (textIndex: number) => {
    const position = textIndex * 2 + 1; // T1=1, T2=3, T3=5, etc.
    return visibleElements > position;
  };

  const getFrameDelay = (frameIndex: number) => {
    return TIMING.initialDelay;
  };

  const getTextDelay = (textIndex: number) => {
    return TIMING.initialDelay + 0.1;
  };

  // CTA handlers
  const handleWhatsApp = () => {
    const phone = CONTACT_INFO.whatsapp;
    const message = encodeURIComponent('Hello, I would like to inquire about your services');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${CONTACT_INFO.phoneIntl}`;
  };

  const ctaVisible = visibleElements >= 10;

  return (
    <section 
      ref={containerRef}
      className="hero-gallery relative min-h-screen overflow-hidden bg-brand-navy"
    >
      {/* Background Layer */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#0a1f35] to-brand-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,77,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,77,0.05),transparent_50%)]" />
      </div>

      {/* Motif Animation Layer */}
      <AmbientMotif />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 min-h-screen flex flex-col">
        
        {/* Desktop Layout - Asymmetric Gallery Grid with Continuous Motion */}
        <div className="hidden lg:grid flex-1 grid-cols-4 grid-rows-3 gap-4 max-h-[70vh]">
          {/* Frame 1 - Large, top left */}
          <FloatingWrapper index={0} className="col-span-2 row-span-2">
            <motion.div 
              className="relative overflow-hidden rounded-2xl h-full"
              variants={frameVariants}
              initial="hidden"
              animate={getFrameVisibility(0) ? 'visible' : 'hidden'}
              transition={{ delay: getFrameDelay(0) }}
            >
              {/* Shimmer effect on image */}
              <motion.div
                className="absolute inset-0 z-10"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              />
              <img
                src={GALLERY_FRAMES[0].image}
                alt={GALLERY_FRAMES[0].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white/30 text-xs font-mono tracking-wider">01</div>
              
              {/* Text 1 - Overlaid on Frame 1 */}
              <motion.div
                className="absolute bottom-8 left-6 right-6"
                variants={textVariants}
                initial="hidden"
                animate={getTextVisibility(0) ? 'visible' : 'hidden'}
                transition={{ delay: getTextDelay(0) }}
              >
                <motion.h2 
                  className="text-4xl xl:text-5xl font-light text-white"
                  animate={{ opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {texts[0].main}
                  <motion.span 
                    className="block text-brand-gold font-medium"
                    animate={{ opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  >
                    {texts[0].accent}
                  </motion.span>
                </motion.h2>
              </motion.div>
            </motion.div>
          </FloatingWrapper>

          {/* Frame 2 - Small, top */}
          <FloatingWrapper index={1} className="">
            <motion.div 
              className="relative overflow-hidden rounded-2xl h-full"
              variants={frameVariants}
              initial="hidden"
              animate={getFrameVisibility(1) ? 'visible' : 'hidden'}
              transition={{ delay: getFrameDelay(1) }}
            >
              <img
                src={GALLERY_FRAMES[1].image}
                alt={GALLERY_FRAMES[1].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white/30 text-xs font-mono tracking-wider">02</div>
            </motion.div>
          </FloatingWrapper>

          {/* Frame 3 - Tall, right side */}
          <FloatingWrapper index={2} className="row-span-2">
            <motion.div 
              className="relative overflow-hidden rounded-2xl h-full"
              variants={frameVariants}
              initial="hidden"
              animate={getFrameVisibility(2) ? 'visible' : 'hidden'}
              transition={{ delay: getFrameDelay(2) }}
            >
              <img
                src={GALLERY_FRAMES[2].image}
                alt={GALLERY_FRAMES[2].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white/30 text-xs font-mono tracking-wider">03</div>
              
              {/* Text 2 */}
              <motion.div
                className="absolute bottom-6 left-4 right-4"
                variants={textVariants}
                initial="hidden"
                animate={getTextVisibility(1) ? 'visible' : 'hidden'}
                transition={{ delay: getTextDelay(1) }}
              >
                <p className="text-lg text-white/80 font-light">
                  {texts[1].main} <span className="text-brand-gold">{texts[1].accent}</span>
                </p>
              </motion.div>
            </motion.div>
          </FloatingWrapper>

          {/* Frame 4 - Small, center */}
          <FloatingWrapper index={3} className="">
            <motion.div 
              className="relative overflow-hidden rounded-2xl h-full"
              variants={frameVariants}
              initial="hidden"
              animate={getFrameVisibility(3) ? 'visible' : 'hidden'}
              transition={{ delay: getFrameDelay(3) }}
            >
              <img
                src={GALLERY_FRAMES[3].image}
                alt={GALLERY_FRAMES[3].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white/30 text-xs font-mono tracking-wider">04</div>
            </motion.div>
          </FloatingWrapper>

          {/* Frame 5 - Small, bottom left */}
          <FloatingWrapper index={4} className="">
            <motion.div 
              className="relative overflow-hidden rounded-2xl h-full"
              variants={frameVariants}
              initial="hidden"
              animate={getFrameVisibility(4) ? 'visible' : 'hidden'}
              transition={{ delay: getFrameDelay(4) }}
            >
              <img
                src={GALLERY_FRAMES[4].image}
                alt={GALLERY_FRAMES[4].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white/30 text-xs font-mono tracking-wider">05</div>
            </motion.div>
          </FloatingWrapper>

          {/* Frame 6 - Wide, bottom center */}
          <FloatingWrapper index={5} className="col-span-2">
            <motion.div 
              className="relative overflow-hidden rounded-2xl h-full"
              variants={frameVariants}
              initial="hidden"
              animate={getFrameVisibility(5) ? 'visible' : 'hidden'}
              transition={{ delay: getFrameDelay(5) }}
            >
              <img
                src={GALLERY_FRAMES[5].image}
                alt={GALLERY_FRAMES[5].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white/30 text-xs font-mono tracking-wider">06</div>
              
              {/* Text 5 */}
              <motion.div
                className="absolute bottom-4 left-4 right-4"
                variants={textVariants}
                initial="hidden"
                animate={getTextVisibility(4) ? 'visible' : 'hidden'}
                transition={{ delay: getTextDelay(4) }}
              >
                <p className="text-lg text-white/80 font-light">
                  {texts[4].main} <span className="text-brand-gold">{texts[4].accent}</span>
                </p>
              </motion.div>
            </motion.div>
          </FloatingWrapper>

          {/* Frame 7 - Featured, bottom right with gold ring */}
          <FloatingWrapper index={6} className="">
            <motion.div 
              className="relative overflow-hidden rounded-2xl h-full"
              variants={frameVariants}
              initial="hidden"
              animate={getFrameVisibility(6) ? 'visible' : 'hidden'}
              transition={{ delay: getFrameDelay(6) }}
            >
              {/* Animated gold ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl z-20 pointer-events-none"
                style={{ 
                  border: '2px solid transparent',
                  background: 'linear-gradient(90deg, rgba(201,162,77,0.3), rgba(201,162,77,0.6), rgba(201,162,77,0.3)) border-box',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <img
                src={GALLERY_FRAMES[6].image}
                alt={GALLERY_FRAMES[6].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-brand-gold/60 text-xs font-mono tracking-wider">07</div>
            </motion.div>
          </FloatingWrapper>
        </div>

        {/* Floating Text Elements - Desktop with continuous motion */}
        <motion.div 
          className="hidden lg:block absolute top-32 right-12 max-w-xs"
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.p
            className="text-xl text-white/70 font-light leading-relaxed"
            variants={textVariants}
            initial="hidden"
            animate={getTextVisibility(2) ? 'visible' : 'hidden'}
            transition={{ delay: getTextDelay(2) }}
          >
            {texts[2].main} <motion.span 
              className="text-brand-gold"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >{texts[2].accent}</motion.span>
          </motion.p>
        </motion.div>

        <motion.div 
          className="hidden lg:block absolute top-1/2 left-8 max-w-xs"
          animate={{ y: [0, 8, 0], x: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <motion.p
            className="text-lg text-white/60 font-light"
            variants={textVariants}
            initial="hidden"
            animate={getTextVisibility(3) ? 'visible' : 'hidden'}
            transition={{ delay: getTextDelay(3) }}
          >
            {texts[3].main} <motion.span 
              className="text-brand-gold/80"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >{texts[3].accent}</motion.span>
          </motion.p>
        </motion.div>

        {/* Mobile Layout - Vertical Scroll */}
        <div className="lg:hidden flex flex-col gap-6 py-8">
          {/* Hero Title - Mobile */}
          <motion.div
            className="text-center mb-4"
            variants={textVariants}
            initial="hidden"
            animate={getTextVisibility(0) ? 'visible' : 'hidden'}
            transition={{ delay: getTextDelay(0) }}
          >
            <h1 className="text-3xl sm:text-4xl font-light text-white mb-2">
              {texts[0].main}
              <span className="block text-brand-gold font-medium">{texts[0].accent}</span>
            </h1>
          </motion.div>

          {/* Mobile Gallery - Stacked Cards */}
          <div className="space-y-4">
            {GALLERY_FRAMES.slice(0, 4).map((frame, index) => (
              <motion.div
                key={frame.id}
                className="relative aspect-[16/10] rounded-xl overflow-hidden"
                variants={frameVariants}
                initial="hidden"
                animate={getFrameVisibility(index) ? 'visible' : 'hidden'}
                transition={{ delay: getFrameDelay(index) }}
              >
                <img
                  src={frame.image}
                  alt={frame.alt}
                  className="w-full h-full object-cover"
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white/40 text-xs font-mono">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                {/* Text overlay for mobile */}
                {index < texts.length && index > 0 && (
                  <motion.div
                    className="absolute bottom-4 left-4 right-4"
                    variants={textVariants}
                    initial="hidden"
                    animate={getTextVisibility(index) ? 'visible' : 'hidden'}
                    transition={{ delay: getTextDelay(index) }}
                  >
                    <p className="text-sm sm:text-base text-white/90 font-light">
                      {texts[index].main} <span className="text-brand-gold">{texts[index].accent}</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Brand Statement - Mobile */}
          <motion.div
            className="text-center py-6"
            variants={textVariants}
            initial="hidden"
            animate={getTextVisibility(5) ? 'visible' : 'hidden'}
            transition={{ delay: getTextDelay(5) }}
          >
            <p className="text-xl text-white/80 font-light">
              {texts[5].main} <span className="text-brand-gold font-medium">{texts[5].accent}</span>
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-auto pt-8 lg:pt-12"
          variants={ctaVariants}
          initial="hidden"
          animate={ctaVisible ? 'visible' : 'hidden'}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <button
              onClick={handleWhatsApp}
              className="hero-cta-primary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-gold text-brand-navy font-medium rounded-full hover:bg-brand-gold/90 transition-all duration-300 hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              {getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </button>
            <button
              onClick={handleCall}
              className="hero-cta-secondary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              {getLocalizedText(UI_STRINGS.callNow, locale)}
            </button>
            <Link
              to={`/${currentLanguage}/projects`}
              className="hero-cta-tertiary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-brand-gold font-medium hover:text-white transition-colors duration-300"
            >
              {getLocalizedText(UI_STRINGS.heroViewWork, locale)}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-white/50 text-sm">
            <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="hover:text-white transition-colors">
              {CONTACT_INFO.phone}
            </a>
            <span className="hidden sm:inline">•</span>
            <span>{getLocalizedText(UI_STRINGS.heroLocation, locale)}</span>
            <span className="hidden sm:inline">•</span>
            <span>{getLocalizedText(UI_STRINGS.heroServingAll, locale)}</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: ctaVisible ? 0.6 : 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 border border-white/30 rounded-full flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="w-1 h-2 bg-white/50 rounded-full mt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroGallery;
