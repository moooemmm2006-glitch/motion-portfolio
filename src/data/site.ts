import type { VideoSource } from './types';

/**
 * Everything about you lives here. Replace the [BRACKETED] values.
 */
export const site = {
  name: 'AHMED ARK',
  shortName: 'AA',
  title: 'Video Editor & Motion Designer',
  specialty: 'After Effects Specialist',
  tagline: 'I turn raw footage into stories that move.',
  bio: [
    "I'm a video editor and motion designer obsessed with rhythm, timing and the frame-perfect cut. For the past [X] years I've helped brands, artists and studios turn ideas into motion that people actually stop scrolling for.",
    'After Effects is my home base. From kinetic typography and logo reveals to full commercial edits, compositing and color, I handle the whole pipeline so your story ships polished.',
  ],
  availability: 'Available for remote work worldwide',
  email: 'hello@example.com',
  whatsapp: '+201117651679',
  phoneDisplay: '0111 765 1679',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://motion-portfolio-umber.vercel.app',
  portrait: '/images/portrait.jpg',
  showreel: {
    type: 'file',
    src: '/videos/ai-sales-roleplay.mp4',
    poster: '/posters/ai-sales-roleplay.jpg',
  } satisfies VideoSource as VideoSource,
  /** Leave href empty until the account exists: the logo shows without a link. */
  socials: [
    { label: 'Instagram', href: '' },
    { label: 'Facebook', href: '' },
    { label: 'TikTok', href: '' },
  ] as { label: 'Instagram' | 'Facebook' | 'TikTok'; href: string }[],
  stats: [
    { value: 7, suffix: '+', label: 'Years experience' },
    { value: 250, suffix: '+', label: 'Projects delivered' },
    { value: 80, suffix: '+', label: 'Happy clients' },
    { value: 40, suffix: 'M+', label: 'Views generated' },
  ],
  tools: [
    { name: 'After Effects', short: 'Ae', color: '#9999FF', main: true },
    { name: 'Premiere Pro', short: 'Pr', color: '#9999FF' },
    { name: 'DaVinci Resolve', short: 'Dr', color: '#FF6B3D' },
    { name: 'Photoshop', short: 'Ps', color: '#31A8FF' },
    { name: 'Illustrator', short: 'Ai', color: '#FF9A00' },
    { name: 'Cinema 4D', short: 'C4', color: '#3D8BFF' },
    { name: 'Element 3D', short: 'E3', color: '#F2F2F2' },
  ],
} as const;

/** wa.me link straight into a chat, optionally with a prefilled message. */
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${site.whatsapp.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Contact', href: '/#contact' },
];
