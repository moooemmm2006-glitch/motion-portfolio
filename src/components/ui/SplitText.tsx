'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  text: string;
  as?: 'span' | 'div' | 'p';
  className?: string;
  /** Classes for each animated piece (e.g. a text gradient). */
  pieceClassName?: string;
  by?: 'chars' | 'words';
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view (default) or immediately when `play` turns true. */
  trigger?: 'scroll' | 'manual';
  play?: boolean;
}

/**
 * Lightweight SplitText replacement. Screen readers get the full string via aria-label;
 * the animated spans are aria-hidden.
 */
export function SplitText({ text, as = 'span', className, pieceClassName, by = 'words', delay = 0, stagger, trigger = 'scroll', play = true }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-split]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { yPercent: 0, opacity: 1, rotate: 0 });
      return;
    }
    gsap.set(targets, { yPercent: 110, opacity: 0, rotate: by === 'chars' ? 6 : 2 });
    if (trigger === 'manual' && !play) return;
    const tween = gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      rotate: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: stagger ?? (by === 'chars' ? 0.025 : 0.06),
      delay,
      scrollTrigger: trigger === 'scroll' ? { trigger: el, start: 'top 88%', once: true } : undefined,
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [by, delay, stagger, trigger, play, text]);

  const words = text.split(' ');
  const Tag = as as 'span';
  return (
    <Tag ref={ref as React.RefObject<HTMLSpanElement>} className={cn('inline-block', className)} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-top">
          {by === 'words' ? (
            <span data-split className={cn('inline-block will-change-transform', pieceClassName)}>
              {word}
            </span>
          ) : (
            word.split('').map((ch, ci) => (
              <span key={ci} data-split className={cn('inline-block will-change-transform', pieceClassName)}>
                {ch}
              </span>
            ))
          )}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
