'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

export function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-video w-full touch-pan-y select-none overflow-hidden rounded-xl"
      data-cursor="DRAG"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
    >
      <Image src={after} alt={`${alt} (final)`} fill sizes="(max-width: 1024px) 100vw, 80vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`${alt} (raw footage)`} fill sizes="(max-width: 1024px) 100vw, 80vw" className="object-cover" />
      </div>
      <span className="eyebrow absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-paper">Raw</span>
      <span className="eyebrow absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-paper">Final</span>
      <div className="absolute inset-y-0 w-px bg-paper" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper font-mono text-xs text-ink">
          ⟷
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="sr-only"
        aria-label="Compare raw and final"
      />
    </div>
  );
}
