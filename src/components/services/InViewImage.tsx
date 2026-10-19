'use client';
/**
 * next/image that mounts only when its container nears the viewport.
 *
 * Native loading="lazy" starts fetching up to ~2500px away on slow
 * connections, so below-the-fold cards were competing with the hero (LCP)
 * image. Search engines render with a tall viewport, so they still see it.
 */
import React, { useEffect, useRef, useState } from 'react';
import Image, { type ImageProps } from 'next/image';

const InViewImage: React.FC<ImageProps & { rootMargin?: string }> = ({ rootMargin = '150px 0px', ...props }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <span ref={ref} className="absolute inset-0 block">
      {visible && <Image {...props} />}
      <noscript>
        {/* Plain img element on purpose: this is the fallback for visitors without JavaScript, and
            next/image is a client component. The src is already a sized Cloudinary URL. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={typeof props.src === 'string' ? props.src : ''}
          alt={props.alt}
          width={typeof props.width === 'number' ? props.width : 600}
          height={typeof props.height === 'number' ? props.height : 600}
          loading="lazy"
          className={props.className}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </noscript>
    </span>
  );
};

export default InViewImage;
