# Motion Portfolio — 3D site for a Video Editor & Motion Designer

A cinematic, fully 3D portfolio built with **Next.js 15 (App Router) + TypeScript + Tailwind**, **React Three Fiber / drei / postprocessing**, **GSAP ScrollTrigger + Lenis**, and **Framer Motion**.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional, only needed for the contact form
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run lint                 # ESLint
npm run format               # Prettier
```

Node 18.18+ (Node 20+ recommended).

## Where everything lives

```
src/
  app/                 routes: home, /work/[slug], /api/contact, sitemap, robots, OG image
  components/
    three/             R3F scenes: HeroScene (glass lens + showreel), WorkGallery (3D ring),
                       PortraitScene (distortion shader), ContactScene (shader gradient)
    sections/          Hero, About, Work, Clients (+ testimonials), Services (+ process), Contact
    ui/                Cursor, Magnetic, SplitText, VideoPlayer, ShowreelModal, Preloader, Navbar, Footer…
    work/              ProjectCard (2D grid), ProjectDetail (project page)
    providers/         Lenis smooth scroll, page transitions, UI state
  data/                ALL editable content (see below)
  hooks/ lib/ shaders/ GLSL + helpers
public/
  videos/  posters/  bts/  clients/  avatars/  images/
```

## Edit your content (no component changes needed)

| What | File |
| --- | --- |
| Name, title, tagline, bio, location, email, WhatsApp, socials, stats, tools, showreel | `src/data/site.ts` |
| Projects | `src/data/projects.ts` |
| Client logos | `src/data/clients.ts` + `/public/clients/` |
| Testimonials | `src/data/testimonials.ts` + `/public/avatars/` |
| Services and "How I work" steps | `src/data/services.ts` |
| Filter categories | `src/data/categories.ts` |
| UI strings (for translation) | `src/data/dictionary.ts` |

### Add a new project

1. Drop the files in `/public`:
   - `/public/videos/<slug>.mp4` – a short, muted-friendly loop (used for hover previews and the 3D gallery). Keep it small: 720p, H.264, ~1–3 MB, `-movflags +faststart`.
   - `/public/posters/<slug>.jpg` – the poster frame (16:9).
   - Optional: `/public/bts/<slug>-1.jpg` … for the behind-the-scenes gallery, and a raw/final pair for the before/after slider.
2. Copy an entry in `src/data/projects.ts`, change the `slug` and text. That's it, the project page and sitemap are generated automatically.

The main project video (`video`) can be any of:

```ts
{ type: 'file', src: '/videos/x.mp4', poster: '/posters/x.jpg', captions: '/captions/x.vtt' }
{ type: 'hls', src: 'https://…/master.m3u8', poster: '…' }   // hls.js is loaded only when needed
{ type: 'vimeo', id: '123456789' }
{ type: 'youtube', id: 'dQw4w9WgXcQ' }
```

### Replace client logos

Put SVGs (or transparent PNGs) in `/public/clients/` and list them in `src/data/clients.ts`. Logos render grayscale and turn full color on hover, so colored logos work best.

### Replace the showreel and portrait

- Showreel: `/public/videos/showreel.mp4` + `/public/posters/showreel.jpg` (or point `site.showreel` to Vimeo/YouTube/HLS). It plays inside the 3D lens on the hero and in the full-screen modal.
- Portrait: `/public/images/portrait.jpg` (4:5).

## Contact form (Resend)

The form validates with react-hook-form + zod and posts to `/api/contact`, which sends an email with [Resend](https://resend.com).

`.env.local`:

```
RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=you@yourdomain.com
CONTACT_FROM_EMAIL=Portfolio <hello@yourdomain.com>   # must be a verified domain in Resend
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Without a key, `npm run dev` logs the message to the terminal and shows success; in production it returns an error and visitors are pointed to your email.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it on [vercel.com/new](https://vercel.com/new) — no config needed.
3. Add the env variables above in **Project → Settings → Environment Variables**, then redeploy.

## Performance & accessibility notes

- All 3D canvases are dynamically imported, render only while on screen, and use `PerformanceMonitor` + `AdaptiveDpr` to drop quality on weak GPUs. Mobile gets fewer particles and no post-processing.
- Videos: posters everywhere, previews load only on hover, players pause when they leave the viewport.
- `prefers-reduced-motion` and missing WebGL both fall back to elegant 2D versions (static hero poster, 2D project grid, CSS gradients).
- Keyboard: skip link, visible focus, player shortcuts (Space/K, ←/→, M, F), Esc closes the showreel.
- For best Lighthouse scores, compress your real videos (HandBrake / ffmpeg) and keep posters under ~200 KB.

## Adding Arabic (RTL) later

UI strings are in `src/data/dictionary.ts`. Create an `ar` dictionary with the same keys, set `dir: 'rtl'`, and switch `lang`/`dir` on `<html>` in `src/app/layout.tsx`. Layout uses logical properties (`inset-inline`, `padding-inline`) where it matters, so most sections flip automatically.
