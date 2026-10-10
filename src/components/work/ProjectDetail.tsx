'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Project } from '@/data/types';
import { categoryLabel } from '@/data/categories';
import { t } from '@/data/dictionary';
import { BeforeAfter } from '@/components/ui/BeforeAfter';
import { Magnetic } from '@/components/ui/Magnetic';
import { SplitText } from '@/components/ui/SplitText';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { expoOut } from '@/lib/easing';

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' },
  transition: { duration: 1.1, ease: expoOut },
} as const;

export function ProjectDetail({ project, prev, next }: { project: Project; prev: Project; next: Project }) {
  const info: [string, string][] = [
    ['Client', project.client],
    ['Role', project.role],
    ['Year', String(project.year)],
    ['Duration', project.duration],
    ['Tools', project.tools.join(', ')],
    ['Deliverables', project.deliverables.join(', ')],
  ];

  return (
    <article className="pb-20 pt-32 md:pt-40">
      <div className="container-x">
        <TransitionLink href="/#work" className="eyebrow inline-flex items-center gap-2 hover:text-paper" transitionLabel="Work">
          ← {t.project.back}
        </TransitionLink>
        <p className="eyebrow mt-10 text-violet-soft">
          {categoryLabel(project.category)} · {project.year}
        </p>
        <h1 className="display mt-4 text-[clamp(3rem,12vw,11rem)]">
          <SplitText text={project.title} by="chars" trigger="manual" play delay={0.3} />
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-paper/70">{project.summary}</p>
      </div>

      <motion.div className="mt-14 px-0 md:px-[var(--gutter)]" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: expoOut, delay: 0.4 }}>
        <VideoPlayer source={project.video} title={project.title} className="md:rounded-2xl" />
      </motion.div>

      <div className="container-x">
        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3 lg:grid-cols-6">
          {info.map(([k, v]) => (
            <div key={k} className="bg-ink p-5">
              <dt className="eyebrow text-[10px]">{k}</dt>
              <dd className="mt-2 text-sm">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-28 grid gap-14 md:grid-cols-3">
          {(
            [
              [t.project.challenge, project.challenge],
              [t.project.approach, project.approach],
              [t.project.result, project.result],
            ] as const
          ).map(([title, text], i) => (
            <motion.section key={title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
              <p className="font-mono text-xs text-violet-soft">0{i + 1}</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight">{title}</h2>
              <p className="mt-4 leading-relaxed text-paper/60">{text}</p>
            </motion.section>
          ))}
        </div>

        {project.beforeAfter && (
          <motion.section className="mt-28" {...reveal}>
            <h2 className="eyebrow mb-6">{t.project.beforeAfter}</h2>
            <BeforeAfter before={project.beforeAfter.before} after={project.beforeAfter.after} alt={project.title} />
          </motion.section>
        )}

        <section className="mt-28">
          <h2 className="eyebrow mb-6">{t.project.bts}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {project.gallery.map((g, i) => (
              <motion.div key={g.src} className="relative aspect-video overflow-hidden rounded-xl" {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
                <Image src={g.src} alt={g.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-1000 ease-out-expo hover:scale-105" />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Next / previous */}
      <nav className="container-x mt-32 grid gap-4 md:grid-cols-2" aria-label="More projects">
        {[
          { p: prev, label: t.project.prev, align: 'text-left' },
          { p: next, label: t.project.next, align: 'md:text-right' },
        ].map(({ p, label, align }) => (
          <TransitionLink
            key={label}
            href={`/work/${p.slug}`}
            transitionLabel={p.title}
            className={`group relative block overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 ${align}`}
            data-cursor="VIEW"
          >
            <Image src={p.poster} alt="" fill sizes="50vw" className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-40" />
            <span className="eyebrow relative">{label}</span>
            <span className="display relative mt-4 block text-[clamp(2rem,5vw,4rem)]">{p.title}</span>
          </TransitionLink>
        ))}
      </nav>
      <div className="container-x mt-16 flex justify-center">
        <Magnetic>
          <TransitionLink href="/#contact" className="btn-primary px-8 py-4" transitionLabel="Contact">
            Start a project →
          </TransitionLink>
        </Magnetic>
      </div>
    </article>
  );
}
