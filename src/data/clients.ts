import type { Client } from './types';

/** Drop logos in /public/clients/ (SVG or transparent PNG work best). */
export const clients: Client[] = [
  'nova', 'kinetic', 'lumen', 'orbital', 'arcade', 'halo-studio',
  'monolith', 'prism', 'vanta', 'northwind', 'echo-labs', 'solace',
].map((slug) => ({
  name: slug.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  logo: `/clients/${slug}.svg`,
}));
