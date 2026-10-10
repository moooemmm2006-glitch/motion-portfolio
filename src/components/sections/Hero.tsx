'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';
import { t } from '@/data/dictionary';
import { useUI } from '@/components/providers/UIProvider';
import { useCanUse3D } from '@/hooks/useCanUse3D';
import { useIsMobile } from '@/hooks/useReducedMotion';
import { Magnetic } from '@/components/ui/Magnetic';
import { SplitText } from '@/components/ui/SplitText';
import { expoOut } from '@/lib/easing';
import { blip } from '@/lib/sound';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export function Hero() {
  const { loaded, openShowreel } = useUI();
  const can3D = useCanUse3D();
  const mobile = useIsMobile();
  const section = useRef<HTMLElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
        setActive(self.progress < 0.999);
        if (canvasWrap.current) {
          canvasWrap.current.style.opacity = String(1 - Math.max(0, self.progress - 0.35) * 1.6);
          canvasWrap.current.style.filter = `blur(${Math.max(0, self.progress - 0.5) * 20}px)`;
        }
        if (content.current) {
          content.current.style.transform = `translate3d(0, ${self.progress * -120}px, 0)`;
          content.current.style.opacity = String(1 - self.progress * 1.5);
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={section} id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden" aria-label="Intro">
      {/* Background: 3D scene, or a static cinematic poster as fallback */}
      <div ref={canvasWrap} className="absolute inset-0">
        {can3D ? (
          <HeroScene progress={progress} active={active} mobile={mobile} />
        ) : (
          <div className="absolute inset-0">
            <Image src={site.showreel.poster ?? '/posters/showreel.jpg'} alt="" fill priority sizes="100vw" className="object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div ref={content} className="container-x pointer-events-none relative flex h-full flex-col justify-end pb-28 md:justify-center md:pb-0">
        <motion.p
          className="eyebrow mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: expoOut, delay: 0.1 }}
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ember" />
          {site.availability}
        </motion.p>

        <h1 className="display max-w-[12ch] text-[clamp(3.5rem,11vw,11rem)]">
          <SplitText text={site.name} by="chars" trigger="manual" play={loaded} delay={0.15} className="block" />
        </h1>
        <p className="mt-4 max-w-xl font-display text-[clamp(1.25rem,2.4vw,2rem)] leading-tight tracking-tight">
          <SplitText text={site.title} trigger="manual" play={loaded} delay={0.5} className="block" />
          <SplitText text={`— ${site.specialty}`} trigger="manual" play={loaded} delay={0.65} pieceClassName="text-gradient" className="block" />
        </p>
        <motion.p
          className="mt-6 max-w-md text-paper/60"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1.2 }}
        >
          {site.tagline}
        </motion.p>

        <motion.div
          className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 1.2, ease: expoOut }}
        >
          <Magnetic>
            <button
              className="btn-primary group py-4 pl-4 pr-7"
              data-cursor="PLAY"
              onClick={() => {
                blip(520);
                openShowreel();
              }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 ease-out-expo group-hover:scale-110">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </span>
              {t.hero.play}
            </button>
          </Magnetic>
          <span className="font-mono text-xs text-paper/40">{site.location}</span>
        </motion.div>
      </div>

      {/* Scroll indicator styled as a timeline playhead */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8">
        <div className="container-x flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">
          <span>00:00</span>
          <div className="relative h-5 flex-1">
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
            <div className="absolute inset-x-0 top-0 flex justify-between">
              {Array.from({ length: 41 }).map((_, i) => (
                <span key={i} className={i % 5 === 0 ? 'h-2 w-px bg-white/30' : 'h-1 w-px bg-white/15'} />
              ))}
            </div>
            <motion.div
              className="absolute top-0 h-5 w-px bg-ember"
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
            >
              <span className="absolute -left-[4px] -top-1 h-0 w-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-ember" />
            </motion.div>
          </div>
          <span>{t.hero.scroll}</span>
        </div>
      </div>
    </section>
  );
}
