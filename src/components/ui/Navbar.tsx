'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { nav, openWhatsApp, site, whatsappUrl } from '@/data/site';
import { useUI } from '@/components/providers/UIProvider';
import { useLang } from '@/components/providers/LangProvider';
import { useLenis } from '@/components/providers/SmoothScroll';
import { cineInOut, expoOut } from '@/lib/easing';
import { cn } from '@/lib/utils';
import { Magnetic } from './Magnetic';
import { TransitionLink } from './TransitionLink';
import { WhatsAppIcon, SocialIcons, WhatsAppLink } from './Brand';

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { sound, toggleSound } = useUI();
  const { t, lang, setLang } = useLang();
  // the menu opens from the burger's corner, which flips sides in Arabic
  const menuX = lang === 'ar' ? '0%' : '100%';
  const lenis = useLenis();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 160);
      setScrolled(y > 40);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open, lenis]);

  return (
    <>
      <motion.header
        className={cn(
          'fixed inset-x-0 top-0 z-[70] transition-colors duration-500',
          scrolled && !open ? 'bg-ink/60 backdrop-blur-md' : 'bg-transparent',
        )}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.6, ease: expoOut }}
      >
        <nav className="container-x flex h-20 items-center justify-between" aria-label="Main">
          <TransitionLink href="/" dir="ltr" className="font-display text-lg font-bold tracking-tight" transitionLabel="Home">
            {site.name}
            <span className="text-violet-soft">.</span>
          </TransitionLink>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Magnetic strength={0.25}>
                  <TransitionLink
                    href={item.href}
                    className="group relative block px-4 py-2 text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {t.nav[item.href] ?? item.label}
                    <span className="absolute inset-x-4 bottom-1 h-px origin-left rtl:origin-right scale-x-0 bg-violet-soft transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
                  </TransitionLink>
                </Magnetic>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              aria-pressed={sound}
              aria-label={sound ? 'Turn interface sounds off' : 'Turn interface sounds on'}
              className="flex h-10 items-center gap-[3px] rounded-full px-3"
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="w-[2px] rounded-full bg-paper"
                  animate={{ height: sound ? [4, 14, 6, 12, 4] : 4 }}
                  transition={{ duration: 1, repeat: sound ? Infinity : 0, delay: i * 0.12 }}
                />
              ))}
            </button>
            <LangSwitch lang={lang} onChange={setLang} />
            <Magnetic className="hidden md:inline-block">
              <a href={whatsappUrl(t.waGreeting)} onClick={(e) => openWhatsApp(t.waGreeting) && e.preventDefault()} target="_blank" rel="noreferrer" className="btn-primary gap-2">
                <WhatsAppIcon className="text-[#25D366]" />
                {t.letsTalk}
              </a>
            </Magnetic>
            <button
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.menu.close : t.menu.open}
            >
              <motion.span className="h-px w-6 bg-paper" animate={{ rotate: open ? 45 : 0, y: open ? 3.5 : 0 }} />
              <motion.span className="h-px w-6 bg-paper" animate={{ rotate: open ? -45 : 0, y: open ? -3.5 : 0 }} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[65] flex flex-col justify-between bg-ink px-[var(--gutter)] pb-10 pt-28"
            initial={{ clipPath: `circle(0% at ${menuX} 0%)` }}
            animate={{ clipPath: `circle(150% at ${menuX} 0%)` }}
            exit={{ clipPath: `circle(0% at ${menuX} 0%)` }}
            transition={{ duration: 0.8, ease: cineInOut }}
          >
            <ul className="space-y-2">
              {nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: expoOut }}
                  >
                    <TransitionLink
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="display flex items-baseline gap-4 text-6xl"
                    >
                      <span className="font-mono text-xs text-violet-soft">0{i + 1}</span>
                      {t.nav[item.href] ?? item.label}
                    </TransitionLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <WhatsAppLink className="mb-6 text-lg text-paper" />
            <SocialIcons />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** EN | ع segmented switch; the pill slides to the active language. */
function LangSwitch({ lang, onChange }: { lang: 'en' | 'ar'; onChange: (l: 'en' | 'ar') => void }) {
  const options = [
    { id: 'en', label: 'EN', name: 'English' },
    { id: 'ar', label: 'ع', name: 'العربية' },
  ] as const;
  return (
    <div dir="ltr" role="group" aria-label="Language" className="flex h-10 items-center rounded-full border border-white/15 bg-white/[0.04] p-1 backdrop-blur">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          aria-pressed={lang === o.id}
          aria-label={o.name}
          lang={o.id}
          className={cn(
            'relative flex h-8 min-w-9 items-center justify-center rounded-full px-3 text-xs font-medium transition-colors duration-300',
            lang === o.id ? 'text-ink' : 'text-paper/60 hover:text-paper',
            o.id === 'ar' && 'font-display text-sm',
          )}
        >
          {lang === o.id && <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ duration: 0.5, ease: expoOut }} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
