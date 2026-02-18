import React from 'react';

const HeroBackground: React.FC = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#0a1f35] to-brand-navy" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,77,0.08),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,77,0.05),transparent_50%)]" />
  </div>
);

export default HeroBackground;
