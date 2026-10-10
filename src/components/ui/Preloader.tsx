'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { site } from '@/data/site';
import { useUI } from '@/components/providers/UIProvider';
import { cineInOut } from '@/lib/easing';
import { pad } from '@/lib/utils';

/** Waits for the hero poster, fonts and the 3D chunk while counting like an AE render queue. */
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

export function Preloader() {
  const { setLoaded } = useUI();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let assetsReady = false;
    let raf = 0;
    let p = 0;
    const start = performance.now();
    let last = start;
    const minTime = reduced ? 200 : 1800;
    preload().then(() => (assetsReady = true));

    const tick = (now: number) => {
      const elapsed = now - start;
      // Ease toward 90% on time alone; the last 10% waits for assets.
      const target = assetsReady && elapsed > minTime ? 100 : Math.min(90, (elapsed / minTime) * 90);
      // frame-rate independent easing, so slow devices don't stall the counter
      const dt = (now - last) / 1000;
      last = now;
      p += (target - p) * (1 - Math.exp(-dt * 7));
      if (target === 100 && p > 99.5) p = 100;
      setProgress(p);
      if (p >= 100) {
        setDone(true);
        setTimeout(() => {
          setVisible(false);
          setLoaded(true);
        }, reduced ? 50 : 650);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setLoaded]);

  const frame = Math.round(progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[95] flex flex-col justify-between bg-ink p-[var(--gutter)] font-mono text-xs"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1, ease: cineInOut }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={frame}
          aria-label="Loading"
        >
          <div className="flex justify-between text-paper/50">
            <span>RENDER QUEUE</span>
            <span>{site.name} — Showreel_Final_v12.aep</span>
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between">
              <span className="display text-[clamp(4rem,18vw,16rem)] tabular-nums leading-none">{pad(frame, 3)}</span>
              <span className="mb-4 text-paper/50">%</span>
            </div>
            <div className="relative h-[3px] w-full bg-white/10">
              <div className="absolute inset-y-0 left-0 bg-accent-gradient" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex justify-between text-paper/50">
              <span>
                Rendering frame {pad(frame, 4)} / 0100
              </span>
              <span>{done ? 'RENDER COMPLETE' : 'H.264 · 3840×2160 · 24fps'}</span>
            </div>
          </div>

          {/* "Render complete" flash */}
          <AnimatePresence>
            {done && (
              <motion.div
                className="pointer-events-none absolute inset-0 bg-paper mix-blend-difference"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.6, times: [0, 0.15, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
