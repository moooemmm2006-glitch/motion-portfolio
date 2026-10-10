'use client';

import type { ReactNode } from 'react';
import { site, whatsappUrl } from '@/data/site';
import { useLang } from '@/components/providers/LangProvider';
import { cn } from '@/lib/utils';

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('h-[1.1em] w-[1.1em] fill-current', className)}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm.01 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/** Direct WhatsApp link with the logo, used everywhere people can reach out. */
export function WhatsAppLink({ className, label, text }: { className?: string; label?: ReactNode; text?: string }) {
  return (
    <a href={whatsappUrl(text)} target="_blank" rel="noreferrer" className={cn('inline-flex items-center gap-2', className)} aria-label={`WhatsApp ${site.phoneDisplay}`}>
      <WhatsAppIcon className="text-[#25D366]" />
      <span>{label ?? <bdi dir="ltr">{site.phoneDisplay}</bdi>}</span>
    </a>
  );
}

/** Floating chat button, always one tap from a WhatsApp conversation. */
export function WhatsAppFloat() {
  const { t } = useLang();
  return (
    <a
      href={whatsappUrl(t.waGreeting)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat on WhatsApp ${site.phoneDisplay}`}
      className="group fixed bottom-24 end-5 z-[65] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.65)] transition-transform duration-300 hover:scale-110 md:bottom-24 md:end-8"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}

const SOCIAL_PATHS = {
  Instagram:
    'M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 4.66a5.14 5.14 0 1 0 0 10.28 5.14 5.14 0 0 0 0-10.28Zm0 8.48a3.34 3.34 0 1 1 0-6.68 3.34 3.34 0 0 1 0 6.68Zm5.34-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z',
  Facebook:
    'M13.5 21.9v-7.4h2.5l.38-2.9H13.5V9.76c0-.84.23-1.41 1.44-1.41h1.54V5.76a20.6 20.6 0 0 0-2.24-.11c-2.22 0-3.74 1.35-3.74 3.84v2.14H8v2.9h2.5v7.4h3Z',
  TikTok:
    'M16.6 2h-3.27v13.3a2.86 2.86 0 1 1-2.86-2.87c.28 0 .55.04.8.12V9.21a6.15 6.15 0 1 0 5.33 6.1V8.6a7.9 7.9 0 0 0 4.6 1.47V6.8a4.6 4.6 0 0 1-4.6-4.6V2Z',
} as const;

const SOCIAL_HOVER = {
  Instagram: 'hover:bg-[linear-gradient(45deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5)]',
  Facebook: 'hover:bg-[#1877F2]',
  TikTok: 'hover:bg-[#111] hover:shadow-[-2px_-2px_0_#25F4EE,2px_2px_0_#FE2C55]',
} as const;

/** Round logo buttons: WhatsApp first, then the social platforms. */
export function SocialIcons({ className }: { className?: string }) {
  const base =
    'flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent';
  return (
    <ul className={cn('flex flex-wrap items-center gap-3', className)}>
      <li>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={cn(base, 'hover:bg-[#25D366]')}>
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </li>
      {site.socials.map((s) => {
        const icon = (
          <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
            <path d={SOCIAL_PATHS[s.label]} />
          </svg>
        );
        return (
          <li key={s.label}>
            {s.href ? (
              <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className={cn(base, SOCIAL_HOVER[s.label])}>
                {icon}
              </a>
            ) : (
              <span role="img" aria-label={s.label} title={s.label} className={cn(base, SOCIAL_HOVER[s.label])}>
                {icon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
