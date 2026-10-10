import type { Service } from './types';

export const services: Service[] = [
  { title: 'Video Editing', icon: 'edit', description: 'Story-first edits with rhythm, pacing and sound design that hold attention to the last frame.' },
  { title: 'Motion Graphics', icon: 'motion', description: 'Kinetic type, explainers and brand animation, crafted in After Effects with obsessive easing.' },
  { title: 'Logo Animation', icon: 'logo', description: 'Logo stings, intros and full motion identity systems that make a brand feel alive.' },
  { title: 'Social Media Content', icon: 'social', description: 'Hook-first vertical reels, templates and caption systems built for the feed.' },
  { title: 'Ads & Commercials', icon: 'ads', description: 'TV spots, pre-roll and performance ads, delivered in every ratio and length you need.' },
  { title: 'Color Grading', icon: 'color', description: 'Cinematic looks in DaVinci Resolve that match your brand and stay consistent across shots.' },
  { title: 'VFX & Compositing', icon: 'vfx', description: 'Tracking, rotoscoping, clean-ups and CG integration that nobody will notice. That is the point.' },
];

export const process = [
  { step: 'Brief', text: 'We align on goals, audience, references and deadlines.' },
  { step: 'Script / Storyboard', text: 'Structure, style frames and an animatic before any heavy lifting.' },
  { step: 'Edit', text: 'Story, pacing and sound come together in the rough cut.' },
  { step: 'Motion & VFX', text: 'Graphics, compositing and the polish that makes it premium.' },
  { step: 'Revisions', text: 'Two focused review rounds with frame-accurate notes.' },
  { step: 'Delivery', text: 'Masters and cutdowns in every format, ready to publish.' },
];
