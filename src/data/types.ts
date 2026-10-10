export type VideoSource =
  | { type: 'file'; src: string; poster?: string; captions?: string }
  | { type: 'hls'; src: string; poster?: string; captions?: string }
  | { type: 'vimeo'; id: string; poster?: string }
  | { type: 'youtube'; id: string; poster?: string };

export type Category =
  | 'motion-graphics'
  | 'commercials'
  | 'social-reels'
  | 'music-videos'
  | 'corporate'
  | 'logo-animation'
  | 'vfx';

export interface Project {
  slug: string;
  title: string;
  client: string;
  category: Category;
  year: number;
  role: string;
  duration: string;
  tools: string[];
  deliverables: string[];
  summary: string;
  challenge: string;
  approach: string;
  result: string;
  /** Short muted loop used for hover previews and the 3D gallery. */
  preview: string;
  poster: string;
  /** Main video on the project page. */
  video: VideoSource;
  /** Optional raw vs final stills for the before/after slider. */
  beforeAfter?: { before: string; after: string };
  gallery: { src: string; alt: string }[];
  accent?: string;
}

export interface Client {
  name: string;
  logo: string;
  url?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export interface Service {
  title: string;
  description: string;
  icon: 'edit' | 'motion' | 'logo' | 'social' | 'ads' | 'color' | 'vfx';
}
