'use client';

import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { usePageTransition } from '@/components/providers/TransitionProvider';
import { blip } from '@/lib/sound';

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { children: ReactNode; transitionLabel?: string };

/** next/link that plays the film-cut transition on route changes. */
export function TransitionLink({ href, children, transitionLabel, onClick, ...rest }: Props) {
  const navigate = usePageTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    blip(660);
    navigate(href.toString(), transitionLabel);
  };
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
