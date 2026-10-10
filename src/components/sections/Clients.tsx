'use client';

import Image from 'next/image';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useState } from 'react';
import { testimonials } from '@/data/testimonials';
import { t } from '@/data/dictionary';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { expoOut } from '@/lib/easing';

function Testimonials() {
  const [order, setOrder] = useState(testimonials.map((_, i) => i));
  const next = () => setOrder((o) => [...o.slice(1), o[0]]);
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) next();
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <p className="eyebrow mb-4">{t.clients.testimonials}</p>
        <p className="display text-[clamp(2rem,4vw,3.5rem)]">Notes from the review room.</p>
        <div className="mt-8 flex gap-2">
          <button className="btn-ghost h-12 w-12 justify-center p-0" onClick={prev} aria-label="Previous testimonial">
            ←
          </button>
          <button className="btn-ghost h-12 w-12 justify-center p-0" onClick={next} aria-label="Next testimonial">
            →
          </button>
        </div>
      </div>

      <div className="relative h-[380px] [perspective:1200px] md:h-[340px]" aria-live="polite">
        <AnimatePresence initial={false}>
          {order.slice(0, 3).map((ti, depth) => {
            const item = testimonials[ti];
            const top = depth === 0;
            return (
              <motion.figure
                key={ti}
                className="absolute inset-0 flex cursor-grab flex-col justify-between rounded-3xl border border-white/10 bg-[#121216] p-8 shadow-2xl active:cursor-grabbing md:p-10"
                style={{ zIndex: 10 - depth, transformStyle: 'preserve-3d' }}
                initial={{ opacity: 0, y: 60, scale: 0.85 }}
                animate={{ opacity: 1 - depth * 0.3, y: depth * -22, scale: 1 - depth * 0.06, rotateX: depth * 6, z: -depth * 60 }}
                exit={{ opacity: 0, x: 300, rotateZ: 12, transition: { duration: 0.5 } }}
                transition={{ duration: 0.8, ease: expoOut }}
                drag={top ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={top ? onDragEnd : undefined}
                data-cursor={top ? 'DRAG' : undefined}
                aria-hidden={!top}
              >
                <blockquote className="text-lg leading-relaxed md:text-2xl">“{item.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <Image src={item.avatar} alt="" width={48} height={48} className="rounded-full" />
                  <span>
                    <span className="block font-medium">{item.name}</span>
                    <span className="block text-sm text-paper/50">
                      {item.role}, {item.company}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Clients() {
  return (
    <section id="clients" className="relative overflow-hidden py-28 md:py-40" aria-labelledby="clients-title">
      <div className="container-x">
        <SectionHeading id="clients-title" index="03" eyebrow={t.clients.eyebrow} title={t.clients.heading} />
      </div>

      <div className="container-x mt-8">
        <Testimonials />
      </div>
    </section>
  );
}
