import { TransitionLink } from '@/components/ui/TransitionLink';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-start justify-center">
      <p className="eyebrow">Error 404 · Media offline</p>
      <h1 className="display mt-6 text-[clamp(3rem,10vw,9rem)]">This frame was never rendered.</h1>
      <TransitionLink href="/" className="btn-primary mt-10">
        Back to the timeline
      </TransitionLink>
    </section>
  );
}
