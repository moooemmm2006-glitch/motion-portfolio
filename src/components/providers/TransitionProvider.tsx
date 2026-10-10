'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { cineInOut } from '@/lib/easing';

type Phase = 'idle' | 'covering' | 'revealing';
const TransitionContext = createContext<(href: string, label?: string) => void>(() => {});
export const usePageTransition = () => useContext(TransitionContext);

/**
 * A "film cut" page transition: a slate wipes over the page, the route changes
 * underneath, then the slate wipes away. Hash links on the same page skip it.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('');
  const pending = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string, nextLabel = '') => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const [path, hash] = href.split('#');
      if (reduced || (path || '/') === pathname) {
        router.push(href);
        if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView(), 50);
        return;
      }
      pending.current = href;
      setLabel(nextLabel);
      setPhase('covering');
    },
    [pathname, router],
  );

  useEffect(() => {
    if (phase !== 'covering') return;
    const t = setTimeout(() => {
      if (pending.current) router.push(pending.current, { scroll: true });
    }, 700);
    return () => clearTimeout(t);
  }, [phase, router]);

  useEffect(() => {
    if (phase === 'covering' && pending.current?.split('#')[0] === pathname) {
      const hash = pending.current.split('#')[1];
      const t = setTimeout(() => {
        const el = hash ? document.getElementById(hash) : null;
        if (el) el.scrollIntoView();
        else window.scrollTo(0, 0);
        setPhase('revealing');
      }, 250);
      return () => clearTimeout(t);
    }
  }, [pathname, phase]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <AnimatePresence onExitComplete={() => setPhase('idle')}>
        {phase === 'covering' && (
          <motion.div
            key="slate"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink"
            initial={{ clipPath: 'inset(0 0 0 100%)' }}
            animate={{ clipPath: 'inset(0 0 0 0%)' }}
            exit={{ clipPath: 'inset(0 100% 0 0)' }}
            transition={{ duration: 0.7, ease: cineInOut }}
            aria-hidden
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-accent-gradient" />
            <motion.p
              className="display text-[clamp(2.5rem,8vw,7rem)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: cineInOut }}
            >
              {label || 'Cut to'}
            </motion.p>
            <span className="eyebrow absolute bottom-8 left-[var(--gutter)]">Scene change</span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
