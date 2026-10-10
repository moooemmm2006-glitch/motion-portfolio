import type { Project } from './types';

/**
 * To add a project: copy an entry, give it a unique slug, and drop
 * /public/videos/<slug>.mp4 (+ <slug>-preview.mp4), /public/posters/<slug>.jpg
 * and /public/bts/<slug>-1..3.jpg in place.
 * `video` can also be { type: 'vimeo', id } or { type: 'youtube', id } or an HLS .m3u8.
 */
export const projects: Project[] = [
  {
    // Real client work (also plays from the hero "Show videos" button)
    slug: 'ai-sales-roleplay',
    title: 'Train Like You Close',
    client: 'AI sales coaching platform',
    category: 'commercials',
    year: 2026,
    role: 'Editor & Motion Designer',
    duration: '0:55',
    tools: ['After Effects', 'Premiere Pro'],
    deliverables: ['Product promo 16:9', 'UI animation', 'Animated stats & captions'],
    summary: 'A 55-second promo for an AI platform where sales teams practise calls with realistic AI prospects and get scored on every conversation.',
    challenge:
      'Make a dashboard-heavy SaaS product feel human and urgent, and get across the cost of lost deals before viewers scroll away.',
    approach:
      'Cut a founder-to-camera story against fast UI sequences: lost calls stacking up, AI roleplay setup, live scoring and team analytics. Kinetic captions and a ticking revenue counter carry the numbers, while soft peach-and-lavender gradients tie the screens to the warm interview grade.',
    result: 'A clear, high-energy spot that moves from the problem to the product to the payoff in under a minute.',
    accent: '#FF6B3D',
    preview: '/videos/ai-sales-roleplay-preview.mp4',
    poster: '/posters/ai-sales-roleplay.jpg',
    video: { type: 'file', src: '/videos/ai-sales-roleplay.mp4', poster: '/posters/ai-sales-roleplay.jpg' },
    gallery: [
      { src: '/bts/ai-sales-roleplay-1.jpg', alt: 'Animated dashboard with personal training stats' },
      { src: '/bts/ai-sales-roleplay-2.jpg', alt: 'Lost-call notification sliding in' },
      { src: '/bts/ai-sales-roleplay-3.jpg', alt: 'AI prospect setup screen' },
    ],
  },
  {
    // Real client work
    slug: 'look-good-online',
    title: 'Look Good Online',
    client: 'Social content platform · Australia',
    category: 'commercials',
    year: 2026,
    role: 'Editor & Motion Designer',
    duration: '0:28',
    tools: ['After Effects', 'Premiere Pro'],
    deliverables: ['Product promo 16:9', 'Kinetic typography', 'UI animation'],
    summary: 'A product promo for a social media platform built for Australian financial advisors and mortgage brokers.',
    challenge:
      'Explain a content tool for a cautious, compliance-heavy audience in under 30 seconds, without it feeling like another dry fintech ad.',
    approach:
      'Cut the founder-style talking head to the rhythm of the voiceover, then lifted the key lines into kinetic serif-and-sans typography, framed the footage in floating glass cards over soft violet gradients, and animated the product UI (approvals, scheduling, post previews) so the tool explains itself.',
    result: 'A calm, premium 28-second spot that shows the whole workflow, from idea to published post, in one clear story.',
    accent: '#7B5CFF',
    preview: '/videos/look-good-online-preview.mp4',
    poster: '/posters/look-good-online.jpg',
    video: { type: 'file', src: '/videos/look-good-online.mp4', poster: '/posters/look-good-online.jpg' },
    gallery: [
      { src: '/bts/look-good-online-1.jpg', alt: 'Talking head framed in a glass card with kinetic type' },
      { src: '/bts/look-good-online-2.jpg', alt: 'Callout chips animating beside the footage' },
      { src: '/bts/look-good-online-3.jpg', alt: 'Animated product UI with scheduled posts' },
    ],
  },
  {
    // Real client work
    slug: 'gojiberry-ai-gtm',
    title: 'Your AI Go-To-Market Team',
    client: 'Gojiberry',
    category: 'motion-graphics',
    year: 2026,
    role: 'Motion Designer',
    duration: '1:05',
    tools: ['After Effects', 'Illustrator'],
    deliverables: ['Product launch film 16:9', 'UI animation', 'Kinetic typography'],
    summary: 'A one-minute UI-driven launch film for Gojiberry, an AI agent that finds prospects and runs outbound for SaaS teams.',
    challenge:
      'Show an invisible AI workflow (finding leads, scoring intent, writing outreach) in a way founders understand at a glance, without a single live-action shot.',
    approach:
      'Built the story from the product itself: a prompt being typed, LinkedIn conversations sliding in, prospects flying into a launch and intent signals branching off with clean connector lines. Warm coral accents and soft depth of field keep a white UI feeling premium and alive.',
    result: 'A crisp launch film that walks through the full go-to-market flow in about a minute and ends on a clean brand lockup.',
    accent: '#FF6B3D',
    preview: '/videos/gojiberry-ai-gtm-preview.mp4',
    poster: '/posters/gojiberry-ai-gtm.jpg',
    video: { type: 'file', src: '/videos/gojiberry-ai-gtm.mp4', poster: '/posters/gojiberry-ai-gtm.jpg' },
    gallery: [
      { src: '/bts/gojiberry-ai-gtm-1.jpg', alt: 'LinkedIn conversation UI animating in' },
      { src: '/bts/gojiberry-ai-gtm-2.jpg', alt: 'Prospects flying into the launch moment' },
      { src: '/bts/gojiberry-ai-gtm-3.jpg', alt: 'Intent signals, lead scoring and AI outreach branching off' },
    ],
  },
  {
    // Real client work
    slug: 'as-clinic-reel',
    title: 'The Right Treatment',
    client: 'AS Clinic',
    category: 'social-reels',
    year: 2026,
    role: 'Editor & Motion Designer',
    duration: '0:48',
    tools: ['Premiere Pro', 'After Effects'],
    deliverables: ['Vertical reel 9:16', 'Arabic kinetic captions', 'Animated face-anatomy graphics'],
    summary: 'An Arabic vertical reel for AS Clinic, where the doctor explains why every treatment starts with a proper assessment, not a single injection.',
    challenge:
      'Turn a seated, podcast-style talk into a reel that holds attention on Instagram and TikTok, and make a medical idea easy for anyone to follow.',
    approach:
      'Paced the cut to the doctor’s speech, added bold Arabic captions with gold highlight pills on the key words, and broke away to clean animated diagrams that map facial muscles, skin and features with callout lines. A crossed-out syringe and a short patient cutaway land the message, and the reel closes on the clinic’s gold logo.',
    result: 'A trustworthy, easy-to-watch reel that explains the clinic’s approach in under a minute and ends on a clear brand moment.',
    accent: '#D4AF37',
    preview: '/videos/as-clinic-reel-preview.mp4',
    poster: '/posters/as-clinic-reel.jpg',
    video: { type: 'file', src: '/videos/as-clinic-reel.mp4', poster: '/posters/as-clinic-reel.jpg' },
    gallery: [
      { src: '/bts/as-clinic-reel-1.jpg', alt: 'Doctor on camera with bold Arabic captions' },
      { src: '/bts/as-clinic-reel-2.jpg', alt: 'Animated face-anatomy diagram with callouts' },
      { src: '/bts/as-clinic-reel-3.jpg', alt: 'Patient cutaway framed in a rounded card' },
    ],
  },
  {
    // Real client work
    slug: 'as-clinic-ask-first',
    title: 'Ask Before You Treat',
    client: 'AS Clinic',
    category: 'social-reels',
    year: 2026,
    role: 'Editor & Motion Designer',
    duration: '0:48',
    tools: ['Premiere Pro', 'After Effects'],
    deliverables: ['Vertical reel 9:16', 'Arabic kinetic captions', 'Animated question tree'],
    summary: 'A second Arabic reel for AS Clinic urging patients to ask who is treating them, and what with, before any cosmetic procedure.',
    challenge:
      'Deliver a serious safety message about unqualified clinics without sounding preachy, and keep it watchable from the first second on mobile.',
    approach:
      'Opened on a punchy caption hook, then used colour shifts, 3D question marks and a cutaway to a medical scene to mark each beat. The key questions (qualifications, experience, materials) branch out as an animated tree, and gold pills stack up the knowledge a real specialist needs: anatomy, muscles, blood vessels, complications.',
    result: 'A clear, trust-building reel that turns a warning into a simple checklist and ends on the AS Clinic logo.',
    accent: '#D4AF37',
    preview: '/videos/as-clinic-ask-first-preview.mp4',
    poster: '/posters/as-clinic-ask-first.jpg',
    video: { type: 'file', src: '/videos/as-clinic-ask-first.mp4', poster: '/posters/as-clinic-ask-first.jpg' },
    gallery: [
      { src: '/bts/as-clinic-ask-first-1.jpg', alt: 'Hook caption with a gold highlight pill' },
      { src: '/bts/as-clinic-ask-first-2.jpg', alt: 'Animated question tree about the doctor’s experience' },
      { src: '/bts/as-clinic-ask-first-3.jpg', alt: 'Stacked gold pills listing what a specialist must know' },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getAdjacentProjects = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
};
