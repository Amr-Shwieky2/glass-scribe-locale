import React from 'react';
import { motion } from 'framer-motion';
import { frameVariants } from './heroConfig';

export interface GalleryFrameProps {
  frame: { id: number; image: string; alt: string };
  index: number;
  isVisible: boolean;
  delay: number;
}

const positions = [
  { className: 'lg:col-span-2 lg:row-span-2', size: 'large' },
  { className: 'lg:col-start-3', size: 'small' },
  { className: 'lg:col-start-4 lg:row-span-2', size: 'tall' },
  { className: 'lg:col-start-3', size: 'small' },
  { className: '', size: 'small' },
  { className: 'lg:col-span-2', size: 'medium' },
  { className: 'lg:col-start-4', size: 'featured' },
];

const GalleryFrame: React.FC<GalleryFrameProps> = ({ frame, index, isVisible, delay }) => {
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
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
      <div className="absolute bottom-3 left-3 text-white/40 text-xs font-mono">
        {String(index + 1).padStart(2, '0')}
      </div>
    </motion.div>
  );
};

export default GalleryFrame;
