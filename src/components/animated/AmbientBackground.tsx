/**
 * Decorative animated background for page headers (Server Component, CSS-only —
 * see the "AmbientBackground" keyframes in index.css). Disabled under
 * prefers-reduced-motion.
 */
import React from 'react';

const gold = (a: number, b: number) => `radial-gradient(circle, rgba(201,162,77,${a}) 0%, rgba(201,162,77,${b}) 40%, transparent 70%)`;

const AmbientBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute w-[500px] h-[500px] rounded-full ambient-blob-a" style={{ background: gold(0.15, 0.05), top: '-10%', left: '10%' }} />
    <div className="absolute w-[400px] h-[400px] rounded-full ambient-blob-b" style={{ background: gold(0.12, 0.04), top: '20%', right: '-5%' }} />
    <div className="absolute w-[200px] h-[200px] rounded-full ambient-blob-c" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)', bottom: '10%', left: '40%' }} />
    {/* Light streaks: 3.5s sweep + 4s pause, 4.5s sweep + 3s pause */}
    <div className="absolute h-[2px] w-[300px] ambient-streak" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,77,0.5), rgba(201,162,77,0.7), rgba(201,162,77,0.5), transparent)', top: '30%', left: '-300px', '--streak-duration': '7.5s' } as React.CSSProperties} />
    <div className="absolute h-[1px] w-[250px] ambient-streak" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(255,255,255,0.6), rgba(255,255,255,0.4), transparent)', top: '60%', left: '-250px', '--streak-duration': '7.5s', '--anim-delay': '1.5s' } as React.CSSProperties} />
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-brand-gold/50 opacity-30 ambient-dot"
        style={{ top: `${25 + i * 15}%`, left: `${15 + i * 18}%`, '--float-duration': `${2.5 + i * 0.4}s`, '--anim-delay': `${i * 0.6}s` } as React.CSSProperties}
      />
    ))}
    <div className="absolute w-full h-full opacity-60 ambient-glow" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,162,77,0.1) 0%, transparent 50%)' }} />
    <div className="absolute inset-0 ambient-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)', backgroundSize: '200% 100%' }} />
  </div>
);

export default AmbientBackground;
