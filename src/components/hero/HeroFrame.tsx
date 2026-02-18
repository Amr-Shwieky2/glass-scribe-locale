import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { textVariants } from './heroConfig';
import FloatingWrapper from './FloatingWrapper';

// =============================================================================
// TYPES
// =============================================================================

export interface FrameTextOverlay {
  /** Index into the texts array */
  textIndex: number;
  /** 'hero' for the large h2 block on frame 1, 'caption' for the smaller p blocks */
  style: 'hero' | 'caption';
}

export interface HeroFrameConfig {
  /** Grid class names like "col-span-2 row-span-2" */
  gridClassName: string;
  /** Enable the shimmer sweep effect (frame 1) */
  shimmer?: boolean;
  /** Enable the animated gold ring border (frame 7) */
  goldRing?: boolean;
  /** Gradient intensity — 'strong' = /40, 'light' = /30 (default light) */
  overlayStrength?: 'strong' | 'light';
  /** Optional text overlay rendered inside the frame */
  textOverlay?: FrameTextOverlay;
}

interface HeroFrameProps {
  frame: { id: number; image: string; alt: string };
  index: number;
  config: HeroFrameConfig;
  texts: { main: string; accent: string }[];
  frameVariants: Variants;
  getFrameVisibility: (index: number) => boolean;
  getFrameDelay: (index: number) => number;
  getTextVisibility: (index: number) => boolean;
  getTextDelay: (index: number) => number;
}

// =============================================================================
// SUB-ELEMENTS
// =============================================================================

const Shimmer: React.FC = () => (
  <motion.div
    className="absolute inset-0 z-10"
    style={{
      background:
        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
      backgroundSize: '200% 100%',
    }}
    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
  />
);

const GoldRing: React.FC = () => (
  <motion.div
    className="absolute inset-0 rounded-2xl z-20 pointer-events-none"
    style={{
      border: '2px solid transparent',
      background:
        'linear-gradient(90deg, rgba(201,162,77,0.3), rgba(201,162,77,0.6), rgba(201,162,77,0.3)) border-box',
      WebkitMask:
        'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// =============================================================================
// HERO FRAME
// =============================================================================

const HeroFrame: React.FC<HeroFrameProps> = ({
  frame,
  index,
  config,
  texts,
  frameVariants: variants,
  getFrameVisibility,
  getFrameDelay,
  getTextVisibility,
  getTextDelay,
}) => {
  const overlayOpacity = config.overlayStrength === 'strong' ? '/40' : '/30';
  const numberPad = config.overlayStrength === 'strong' ? 'bottom-4 left-4' : 'bottom-3 left-3';
  const numberColor =
    config.goldRing ? 'text-brand-gold/60' : 'text-white/30';

  return (
    <FloatingWrapper index={index} className={config.gridClassName}>
      <motion.div
        className="relative overflow-hidden rounded-2xl h-full"
        variants={variants}
        initial="hidden"
        animate={getFrameVisibility(index) ? 'visible' : 'hidden'}
        transition={{ delay: getFrameDelay(index) }}
      >
        {config.shimmer && <Shimmer />}
        {config.goldRing && <GoldRing />}

        <img
          src={frame.image}
          alt={frame.alt}
          className="w-full h-full object-cover"
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-brand-navy${overlayOpacity} to-transparent`}
        />
        <div
          className={`absolute ${numberPad} ${numberColor} text-xs font-mono tracking-wider`}
        >
          {String(frame.id).padStart(2, '0')}
        </div>

        {/* Optional text overlay */}
        {config.textOverlay && config.textOverlay.style === 'hero' && (
          <motion.div
            className="absolute bottom-8 left-6 right-6"
            variants={textVariants}
            initial="hidden"
            animate={getTextVisibility(config.textOverlay.textIndex) ? 'visible' : 'hidden'}
            transition={{ delay: getTextDelay(config.textOverlay.textIndex) }}
          >
            <motion.h2
              className="text-4xl xl:text-5xl font-light text-white"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {texts[config.textOverlay.textIndex].main}
              <motion.span
                className="block text-brand-gold font-medium"
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                {texts[config.textOverlay.textIndex].accent}
              </motion.span>
            </motion.h2>
          </motion.div>
        )}

        {config.textOverlay && config.textOverlay.style === 'caption' && (
          <motion.div
            className="absolute bottom-6 left-4 right-4"
            variants={textVariants}
            initial="hidden"
            animate={getTextVisibility(config.textOverlay.textIndex) ? 'visible' : 'hidden'}
            transition={{ delay: getTextDelay(config.textOverlay.textIndex) }}
          >
            <p className="text-lg text-white/80 font-light">
              {texts[config.textOverlay.textIndex].main}{' '}
              <span className="text-brand-gold">
                {texts[config.textOverlay.textIndex].accent}
              </span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </FloatingWrapper>
  );
};

export default HeroFrame;
