import React from 'react';
import { motion } from 'framer-motion';
import { textVariants } from './heroConfig';

export interface TextBlockProps {
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

export default TextBlock;
