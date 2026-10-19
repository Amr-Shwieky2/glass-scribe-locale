'use client';
/**
 * Global scroll-reveal: any element with a `data-reveal` attribute fades/slides
 * in when it enters the viewport. Lets Server Components animate without
 * shipping an animation library.
 *
 * Content is only hidden when the inline script in the layout has added the
 * `js` class to <html> (see index.css), so no-JS visitors and crawlers always
 * see everything. Respects prefers-reduced-motion via CSS.
 */
import { useEffect } from 'react';

export default function RevealObserver() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('js');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', '');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => io.observe(el));
    };
    observeAll(document);

    // Pick up content rendered after client-side navigation
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            if (node.matches('[data-reveal]:not([data-revealed])')) io.observe(node);
            observeAll(node);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
