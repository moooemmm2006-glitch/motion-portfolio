'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { site } from '@/data/site';
import { t } from '@/data/dictionary';
import { useCanUse3D } from '@/hooks/useCanUse3D';
import { useInView } from '@/hooks/useInView';
import { Counter } from '@/components/ui/Counter';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { expoOut } from '@/lib/easing';

const PortraitScene = dynamic(() => import('@/components/three/PortraitScene'), { ssr: false });

export function About() {
  const can3D = useCanUse3D();
  const portraitRef = useRef<HTMLDivElement>(null);
  const near = useInView(portraitRef, '200px');

  return (
    <section id="about" className="relative py-28 md:py-40" aria-labelledby="about-title">
      <div className="container-x">
        <SectionHeading id="about-title" index="01" eyebrow={t.about.eyebrow} title={t.about.heading} />

        <div className="grid items-center gap-16 lg:grid-cols-[5fr_6fr]">
          <div ref={portraitRef} className="relative aspect-[4/5] w-full max-w-md" data-cursor="HELLO">
            <div className="absolute -inset-6 rounded-[2rem] bg-accent-gradient opacity-20 blur-3xl" />
            {can3D && near ? (
              <div className="absolute inset-0">
                <PortraitScene src={site.portrait} active={near} />
              </div>
            ) : (
              <Image src={site.portrait} alt={`Portrait of ${site.name}`} fill sizes="(max-width: 1024px) 90vw, 40vw" className="rounded-2xl object-cover" />
            )}
            <span className="sr-only">{`Portrait of ${site.name}`}</span>
          </div>

          <div>
            {site.bio.map((p, i) => (
              <motion.p
                key={i}
                className={i === 0 ? 'text-xl leading-relaxed text-paper md:text-2xl' : 'mt-6 leading-relaxed text-paper/60'}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1.2, ease: expoOut, delay: i * 0.1 }}
              >
                {p}
              </motion.p>
            ))}

            <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-4">
              {site.stats.map((s) => (
                <div key={s.label} className="bg-ink p-6">
                  <dt className="eyebrow text-[10px]">{s.label}</dt>
                  <dd className="display mt-3 text-5xl text-paper">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Toolkit: icons floating in 3D */}
        <div className="mt-24">
          <p className="eyebrow mb-8">{t.about.tools}</p>
          <ul className="flex flex-wrap gap-4 [perspective:800px]">
            {site.tools.map((tool, i) => (
              <motion.li
                key={tool.name}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-3 pr-6 [transform-style:preserve-3d]"
                initial={{ opacity: 0, rotateX: -60, y: 30 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: expoOut, delay: i * 0.06 }}
                whileHover={{ rotateY: 12, rotateX: -8, z: 30 }}
              >
                <motion.span
                  className="flex h-12 w-12 items-center justify-center rounded-xl border font-display text-lg font-bold"
                  style={{
                    color: tool.color,
                    borderColor: `${tool.color}55`,
                    background: `linear-gradient(145deg, ${tool.color}22, transparent)`,
                    boxShadow: 'main' in tool && tool.main ? `0 0 40px ${tool.color}66` : undefined,
                  }}
                  animate={{ rotateY: [0, 10, 0, -10, 0], y: [0, -3, 0, 3, 0] }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {tool.short}
                </motion.span>
                <span>
                  <span className="block text-sm font-medium">{tool.name}</span>
                  {'main' in tool && tool.main && <span className="font-mono text-[10px] uppercase tracking-widest text-violet-soft">Main tool</span>}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
