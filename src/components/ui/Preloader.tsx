'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { site } from '@/data/site';
import { useUI } from '@/components/providers/UIProvider';
import { useContent } from '@/components/providers/LangProvider';
import { cineInOut, expoOut } from '@/lib/easing';

/** Waits for fonts, the first video poster and the 3D chunk. */
const preload = () =>
  Promise.all([
    document.fonts?.ready,
    new Promise<void>((res) => {
      const img = new Image();
      img.onload = img.onerror = () => res();
      img.src = site.showreel.poster ?? '';
    }),
    import('@/components/three/HeroScene').catch(() => null),
  ]);

/** A quiet intro: the name rises in, a thin line draws underneath, then the curtain lifts. */
export function Preloader() {
  const { setLoaded } = useUI();
  const { profile } = useContent();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minTime = new Promise((r) => setTimeout(r, reduced ? 100 : 1400));
    // never hold the page hostage on a slow network
    const cap = new Promise((r) => setTimeout(r, 4500));
    let alive = true;
    Promise.race([Promise.all([preload(), minTime]), cap]).then(() => {
      if (!alive) return;
      setVisible(false);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: cineInOut }}
          role="status"
          aria-label="Loading"
        >
          <div className="flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.p
                className="font-display text-2xl font-bold tracking-[0.2em] md:text-3xl"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: expoOut, delay: 0.1 }}
              >
                {site.name}
              </motion.p>
            </div>
            <motion.span
              className="mt-4 block h-px w-40 origin-left bg-accent-gradient rtl:origin-right"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: cineInOut, delay: 0.3 }}
            />
            <motion.p
              className="eyebrow mt-4 text-[10px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {profile.title}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
