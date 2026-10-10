'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { creatorPhone, nav, openWhatsApp, site, whatsappUrl } from '@/data/site';
import { useContent, useLang } from '@/components/providers/LangProvider';
import { useScrollTo } from '@/components/providers/SmoothScroll';
import { Magnetic } from './Magnetic';
import { TransitionLink } from './TransitionLink';
import { SocialIcons, WhatsAppLink } from './Brand';

export function Footer() {
  const scrollTo = useScrollTo();
  const { t } = useLang();
  const { profile } = useContent();
  const [rewinding, setRewinding] = useState(false);

  return (
    <footer className="relative border-t hairline pb-24 pt-20 md:pb-10">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="display text-[clamp(2.5rem,6vw,5rem)]">{site.name}</p>
            <p className="mt-3 max-w-sm text-paper/60">
              {profile.title} · {profile.specialty}
            </p>
            <WhatsAppLink className="mt-6 text-lg text-paper hover:text-[#25D366]" />
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-4">{t.footer.menu}</p>
            <ul className="space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <TransitionLink href={n.href} className="text-paper/70 hover:text-paper">
                    {t.nav[n.href] ?? n.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-4">{t.footer.connect}</p>
            <SocialIcons />
          </div>
        </div>

        {/* Back to top = rewind the timeline */}
        <div className="mt-20 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Magnetic>
            <button
              onClick={() => {
                setRewinding(true);
                scrollTo(0);
                setTimeout(() => setRewinding(false), 1600);
              }}
              className="group flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-paper/70 hover:text-paper"
              data-cursor="REWIND"
            >
              <span className="relative h-8 w-48 overflow-hidden rounded border hairline">
                <span className="absolute inset-0 flex justify-between px-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} className={i % 4 === 0 ? 'mt-0 h-3 w-px bg-white/40' : 'mt-0 h-1.5 w-px bg-white/20'} />
                  ))}
                </span>
                <motion.span
                  className="absolute inset-y-0 w-px bg-ember"
                  initial={false}
                  animate={{ left: rewinding ? '2%' : '92%' }}
                  transition={{ duration: rewinding ? 1.4 : 0.6, ease: [0.83, 0, 0.17, 1] }}
                />
              </span>
              ◀◀ {t.footer.top}
            </button>
          </Magnetic>
          <p className="text-xs text-paper/40">
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t hairline pt-8">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/25 rtl:bg-gradient-to-l" aria-hidden />
          <p className="flex items-baseline gap-2.5 text-center">
            <span className="text-[0.7rem] uppercase tracking-[0.3em] text-paper/45 rtl:text-xs rtl:normal-case rtl:tracking-normal">
              {t.footer.credit}
            </span>
            <span className="text-gradient font-display text-base font-semibold tracking-wide rtl:tracking-normal">{t.footer.creator}</span>
          </p>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/25 rtl:bg-gradient-to-r" aria-hidden />
        </div>
          <a
            href={whatsappUrl(t.footer.creatorMsg, creatorPhone)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (openWhatsApp(t.footer.creatorMsg, creatorPhone)) e.preventDefault();
            }}
            className="group mt-1 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] py-2 pe-3 ps-4 text-[0.7rem] uppercase tracking-[0.25em] text-paper/75 backdrop-blur transition-all duration-300 hover:border-violet-soft/60 hover:bg-white/[0.07] hover:text-paper hover:shadow-[0_0_24px_-6px_rgba(155,133,255,0.6)] rtl:text-xs rtl:normal-case rtl:tracking-normal"
          >
            {t.footer.contact}
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-soft to-ember text-[0.75rem] text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden>
              ↗
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
