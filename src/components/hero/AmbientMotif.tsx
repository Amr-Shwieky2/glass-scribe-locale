import React from 'react';
import { motion } from 'framer-motion';
import { ORBS, STREAKS, PARTICLE_COUNT } from './ambientMotifConfig';

const Orb: React.FC<{ cfg: (typeof ORBS)[number] }> = ({ cfg }) => (
  <motion.div
    className={`absolute rounded-full`}
    style={{
      width: cfg.size, height: cfg.size,
      background: `radial-gradient(circle, ${cfg.color} 0%, ${cfg.color.replace(/[\d.]+\)$/, '0.04)')} 40%, transparent 70%)`,
      ...cfg.position,
    }}
    animate={cfg.animate as Record<string, number[] | string[]>}
    transition={{ duration: cfg.duration, repeat: Infinity, ease: 'easeInOut', delay: cfg.delay }}
  />
);

const LightStreak: React.FC<{ cfg: (typeof STREAKS)[number] }> = ({ cfg }) => (
  <motion.div
    className="absolute"
    style={{
      height: cfg.height, width: cfg.width,
      background: `linear-gradient(90deg, transparent, ${cfg.gradient}, transparent)`,
      top: cfg.top, left: -cfg.width,
      ...(cfg.rotate ? { transform: `rotate(${cfg.rotate})` } : {}),
    }}
    animate={{ x: [0, `calc(100vw + ${cfg.width * 2}px)`], ...(cfg.yEnd ? { y: [0, cfg.yEnd] } : {}) }}
    transition={{ duration: cfg.duration, repeat: Infinity, ease: 'linear', repeatDelay: cfg.repeatDelay, delay: cfg.delay }}
  />
);

const Particles: React.FC = () => (
  <>
    {[...Array(PARTICLE_COUNT)].map((_, i) => (
      <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-brand-gold/40"
        style={{ top: `${20 + i * 12}%`, left: `${10 + i * 15}%` }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.3, 0.7, 0.3], scale: [1, 1.5, 1] }}
        transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
      />
    ))}
  </>
);

const AmbientMotif: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {ORBS.map((cfg, i) => <Orb key={i} cfg={cfg} />)}
    {STREAKS.map((cfg, i) => <LightStreak key={i} cfg={cfg} />)}
    <Particles />
    <motion.div className="absolute w-full h-full"
      style={{ background: 'radial-gradient(ellipse at center, rgba(201,162,77,0.08) 0%, transparent 50%)' }}
      animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div className="absolute inset-0"
      style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)', backgroundSize: '200% 100%' }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

export default AmbientMotif;
