import type { Category } from './types';

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'motion-graphics', label: 'Motion Graphics' },
  { id: 'commercials', label: 'Commercials / Ads' },
  { id: 'social-reels', label: 'Social Media Reels' },
  { id: 'music-videos', label: 'Music Videos' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'logo-animation', label: 'Logo Animation' },
  { id: 'vfx', label: 'VFX / Compositing' },
];

export const categoryLabel = (id: Category) => categories.find((c) => c.id === id)?.label ?? id;
