'use client';
import { useReducedMotion } from './useReducedMotion';
import { useWebGL } from './useWebGL';

/** 3D only when WebGL exists and the user hasn't asked for reduced motion. */
export function useCanUse3D() {
  const webgl = useWebGL();
  const reduced = useReducedMotion();
  return webgl === true && !reduced;
}
