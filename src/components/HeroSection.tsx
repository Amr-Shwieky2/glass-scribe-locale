/**
 * HeroSection - Cinematic Full-Screen Hero
 * Dramatic animations with premium feel
 */
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHeroImages, getHeroUrl } from '@/hooks/cloudinary';
import { Phone, ChevronDown } from 'lucide-react';

// Text content for different languages
const HERO_TEXT = {
  he: {
    line1: 'אומנות',
    line2: 'הזכוכית',
    tagline: 'יוצרים מרחבים של אור ושקיפות',
    cta: 'דברו איתנו',
  },
  en: {
    line1: 'The Art',
    line2: 'of Glass',
    tagline: 'Creating spaces of light and transparency',
    cta: 'Contact Us',
  },
  ar: {
    line1: 'فن',
    line2: 'الزجاج',
    tagline: 'نخلق مساحات من الضوء والشفافية',
    cta: 'تواصل معنا',
  },
  ru: {
    line1: 'Искусство',
    line2: 'Стекла',
    tagline: 'Создаём пространства света и прозрачности',
    cta: 'Свяжитесь с нами',
  },
};

const HeroSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const { images: heroImages } = useHeroImages();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const text = HERO_TEXT[currentLanguage as keyof typeof HERO_TEXT] || HERO_TEXT.en;
  const heroImage = heroImages[0];
  const imageUrl = heroImage ? getHeroUrl(heroImage.public_id) : null;

  // Preload image with fetchpriority
  useEffect(() => {
    if (imageUrl) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setImageLoaded(true);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [imageUrl]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen overflow-hidden bg-brand-navy"
    >
      {/* Background Image with Ken Burns Effect */}
      <AnimatePresence>
        {imageUrl && imageLoaded && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={imageUrl}
              alt="Premium glass work"
              className="w-full h-full object-cover"
              width="1920"
              height="1080"
              fetchPriority="high"
              decoding="async"
              style={{ transform: 'scale(1.02)' }}
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-navy/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback gradient background if no image */}
      {!imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-slate-800 to-brand-navy">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </div>
      )}

      {/* Animated Gold Line */}
      <motion.div
        className="absolute left-8 md:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-gold to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={isInView ? { scaleY: 1, opacity: 0.5 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            {/* Main Title - Dramatic Reveal */}
            <div className="overflow-hidden mb-2">
              <motion.h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none"
                initial={{ y: 120, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {text.line1}
              </motion.h1>
            </div>
            
            <div className="overflow-hidden mb-6">
              <motion.h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none"
                initial={{ y: 120, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold">
                  {text.line2}
                </span>
              </motion.h1>
            </div>

            {/* Tagline with typing effect feel */}
            <motion.div
              className="overflow-hidden mb-10"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.p
                className="text-xl md:text-2xl lg:text-3xl text-white/80 font-light"
                initial={{ y: 30 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                {text.tagline}
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              {/* Phone Button */}
              <motion.button
                className="group relative inline-flex items-center gap-3 bg-brand-gold text-brand-navy font-bold text-lg px-8 py-4 rounded-full overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = 'tel:+972585022264'}
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <Phone className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{text.cta}</span>
              </motion.button>

              {/* WhatsApp Button */}
              <motion.a
                href="https://wa.me/972585022264"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 bg-brand-gold text-brand-navy font-bold text-lg px-8 py-4 rounded-full overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                {/* WhatsApp Icon */}
                <svg 
                  className="w-5 h-5 relative z-10" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="relative z-10">WhatsApp</span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <motion.div
        className="absolute top-8 right-8 md:top-16 md:right-16"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="w-20 h-20 md:w-32 md:h-32 border-t-2 border-r-2 border-brand-gold/50" />
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8 md:bottom-16 md:left-16"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <div className="w-20 h-20 md:w-32 md:h-32 border-b-2 border-l-2 border-brand-gold/50" />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-brand-gold rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-brand-gold/40 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </section>
  );
};

export default HeroSection;
