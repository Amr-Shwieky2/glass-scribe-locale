import React from 'react';
import { motion } from 'framer-motion';
import { frameVariants, textVariants } from './heroConfig';
import HeroFrame, { type HeroFrameConfig } from './HeroFrame';

// =============================================================================
// FRAME LAYOUT CONFIG
// =============================================================================

const FRAME_CONFIGS: HeroFrameConfig[] = [
  { gridClassName: 'col-span-2 row-span-2', shimmer: true, overlayStrength: 'strong', textOverlay: { textIndex: 0, style: 'hero' } },
  { gridClassName: '' },
  { gridClassName: 'row-span-2', textOverlay: { textIndex: 1, style: 'caption' } },
  { gridClassName: '' },
  { gridClassName: '' },
  { gridClassName: 'col-span-2', textOverlay: { textIndex: 4, style: 'caption' } },
  { gridClassName: '', goldRing: true, overlayStrength: 'strong' },
];

// =============================================================================
// COMPONENT
// =============================================================================

interface DesktopGalleryProps {
  frames: { id: number; image: string; alt: string }[];
  texts: { main: string; accent: string }[];
  getFrameVisibility: (index: number) => boolean;
  getTextVisibility: (index: number) => boolean;
  getFrameDelay: (index: number) => number;
  getTextDelay: (index: number) => number;
}

const DesktopGallery: React.FC<DesktopGalleryProps> = ({
  frames,
  texts,
  getFrameVisibility,
  getTextVisibility,
  getFrameDelay,
  getTextDelay,
}) => {
  return (
    <>
      {/* Desktop Layout - Asymmetric Gallery Grid with Continuous Motion */}
      <div className="hidden lg:grid flex-1 grid-cols-4 grid-rows-3 gap-4 max-h-[70vh]">
        {frames.map((frame, i) => (
          <HeroFrame
            key={frame.id}
            frame={frame}
            index={i}
            config={FRAME_CONFIGS[i]}
            texts={texts}
            frameVariants={frameVariants}
            getFrameVisibility={getFrameVisibility}
            getFrameDelay={getFrameDelay}
            getTextVisibility={getTextVisibility}
            getTextDelay={getTextDelay}
          />
        ))}
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
    </>
  );
};

export default DesktopGallery;
