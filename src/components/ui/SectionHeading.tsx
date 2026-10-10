import { SplitText } from './SplitText';
import { cn } from '@/lib/utils';

export function SectionHeading({ eyebrow, title, index, id, className }: { eyebrow: string; title: string; index: string; id?: string; className?: string }) {
  return (
    <header className={cn('mb-12 md:mb-20', className)}>
      <div className="mb-6 flex items-center gap-4">
        <span className="font-mono text-xs text-violet-soft">{index}</span>
        <span className="h-px w-12 bg-white/20" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 id={id} className="display max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)]">
        <SplitText text={title} />
      </h2>
    </header>
  );
}
