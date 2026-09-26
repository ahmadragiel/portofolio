import { useEffect, useRef, useState } from 'react';

/**
 * Adds the `reveal-visible` class the first time an element scrolls into view.
 *
 * Uses IntersectionObserver once for the whole page rather than a scroll
 * listener, and bails out immediately when the visitor prefers reduced motion
 * (the CSS already renders those elements visible in that case).
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  options: { threshold?: number; rootMargin?: string } = {},
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: options.threshold ?? 0.12, rootMargin: options.rootMargin ?? '0px 0px -60px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // Intentionally mounted once: options are static per call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, visible };
}

/**
 * Reveals a group of elements with a small stagger between them.
 * Returns a ref to put on the container plus the index-aware class name helper.
 */
export function useRevealGroup<T extends HTMLElement = HTMLElement>(staggerMs = 70) {
  const containerRef = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return {
    ref: containerRef,
    visible,
    /** Inline delay for a child at `index`, so the group cascades in. */
    delay: (index: number) => (visible ? { transitionDelay: `${index * staggerMs}ms` } : undefined),
  };
}
