import React from 'react';
import { motion } from 'framer-motion';

interface FloatingWrapperProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const patterns = [
  { y: [0, -8, 0], x: [0, 4, 0], rotate: [0, 0.5, 0] },
  { y: [0, 6, 0], x: [0, -5, 0], rotate: [0, -0.5, 0] },
  { y: [0, -6, 0], x: [0, -4, 0], rotate: [0, 0.3, 0] },
  { y: [0, 8, 0], x: [0, 6, 0], rotate: [0, -0.3, 0] },
  { y: [0, -5, 0], x: [0, 3, 0], rotate: [0, 0.4, 0] },
  { y: [0, 7, 0], x: [0, -3, 0], rotate: [0, -0.4, 0] },
  { y: [0, -7, 0], x: [0, 5, 0], rotate: [0, 0.2, 0] },
];

const FloatingWrapper: React.FC<FloatingWrapperProps> = ({ children, index, className = '' }) => {
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

export default FloatingWrapper;
