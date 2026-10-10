'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { onCursorLabel } from '@/lib/cursor';

const IDLE = 22;
const LABEL_W = 112;
const LABEL_H = 63; // 16:9, like a frame
const PAD = 8;
const SPRING = { stiffness: 380, damping: 32, mass: 0.5 };

/** 25 fps timecode from elapsed seconds. */
const timecode = (s: number) => {
  const f = Math.floor(s * 25);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(f / 90000) % 60)}:${pad(Math.floor(f / 1500) % 60)}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`;
};

/**
 * Viewfinder cursor: four crop marks around a centre dot. Over links and buttons
 * the marks snap to the element's edges, like selecting a layer; over media
 * (data-cursor="LABEL" or a 3D mesh) they open into a 16:9 frame with the label.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [glLabel, setGlLabel] = useState<string | null>(null);
  const [snapped, setSnapped] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);
  const tc = useRef<HTMLSpanElement>(null);

  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  const cx = useSpring(px, SPRING);
  const cy = useSpring(py, SPRING);
  const w = useSpring(IDLE, SPRING);
  const h = useSpring(IDLE, SPRING);
  const left = useTransform(() => cx.get() - w.get() / 2);
  const top = useTransform(() => cy.get() - h.get() / 2);

  const state = useRef({ snapEl: null as HTMLElement | null, label: null as string | null, gl: null as string | null, x: -100, y: -100 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');
    const s = state.current;

    const layout = () => {
      const text = s.gl ?? s.label;
      if (text) {
        px.set(s.x);
        py.set(s.y);
        w.set(LABEL_W);
        h.set(LABEL_H);
      } else if (s.snapEl) {
        const r = s.snapEl.getBoundingClientRect();
        px.set(r.left + r.width / 2);
        py.set(r.top + r.height / 2);
        w.set(r.width + PAD * 2);
        h.set(r.height + PAD * 2);
      } else {
        px.set(s.x);
        py.set(s.y);
        w.set(IDLE);
        h.set(IDLE);
      }
    };

    const move = (e: PointerEvent) => {
      s.x = e.clientX;
      s.y = e.clientY;
      setVisible(true);
      const el = e.target as HTMLElement | null;
      const labelled = el?.closest<HTMLElement>('[data-cursor]');
      const interactive = el?.closest<HTMLElement>('a, button, [role="button"], input, textarea, select, label');
      // compact controls get the snap (their own text is the label); big media get the 16:9 label frame
      const r = interactive?.getBoundingClientRect();
      s.snapEl = interactive && r && r.width < 420 && r.height < 120 ? interactive : null;
      s.label = s.snapEl ? null : (labelled?.dataset.cursor ?? null);
      setLabel(s.label);
      setSnapped(!!s.snapEl);
      layout();
    };
    const leave = () => setVisible(false);
    const pd = () => setDown(true);
    const pu = () => setDown(false);
    const onScroll = () => s.snapEl && layout();
    const off = onCursorLabel((l) => {
      s.gl = l;
      setGlLabel(l);
      layout();
    });

    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      if (tc.current) tc.current.textContent = timecode((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', pd);
    window.addEventListener('pointerup', pu);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointerup', pu);
      document.documentElement.classList.remove('has-custom-cursor');
      off();
    };
  }, [px, py, w, h]);

  if (!enabled) return null;
  const text = glLabel ?? label;
  const arm = text ? 14 : snapped ? 10 : 7;
  const corner = 'absolute border-paper transition-[width,height] duration-300';

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div className="absolute left-0 top-0" style={{ x: left, y: top, width: w, height: h }}>
        <motion.div className="absolute inset-0" animate={{ scale: down ? 0.88 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 24 }}>
          <span className={`${corner} left-0 top-0 border-l-[1.5px] border-t-[1.5px]`} style={{ width: arm, height: arm }} />
          <span className={`${corner} right-0 top-0 border-r-[1.5px] border-t-[1.5px]`} style={{ width: arm, height: arm }} />
          <span className={`${corner} bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]`} style={{ width: arm, height: arm }} />
          <span className={`${corner} bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]`} style={{ width: arm, height: arm }} />
          {text && (
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold tracking-[0.25em] text-paper">
              <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF3D3D]" />
              {text}
            </span>
          )}
        </motion.div>
        <span
          ref={tc}
          className="absolute -bottom-5 left-full -translate-x-full whitespace-nowrap font-mono text-[9px] tracking-[0.15em] text-paper/60 transition-opacity duration-300"
          style={{ opacity: snapped ? 0 : 1 }}
        />
      </motion.div>
      {/* the real pointer position, no lag */}
      <motion.div className="absolute left-0 top-0" style={{ x: px, y: py }}>
        <div
          className="h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper transition-opacity"
          style={{ opacity: text || snapped ? 0 : 1 }}
        />
      </motion.div>
    </div>
  );
}
