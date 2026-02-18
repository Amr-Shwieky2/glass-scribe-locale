/** Config arrays for AmbientMotif animated elements */

export interface OrbConfig {
  size: number;
  color: string;
  position: Record<string, string>;
  animate: Record<string, (number | string)[]>;
  duration: number;
  delay?: number;
}

export interface StreakConfig {
  height: number;
  width: number;
  gradient: string;
  top: string;
  duration: number;
  repeatDelay: number;
  delay?: number;
  rotate?: string;
  yEnd?: number;
}

export const ORBS: OrbConfig[] = [
  {
    size: 700, color: 'rgba(201,162,77,0.15)',
    position: { top: '5%', left: '15%' },
    animate: { x: [0, 150, 80, 0], y: [0, 80, 150, 0], scale: [1, 1.2, 0.9, 1] },
    duration: 15,
  },
  {
    size: 500, color: 'rgba(201,162,77,0.12)',
    position: { bottom: '10%', right: '5%' },
    animate: { x: [0, -120, -60, 0], y: [0, -100, 60, 0], scale: [1, 0.85, 1.15, 1] },
    duration: 12, delay: 1,
  },
  {
    size: 400, color: 'rgba(255,255,255,0.08)',
    position: { top: '40%', left: '50%', transform: 'translateX(-50%)' },
    animate: { x: ['-50%', 'calc(-50% + 80px)', 'calc(-50% - 60px)', '-50%'], y: [0, -60, 80, 0], scale: [1, 1.1, 0.95, 1] },
    duration: 18, delay: 3,
  },
];

export const STREAKS: StreakConfig[] = [
  { height: 2, width: 400, gradient: 'rgba(201,162,77,0.4), rgba(201,162,77,0.6), rgba(201,162,77,0.4)', top: '25%', duration: 4, repeatDelay: 3 },
  { height: 1, width: 300, gradient: 'rgba(255,255,255,0.3), rgba(255,255,255,0.5), rgba(255,255,255,0.3)', top: '65%', duration: 5, repeatDelay: 4, delay: 2 },
  { height: 1, width: 500, gradient: 'rgba(201,162,77,0.3)', top: '45%', duration: 6, repeatDelay: 5, delay: 1, rotate: '-15deg', yEnd: 200 },
];

export const PARTICLE_COUNT = 6;
