'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { setSoundEnabled } from '@/lib/sound';

interface UIState {
  loaded: boolean;
  setLoaded: (v: boolean) => void;
  showreelOpen: boolean;
  openShowreel: () => void;
  closeShowreel: () => void;
  sound: boolean;
  toggleSound: () => void;
}

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [sound, setSound] = useState(false);

  const toggleSound = useCallback(() => {
    setSound((s) => {
      setSoundEnabled(!s);
      return !s;
    });
  }, []);

  const value = useMemo(
    () => ({
      loaded,
      setLoaded,
      showreelOpen,
      openShowreel: () => setShowreelOpen(true),
      closeShowreel: () => setShowreelOpen(false),
      sound,
      toggleSound,
    }),
    [loaded, showreelOpen, sound, toggleSound],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
