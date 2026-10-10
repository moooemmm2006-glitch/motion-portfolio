'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { services } from '@/data/services';
import { t } from '@/data/dictionary';
import type { Service } from '@/data/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { expoOut } from '@/lib/easing';
import { pad } from '@/lib/utils';

const icons: Record<Service['icon'], React.ReactNode> = {
  edit: <path d="M4 7h16M4 12h10M4 17h13M18 10l3 2-3 2" />,
  motion: <path d="M3 17c4-10 8-10 9 0s5 10 9 0" />,
  logo: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5" />,
  social: <path d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z M10 9l5 3-5 3z" />,
  ads: <path d="M3 10v4h3l6 4V6L6 10H3z M16 9a4 4 0 010 6 M18.5 6.5a8 8 0 010 11" />,
  color: <path d="M12 3a9 9 0 100 18c1 0 1.5-.8 1.5-1.5 0-1-.8-1.2-.8-2 0-.8.7-1.5 1.5-1.5H17a4 4 0 004-4c0-5-4-9-9-9z M7.5 11.5h.01 M10 7.5h.01 M14.5 7.5h.01" />,
  vfx: <path d="M12 2v4 M12 18v4 M2 12h4 M18 12h4 M5 5l3 3 M16 16l3 3 M5 19l3-3 M16 8l3-3 M12 9a3 3 0 100 6 3 3 0 000-6z" />,
};

function ServiceCard({ service, i }: { service: Service; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 150, damping: 15 });
  const glareX = useTransform(mx, (v) => `${v * 100}%`);
  const glareY = useTransform(my, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(500px circle at ${glareX} ${glareY}, rgba(153,153,255,0.18), transparent 45%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 35 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, ease: expoOut, delay: (i % 3) * 0.08 }}
      className="[perspective:1000px]"
      style={{ transformPerspective: 1000 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        ref={ref}
        className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 [transform-style:preserve-3d]"
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return;
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
      >
        {/* light reflection */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glare }}
        />
        <div className="flex items-start justify-between [transform:translateZ(40px)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gradient text-ink transition-transform duration-700 ease-out-expo group-hover:rotate-[-8deg] group-hover:scale-110">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {icons[service.icon]}
            </svg>
          </span>
          <span className="font-mono text-xs text-paper/30">{pad(i + 1)}</span>
        </div>
        <h3 className="mt-10 font-display text-2xl tracking-tight [transform:translateZ(30px)]">{service.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-paper/60 [transform:translateZ(20px)]">{service.description}</p>
      </motion.div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="relative py-28 md:py-40" aria-labelledby="services-title">
      <div className="container-x">
        <SectionHeading id="services-title" index="03" eyebrow={t.services.eyebrow} title={t.services.heading} />
        {/* Six-column grid so a short last row (3 + 2) sits centered. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((s, i) => (
            <div key={s.title} className={`lg:col-span-2 ${services.length % 3 === 2 && i === services.length - 2 ? 'lg:col-start-2' : ''}`}>
              <ServiceCard service={s} i={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
