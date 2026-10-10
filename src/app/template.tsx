'use client';

import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cineInOut } from '@/lib/easing';

/**
 * Re-mounts on every navigation: the new page fades up like the start of a new shot.
 * Opacity only, so scroll-trigger measurements are never skewed by a transform.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: cineInOut }}
      onAnimationComplete={() => ScrollTrigger.refresh()}
    >
      {children}
    </motion.div>
  );
}
