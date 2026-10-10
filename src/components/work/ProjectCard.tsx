'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import type { Project } from '@/data/types';
import { categoryLabel } from '@/data/categories';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { expoOut } from '@/lib/easing';

/** 2D card: poster by default, muted preview loads and plays only while hovered/focused. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>();
  const [playing, setPlaying] = useState(false);

  const start = () => {
    if (!src) setSrc(project.preview);
    requestAnimationFrame(() => void video.current?.play().catch(() => {}));
  };
  const stop = () => {
    video.current?.pause();
    setPlaying(false);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.9, ease: expoOut, delay: (index % 3) * 0.06 }}
    >
      <TransitionLink
        href={`/work/${project.slug}`}
        transitionLabel={project.title}
        className="group block"
        data-cursor="VIEW"
        onPointerEnter={start}
        onPointerLeave={stop}
        onFocus={start}
        onBlur={stop}
      >
        <div className="relative aspect-video overflow-hidden rounded-xl bg-white/5">
          <Image
            src={project.poster}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
          />
          <video
            ref={video}
            src={src}
            muted
            loop
            playsInline
            preload="none"
            onPlaying={() => setPlaying(true)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: playing ? 1 : 0 }}
            aria-hidden
          />
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
            {categoryLabel(project.category)}
          </span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl tracking-tight">{project.title}</h3>
          <span className="font-mono text-xs text-paper/50">{project.year}</span>
        </div>
        <p className="mt-1 text-sm text-paper/50">{project.client}</p>
      </TransitionLink>
    </motion.article>
  );
}
