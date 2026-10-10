'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { onCursorLabel } from '@/lib/cursor';

/** Dot + ring cursor. Any element with data-cursor="LABEL" grows the ring and shows the label. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [glLabel, setGlLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor], a, button, [role="button"], input, textarea, select');
      setLabel(target?.dataset.cursor ?? null);
      setHovering(!!target);
    };
    const leave = () => setVisible(false);
    const pd = () => setDown(true);
    const pu = () => setDown(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', pd);
    window.addEventListener('pointerup', pu);
    const off = onCursorLabel(setGlLabel);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointerup', pu);
      document.documentElement.classList.remove('has-custom-cursor');
      off();
    };
  }, [x, y]);

  if (!enabled) return null;
  const text = glLabel ?? label;
  const size = text ? 88 : hovering ? 48 : 32;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/60 font-mono text-[10px] font-semibold tracking-[0.2em] text-ink"
          animate={{
            width: size,
            height: size,
            backgroundColor: text ? 'rgba(242,242,242,1)' : 'rgba(242,242,242,0)',
            scale: down ? 0.85 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          {text}
        </motion.div>
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper mix-blend-difference" />
      </motion.div>
    </div>
  );
}
