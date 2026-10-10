'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { projects } from '@/data/projects';
import { categories, categoryLabel } from '@/data/categories';
import { t } from '@/data/dictionary';
import type { Category } from '@/data/types';
import { useCanUse3D } from '@/hooks/useCanUse3D';
import { useIsMobile } from '@/hooks/useReducedMotion';
import { useLenis } from '@/components/providers/SmoothScroll';
import { usePageTransition } from '@/components/providers/TransitionProvider';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { ProjectCard } from '@/components/work/ProjectCard';
import { expoOut } from '@/lib/easing';
import { cn, pad } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const WorkGallery = dynamic(() => import('@/components/three/WorkGallery'), { ssr: false });

/** Scroll distance (in viewport heights) per project in the 3D ring. */
const VH_PER_CARD = 45;

export function Work() {
  const can3D = useCanUse3D();
  const mobile = useIsMobile();
  const navigate = usePageTransition();
  const lenis = useLenis();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [view, setView] = useState<'3d' | 'grid'>('3d');
  const [focused, setFocused] = useState(projects[0].slug);
  const [active, setActive] = useState(false);

  const track = useRef<HTMLDivElement>(null);
  const index = useRef(0);
  const dragged = useRef(false);
  const st = useRef<ScrollTrigger | null>(null);

  const shown = useMemo(() => projects.filter((p) => filter === 'all' || p.category === filter), [filter]);
  const visible = useMemo(() => new Set(shown.map((p) => p.slug)), [shown]);
  const is3D = can3D && view === '3d';

  useEffect(() => {
    if (!is3D || !track.current) return;
    const n = shown.length;
    st.current = ScrollTrigger.create({
      trigger: track.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => (index.current = self.progress * Math.max(0, n - 1)),
    });
    // render while the section is anywhere near the viewport
    const near = ScrollTrigger.create({
      trigger: track.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => setActive(self.isActive),
    });
    ScrollTrigger.refresh();
    return () => {
      st.current?.kill();
      near.kill();
    };
  }, [is3D, shown.length]);

  const scrollToIndex = useCallback(
    (i: number, immediate = false) => {
      const s = st.current;
      if (!s) return;
      const n = Math.max(1, shown.length - 1);
      const y = s.start + (s.end - s.start) * (Math.min(Math.max(i, 0), n) / n);
      if (lenis) lenis.scrollTo(y, { immediate, duration: 1.2 });
      else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
    },
    [lenis, shown.length],
  );

  // Horizontal drag/swipe on the ring is translated into page scroll.
  const drag = useRef({ x: 0, startIndex: 0, down: false });
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, startIndex: index.current, down: true };
    dragged.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6) dragged.current = true;
    if (dragged.current) scrollToIndex(drag.current.startIndex - dx / (mobile ? 220 : 380), true);
  };
  const onPointerUp = () => {
    drag.current.down = false;
    if (dragged.current) scrollToIndex(Math.round(index.current));
    setTimeout(() => (dragged.current = false), 0);
  };

  const focusedProject = shown.find((p) => p.slug === focused) ?? shown[0];
  const focusedIdx = shown.indexOf(focusedProject);

  const changeFilter = (id: Category | 'all') => {
    setFilter(id);
    if (is3D && st.current) {
      const top = st.current.start;
      if (lenis) lenis.scrollTo(top, { duration: 0.8 });
      else window.scrollTo({ top });
    }
  };

  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-28 md:pt-40">
      <div className="container-x">
        <SectionHeading id="work-title" index="02" eyebrow={t.work.eyebrow} title={t.work.heading} className="md:mb-12" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div role="toolbar" aria-label="Filter projects by category" className="-mx-1 flex flex-wrap gap-2">
            {categories.map((c) => {
              const count = c.id === 'all' ? projects.length : projects.filter((p) => p.category === c.id).length;
              if (!count) return null;
              return (
                <button
                  key={c.id}
                  onClick={() => changeFilter(c.id)}
                  aria-pressed={filter === c.id}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm transition-colors duration-500',
                    filter === c.id ? 'text-ink' : 'text-paper/60 hover:text-paper',
                  )}
                >
                  {filter === c.id && (
                    <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ duration: 0.6, ease: expoOut }} />
                  )}
                  <span className="relative">
                    {c.label} <sup className="font-mono text-[9px] opacity-60">{count}</sup>
                  </span>
                </button>
              );
            })}
          </div>

          {can3D && (
            <div className="flex shrink-0 rounded-full border border-white/10 p-1 font-mono text-xs" role="group" aria-label="Gallery view">
              {(['3d', 'grid'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={cn('rounded-full px-4 py-1.5 uppercase transition-colors', view === v ? 'bg-white/10 text-paper' : 'text-paper/50')}
                >
                  {v === '3d' ? t.work.view3d : t.work.viewGrid}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {is3D ? (
        <div ref={track} className="relative" style={{ height: `${100 + Math.max(0, shown.length - 1) * VH_PER_CARD}vh` }}>
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <div
              className="absolute inset-0 touch-pan-y"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onPointerLeave={onPointerUp}
              aria-hidden
            >
              <WorkGallery
                projects={projects}
                visible={visible}
                index={index}
                dragged={dragged}
                active={active}
                mobile={mobile}
                onOpen={(slug) => navigate(`/work/${slug}`, projects.find((p) => p.slug === slug)?.title)}
                onFocus={setFocused}
              />
            </div>

            {/* Focused project caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-10">
              <div className="container-x flex items-end justify-between gap-6">
                <AnimatePresence mode="wait">
                  {focusedProject && (
                    <motion.div
                      key={focusedProject.slug}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.6, ease: expoOut }}
                    >
                      <p className="font-mono text-xs text-violet-soft">
                        {pad(focusedIdx + 1)} / {pad(shown.length)} · {categoryLabel(focusedProject.category)}
                      </p>
                      <h3 className="display mt-2 text-[clamp(2rem,5vw,4.5rem)]">{focusedProject.title}</h3>
                      <p className="mt-1 text-sm text-paper/60">
                        {focusedProject.client} · {focusedProject.year}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="pointer-events-auto flex items-center gap-2">
                  <button className="btn-ghost h-12 w-12 justify-center p-0" aria-label="Previous project" onClick={() => scrollToIndex(focusedIdx - 1)}>
                    ←
                  </button>
                  <button className="btn-ghost h-12 w-12 justify-center p-0" aria-label="Next project" onClick={() => scrollToIndex(focusedIdx + 1)}>
                    →
                  </button>
                  {focusedProject && (
                    <TransitionLink href={`/work/${focusedProject.slug}`} transitionLabel={focusedProject.title} className="btn-primary hidden sm:inline-flex">
                      View project
                    </TransitionLink>
                  )}
                </div>
              </div>
            </div>
            <p className="eyebrow pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 text-[10px]">{t.work.dragHint}</p>
          </div>

          {/* Accessible list for screen readers */}
          <ul className="sr-only">
            {shown.map((p) => (
              <li key={p.slug}>
                <a href={`/work/${p.slug}`}>
                  {p.title}, {p.client}, {categoryLabel(p.category)}, {p.year}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="container-x pb-10 pt-14">
          <motion.div layout className="grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
          {!shown.length && <p className="text-paper/50">{t.work.empty}</p>}
        </div>
      )}
    </section>
  );
}
