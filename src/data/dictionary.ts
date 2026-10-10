/**
 * UI strings live here so a second language (e.g. Arabic, RTL) can be added
 * by creating another dictionary with the same keys and switching `dir` on <html>.
 */
export const en = {
  locale: 'en',
  dir: 'ltr',
  hero: { play: 'Show videos', scroll: 'Scroll' },
  about: { eyebrow: 'About', heading: 'Editor by trade. Animator by obsession.', tools: 'Toolkit' },
  work: {
    eyebrow: 'Selected Work',
    heading: 'Frames that earned their place.',
    view3d: '3D',
    viewGrid: 'Grid',
    empty: 'No projects in this category yet.',
    dragHint: 'Drag or use the arrows to browse',
  },
  services: { eyebrow: 'Services', heading: 'What I can make for you.' },
  contact: {
    eyebrow: 'Contact',
    heading: "Let's make something that moves.",
    sent: 'Opening WhatsApp. Just hit send there.',
    submit: 'Send on WhatsApp',
    sending: 'Rendering…',
  },
  footer: { top: 'Rewind to top', rights: 'All rights reserved.' },
  project: {
    back: 'All work',
    challenge: 'The challenge',
    approach: 'The approach',
    result: 'The result',
    beforeAfter: 'Raw vs final',
    bts: 'Behind the scenes',
    next: 'Next project',
    prev: 'Previous project',
  },
} as const;

export type Dictionary = typeof en;
export const t = en;
