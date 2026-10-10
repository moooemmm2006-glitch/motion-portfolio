'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { site } from '@/data/site';
import { useUI } from '@/components/providers/UIProvider';
import { useLenis } from '@/components/providers/SmoothScroll';
import { cineInOut } from '@/lib/easing';
import { VideoPlayer } from './VideoPlayer';

export function ShowreelModal() {
  const { showreelOpen, closeShowreel } = useUI();
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showreelOpen) return;
    lenis?.stop();
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeShowreel();
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      window.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [showreelOpen, closeShowreel, lenis]);

  return (
    <AnimatePresence>
      {showreelOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4 md:p-10"
          initial={{ clipPath: 'inset(50% 0 50% 0)' }}
          animate={{ clipPath: 'inset(0% 0 0% 0)' }}
          exit={{ clipPath: 'inset(50% 0 50% 0)' }}
          transition={{ duration: 0.8, ease: cineInOut }}
        >
          {/* Letterbox bars */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[6vh] bg-black" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[6vh] bg-black" />
          <motion.div
            className="relative w-full max-w-7xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: cineInOut }}
          >
            <VideoPlayer source={site.showreel} title="Showreel" autoPlay className="rounded-lg" />
          </motion.div>
          <button
            ref={closeRef}
            onClick={closeShowreel}
            className="btn-ghost absolute right-4 top-4 font-mono text-xs md:right-8 md:top-8"
            data-cursor="CLOSE"
          >
            ESC · CLOSE
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
