import React from 'react';
import { motion } from 'framer-motion';
import { frameVariants, textVariants } from './heroConfig';

interface MobileGalleryProps {
  frames: { id: number; image: string; alt: string }[];
  texts: { main: string; accent: string }[];
  getFrameVisibility: (index: number) => boolean;
  getTextVisibility: (index: number) => boolean;
  getFrameDelay: (index: number) => number;
  getTextDelay: (index: number) => number;
}

const MobileGallery: React.FC<MobileGalleryProps> = ({
  frames,
  texts,
  getFrameVisibility,
  getTextVisibility,
  getFrameDelay,
  getTextDelay,
}) => {
  // If no frames available, show only text content
  if (frames.length === 0) {
    return (
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
    );
  }

  return (
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
        {frames.slice(0, 4).map((frame, index) => (
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
  );
};

export default MobileGallery;
