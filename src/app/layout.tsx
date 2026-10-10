import type { Metadata, Viewport } from 'next';
import { Cairo, IBM_Plex_Sans_Arabic, Inter, Syne } from 'next/font/google';
import { site } from '@/data/site';
import { en } from '@/data/dictionary';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { TransitionProvider } from '@/components/providers/TransitionProvider';
import { UIProvider } from '@/components/providers/UIProvider';
import { LangProvider } from '@/components/providers/LangProvider';
import { Footer } from '@/components/ui/Footer';
import { WhatsAppFloat } from '@/components/ui/Brand';
import { Navbar } from '@/components/ui/Navbar';
import { ShowreelModal } from '@/components/ui/ShowreelModal';
import './globals.css';

const display = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
// Arabic faces: used only for Arabic glyphs (Latin text keeps Syne/Inter).
const arDisplay = Cairo({
  subsets: ['arabic'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-ar-display',
  display: 'swap',
});
const arSans = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-ar-sans',
  display: 'swap',
});

const description = `${site.title} — ${site.specialty}. ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.title}`, template: `%s — ${site.name}` },
  description,
  keywords: [
    'video editor',
    'motion designer',
    'After Effects',
    'motion graphics',
    'showreel',
    'VFX',
    'color grading',
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: 'website',
    title: `${site.name} — ${site.title}`,
    description,
    url: site.url,
    siteName: site.name,
  },
  twitter: { card: 'summary_large_image', title: `${site.name} — ${site.title}`, description },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
};

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: `${site.title}, ${site.specialty}`,
  description: site.tagline,
  telephone: site.whatsapp,
  url: site.url,
  image: `${site.url}${site.portrait}`,
  sameAs: site.socials.map((s) => s.href).filter(Boolean),
  knowsAbout: site.tools.map((t) => t.name),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={en.locale}
      dir={en.dir}
      className={`${display.variable} ${sans.variable} ${arDisplay.variable} ${arSans.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        <LangProvider>
          <UIProvider>
            <SmoothScroll>
              <TransitionProvider>
                <Navbar />
                <main id="main">{children}</main>
                <Footer />
                <WhatsAppFloat />
                <ShowreelModal />
                <div className="grain" aria-hidden />
              </TransitionProvider>
            </SmoothScroll>
          </UIProvider>
        </LangProvider>
      </body>
    </html>
  );
}
