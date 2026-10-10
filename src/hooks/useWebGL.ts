'use client';
import { useEffect, useState } from 'react';
import { hasWebGL } from '@/lib/webgl';

/** null while unknown (SSR / first paint), then true/false. */
export function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => setOk(hasWebGL()), []);
  return ok;
}
