import { site, whatsappUrl } from '@/data/site';
import { cn } from '@/lib/utils';

/** Small After Effects–style badge: the rounded Creative Cloud square with "Ae" inside. */
export function AeBadge({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex h-[1em] w-[1em] shrink-0 items-center justify-center rounded-[22%] border-[0.07em] border-[#9999FF] bg-[#00005B] font-display font-bold leading-none tracking-[-0.04em] text-[#9999FF]',
        className,
      )}
    >
      <span className="text-[0.5em]">Ae</span>
    </span>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('h-[1.1em] w-[1.1em] fill-current', className)}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm.01 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/** "AHMED ARK [Ae]" — the name with the After Effects badge beside it. */
export function BrandName({ className, badgeClassName }: { className?: string; badgeClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-[0.35em]', className)}>
      {site.name}
      <AeBadge className={cn('text-[1.15em]', badgeClassName)} />
    </span>
  );
}

/** Direct WhatsApp link with the logo, used everywhere people can reach out. */
export function WhatsAppLink({ className, label = site.phoneDisplay, text }: { className?: string; label?: string; text?: string }) {
  return (
    <a href={whatsappUrl(text)} target="_blank" rel="noreferrer" className={cn('inline-flex items-center gap-2', className)} aria-label={`WhatsApp ${site.phoneDisplay}`}>
      <WhatsAppIcon className="text-[#25D366]" />
      <span>{label}</span>
    </a>
  );
}

/** Floating chat button, always one tap from a WhatsApp conversation. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl("Hi Ahmed, I'd like to talk about a project")}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat on WhatsApp ${site.phoneDisplay}`}
      className="group fixed bottom-24 right-5 z-[65] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.65)] transition-transform duration-300 hover:scale-110 md:bottom-24 md:right-8"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}
