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
  {
    // Real client work
    slug: 'world-war-map',
    title: 'The Map of a War',
    client: 'News explainer',
    category: 'motion-graphics',
    year: 2026,
    role: 'Motion Designer',
    duration: '0:40',
    tools: ['After Effects'],
    deliverables: ['News explainer 16:9', '3D map animation', 'Satellite strike sequence'],
    summary: 'A 40-second map-driven explainer that walks through an escalating Middle East conflict, from the first strike to the regional fallout.',
    challenge:
      'Make a fast-moving news story easy to follow in under a minute, with dates, places and missile ranges that viewers can read at a glance.',
    approach:
      'Built a moody paper-texture map with drifting clouds and a glowing amber line style, opened on a glitching date stamp, then dropped to a satellite view for the strike sequence. Animated borders, missile counters, a range HUD and arcing trajectories carry the story across the region in one continuous camera move.',
    result: 'A cinematic, documentary-style explainer that turns a complex timeline into a clear visual story.',
    accent: '#F5B53D',
    preview: '/videos/world-war-map-preview.mp4',
    poster: '/posters/world-war-map.jpg',
    video: { type: 'file', src: '/videos/world-war-map.mp4', poster: '/posters/world-war-map.jpg' },
    gallery: [
      { src: '/bts/world-war-map-1.jpg', alt: 'Glitching date stamp over a cloudy map' },
      { src: '/bts/world-war-map-2.jpg', alt: 'Satellite view of the strike sequence' },
      { src: '/bts/world-war-map-3.jpg', alt: 'Missile count animated over the highlighted map' },
    ],
  },
  {
    // Real client work
    slug: 'viral-reel',
    title: 'Stand Out From the Crowd',
    client: 'Self-improvement creator',
    category: 'social-reels',
    year: 2026,
    role: 'Editor & Motion Designer',
    duration: '0:30',
    tools: ['Premiere Pro', 'After Effects'],
    deliverables: ['Vertical reel 9:16', 'Word-by-word captions', 'Cinematic B-roll inserts'],
    summary: 'A 30-second talking-head reel built for retention, mixing a creator’s piece to camera with cinematic inserts about standing out and reaching the top 1%.',
    challenge:
      'Keep a simple sit-down monologue gripping on TikTok and Reels, where viewers decide in the first second whether to keep watching.',
    approach:
      'Opened on a fast money-themed hook and a gritty “bad news” title card, then cut the creator’s talk to the beat with word-by-word captions and yellow highlights. Moody amber B-roll with kinetic type (“How to be unique”, “Top 1%”) breaks up the talk, and animated icons land the final idea.',
    result: 'A punchy, high-retention reel that keeps changing every few seconds without losing the speaker’s message.',
    accent: '#F2B705',
    preview: '/videos/viral-reel-preview.mp4',
    poster: '/posters/viral-reel.jpg',
    video: { type: 'file', src: '/videos/viral-reel.mp4', poster: '/posters/viral-reel.jpg' },
    gallery: [
      { src: '/bts/viral-reel-1.jpg', alt: 'Creator on camera with word-by-word captions' },
      { src: '/bts/viral-reel-2.jpg', alt: 'Amber B-roll with “Top 1%” kinetic type' },
      { src: '/bts/viral-reel-3.jpg', alt: 'Animated icons over the talking head' },
    ],
  },
  {
    // Real client work
    slug: 'love-of-falsehood',
    title: 'You Are With Those You Love',
    client: 'Islamic reminder channel',
    category: 'social-reels',
    year: 2026,
    role: 'Editor & Motion Designer',
    duration: '0:52',
    tools: ['Premiere Pro', 'After Effects'],
    deliverables: ['Vertical reel 9:16', 'Arabic kinetic typography', 'Illustrated character animation'],
    summary: 'An Arabic reminder reel about the hadith “you will be with those you love”, and what it means to admire people who live far from the truth.',
    challenge:
      'Carry a serious spiritual message on short-form platforms without it feeling heavy, and keep it moving for almost a minute with no presenter on camera.',
    approach:
      'Opened on a bold red title card, then told the story with an illustrated character whose colour drains as his heart turns, celebrity cut-outs for the people he follows, and close-ups of a Quran app on a phone. Clean white scenes with calligraphy and glowing Arabic type on a deep blue backdrop carry the closing lines.',
    result: 'A calm, reflective reel that moves through three visual worlds and lands its message clearly in under a minute.',
    accent: '#C8102E',
    preview: '/videos/love-of-falsehood-preview.mp4',
    poster: '/posters/love-of-falsehood.jpg',
    video: { type: 'file', src: '/videos/love-of-falsehood.mp4', poster: '/posters/love-of-falsehood.jpg' },
    gallery: [
      { src: '/bts/love-of-falsehood-1.jpg', alt: 'Red title card with celebrity cut-outs' },
      { src: '/bts/love-of-falsehood-2.jpg', alt: 'Close-up of a Quran app on a phone' },
      { src: '/bts/love-of-falsehood-3.jpg', alt: 'Glowing Arabic type on a deep blue backdrop' },
    ],
  },
  {
    // Real client work
    slug: 'editors-marketplace',
    title: 'The Freelance Game',
    client: 'Editors marketplace platform',
    category: 'motion-graphics',
    year: 2026,
    role: 'Motion Designer',
    duration: '0:21',
    tools: ['After Effects'],
    deliverables: ['Product promo 4:3', 'UI animation', 'Kinetic typography'],
    summary: 'A 21-second UI-driven promo for a marketplace that connects video editors with creators who are looking for them.',
    challenge:
      'Show both sides of a broken freelance market (editors ignored in cold emails, creators who can’t find anyone) and land the product in about twenty seconds.',
    approach:
      'Opened on glitchy kinetic type and a glowing inbox full of unanswered pitches, then flipped to a bright demand curve with creator avatars and stacked client messages. An editor profile card shatters on red before the reveal: a clean Marketplace logo and a scrolling feed of real job cards with rates and Apply buttons.',
    result: 'A fast, story-led product promo that sets up the problem and the solution in one smooth sequence.',
    accent: '#4FE3D1',
    preview: '/videos/editors-marketplace-preview.mp4',
    poster: '/posters/editors-marketplace.jpg',
    video: { type: 'file', src: '/videos/editors-marketplace.mp4', poster: '/posters/editors-marketplace.jpg' },
    gallery: [
      { src: '/bts/editors-marketplace-1.jpg', alt: 'Glowing inbox full of editor pitches' },
      { src: '/bts/editors-marketplace-2.jpg', alt: 'Animated demand curve with creator avatars' },
      { src: '/bts/editors-marketplace-3.jpg', alt: 'Marketplace feed of job cards with rates' },
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
