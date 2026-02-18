import React from 'react';
import { motion } from 'framer-motion';

const ScrollIndicator: React.FC<{ visible: boolean }> = ({ visible }) => (
  <motion.div
    className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
    initial={{ opacity: 0 }}
    animate={{ opacity: visible ? 0.6 : 0 }}
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
);

export default ScrollIndicator;
