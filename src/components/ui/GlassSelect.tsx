'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { expoOut } from '@/lib/easing';
import { cn } from '@/lib/utils';

interface Props {
  id: string;
  value: string | undefined;
  onChange: (v: string) => void;
  onBlur?: () => void;
  options: readonly { value: string; label: string }[];
  placeholder: string;
  invalid?: boolean;
  className?: string;
}

/** Dropdown styled like the rest of the site (the native <select> list can't be styled). */
export function GlassSelect({ id, value, onChange, onBlur, options, placeholder, invalid, className }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, onBlur]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    onBlur?.();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === 'ArrowDown') setActive((a) => Math.min(options.length - 1, a + 1));
    else if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1));
    else if (e.key === 'Enter' || e.key === ' ') pick(active);
    else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false);
    else return;
    if (e.key !== 'Tab') e.preventDefault();
  };

  return (
    <div ref={root} className={cn('relative', open && 'z-40')}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
        className={cn(className, 'flex items-center justify-between gap-3 text-start', open && 'border-violet-soft/70 bg-white/[0.05]')}
      >
        <span className={selected ? 'text-paper' : 'text-paper/30'}>{selected?.label ?? placeholder}</span>
        <motion.svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-paper/50"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.4, ease: expoOut }}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 origin-top overflow-auto rounded-2xl border border-white/10 bg-[#1a1530]/95 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.35, ease: expoOut }}
          >
            {options.map((o, i) => {
              const isSel = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSel}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => pick(i)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors duration-200',
                    i === active ? 'bg-white/10 text-paper' : 'text-paper/70',
                  )}
                >
                  {o.label}
                  {isSel && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-violet-soft" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
