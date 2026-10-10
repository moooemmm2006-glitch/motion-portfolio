'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ar, en, type Dictionary } from '@/data/dictionary';
import { arContent } from '@/data/content.ar';
import { categories as baseCategories } from '@/data/categories';
import { site } from '@/data/site';
import { services as baseServices } from '@/data/services';
import type { Category, Project } from '@/data/types';

export type Lang = 'en' | 'ar';
const STORAGE_KEY = 'lang';

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dictionary;
}

const LangContext = createContext<LangState | null>(null);

function applyToDocument(lang: Lang) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

export function LangProvider({ children }: { children: ReactNode }) {
  // Static pages render in English; the saved choice is applied right after hydration
  // (behind the intro screen, so there is no visible flash).
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {}
    if (saved === 'ar' || saved === 'en') setLangState(saved);
  }, []);

  useEffect(() => applyToDocument(lang), [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: lang === 'ar' ? ar : en }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}

/** Site copy, services, categories and projects in the active language. */
export function useContent() {
  const { lang } = useLang();
  return useMemo(() => {
    const isAr = lang === 'ar';
    const profile = isAr ? arContent.profile : { title: site.title, specialty: site.specialty, tagline: site.tagline, bio: site.bio as readonly string[], availability: site.availability };
    const stats = site.stats.map((s) => ({ ...s, label: (isAr && arContent.stats[s.label]) || s.label }));
    const services = baseServices.map((s) => ({ ...s, ...(isAr ? arContent.services[s.title] : null) }));
    const categories = baseCategories.map((c) => ({ ...c, label: (isAr && arContent.categories[c.id]) || c.label }));
    const categoryLabel = (id: Category) => categories.find((c) => c.id === id)?.label ?? id;
    const project = (p: Project): Project => {
      const tr = isAr ? arContent.projects[p.slug] : undefined;
      if (!tr) return p;
      const { gallery, ...text } = tr;
      return { ...p, ...text, gallery: p.gallery.map((g, i) => ({ ...g, alt: gallery[i] ?? g.alt })) };
    };
    const projectType = (v: string) => (isAr && arContent.projectTypes[v]) || v;
    const budget = (v: string) => (isAr && arContent.budgets[v]) || v;
    return { profile, stats, services, categories, categoryLabel, project, projectType, budget };
  }, [lang]);
}
