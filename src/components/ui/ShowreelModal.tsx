'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/projects';
import { useUI } from '@/components/providers/UIProvider';
import { useLenis } from '@/components/providers/SmoothScroll';
import { useContent, useLang } from '@/components/providers/LangProvider';
import { cineInOut } from '@/lib/easing';
import { VideoPlayer } from './VideoPlayer';

export function ShowreelModal() {
  const { showreelOpen, closeShowreel } = useUI();
  const lenis = useLenis();
  const { t } = useLang();
  const { project: localize } = useContent();
  const closeRef = useRef<HTMLButtonElement>(null);
  // "Show videos" plays every project back to back, starting from the first.
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const count = projects.length;
  const go = (i: number) => setCurrent((i + count) % count);
  const project = localize(projects[current]);

  useEffect(() => {
    if (showreelOpen) setCurrent(0);
  }, [showreelOpen]);

  useEffect(() => {
    if (!showreelOpen) return;
    lenis?.stop();
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeShowreel();
      else if (e.key === 'PageDown' || e.key === 'n') setCurrent((c) => (c + 1) % count);
      else if (e.key === 'PageUp' || e.key === 'p') setCurrent((c) => (c - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      window.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [showreelOpen, closeShowreel, lenis, count]);

  return (
    <AnimatePresence>
      {showreelOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.video.all}
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
            className="relative w-full max-w-[min(80rem,calc((100svh-15rem)*16/9))]"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: cineInOut }}
          >
            <VideoPlayer
              key={project.slug}
              source={project.video}
              title={project.title}
              autoPlay
              startMuted={muted}
              onMuteChange={setMuted}
              onEnded={() => go(current + 1)}
              className="rounded-lg"
            />
            <div className="mt-4 flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate text-sm">
                <span className="font-mono text-xs text-violet-soft">
                  {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
                <span className="ms-3 text-paper">{project.title}</span>
                <span className="ms-2 hidden text-paper/50 sm:inline">· {project.client}</span>
              </p>
              <button onClick={() => go(current - 1)} className="btn-ghost px-4 py-2 font-mono text-xs" aria-label="Previous video">
                {t.video.prev}
              </button>
              <button onClick={() => go(current + 1)} className="btn-ghost px-4 py-2 font-mono text-xs" aria-label="Next video">
                {t.video.next}
              </button>
            </div>
            <ul className="mt-3 grid grid-cols-5 gap-2 md:gap-3">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <button
                    onClick={() => go(i)}
                    aria-label={`Play ${p.title}`}
                    aria-current={i === current}
                    className={`relative block aspect-video w-full overflow-hidden rounded-md ring-2 transition-all duration-300 ${
                      i === current ? 'opacity-100 ring-violet-soft' : 'opacity-45 ring-transparent hover:opacity-80'
                    }`}
                  >
                    <Image src={p.poster} alt="" fill sizes="20vw" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
          <button
            ref={closeRef}
            onClick={closeShowreel}
            className="btn-ghost absolute end-4 top-4 font-mono text-xs md:end-8 md:top-8"
            data-cursor="CLOSE"
          >
            {t.video.close}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
