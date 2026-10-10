'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { VideoSource } from '@/data/types';
import { cn } from '@/lib/utils';

interface Props {
  source: VideoSource;
  title: string;
  autoPlay?: boolean;
  className?: string;
  /** Start with sound off (defaults to autoPlay, since browsers block unmuted autoplay). */
  startMuted?: boolean;
  /** When set, the video plays once and calls this at the end instead of looping. */
  onEnded?: () => void;
  onMuteChange?: (muted: boolean) => void;
}

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return '00:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/**
 * One player for every source: MP4/WebM files, HLS (.m3u8 via hls.js, loaded on demand),
 * Vimeo and YouTube embeds. File/HLS sources get custom cinematic controls.
 */
export function VideoPlayer({ source, title, autoPlay = false, className, startMuted, onEnded, onMuteChange }: Props) {
  if (source.type === 'vimeo' || source.type === 'youtube') {
    const src =
      source.type === 'vimeo'
        ? `https://player.vimeo.com/video/${source.id}?autoplay=${autoPlay ? 1 : 0}&title=0&byline=0&portrait=0&dnt=1`
        : `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`;
    return (
      <div className={cn('relative aspect-video w-full overflow-hidden bg-black', className)}>
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  return <NativePlayer source={source} title={title} autoPlay={autoPlay} className={className} startMuted={startMuted} onEnded={onEnded} onMuteChange={onMuteChange} />;
}

function NativePlayer({ source, title, autoPlay, className, startMuted, onEnded, onMuteChange }: Props & { source: Extract<VideoSource, { type: 'file' | 'hls' }> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMutedState] = useState(startMuted ?? !!autoPlay);
  const setMuted = (m: boolean) => {
    setMutedState(m);
    onMuteChange?.(m);
  };
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // HLS: native on Safari, hls.js elsewhere (dynamically imported).
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (source.type !== 'hls' || el.canPlayType('application/vnd.apple.mpegurl')) {
      el.src = source.src;
      // Unmuted autoplay can be blocked; fall back to muted so playback still starts.
      if (autoPlay)
        el.play().catch(() => {
          el.muted = true;
          setMuted(true);
          void el.play();
        });
      return;
    }
    let destroy = () => {};
    import('hls.js').then(({ default: Hls }) => {
      if (!Hls.isSupported()) return;
      const hls = new Hls({ capLevelToPlayerSize: true });
      hls.loadSource(source.src);
      hls.attachMedia(el);
      destroy = () => hls.destroy();
    });
    return () => destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only when the source changes
  }, [source]);

  // Pause when scrolled out of view.
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && el.pause(), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const el = video.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }, []);

  const poke = () => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 2200);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const el = video.current;
    if (!el) return;
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'ArrowRight') el.currentTime += 5;
    else if (e.key === 'ArrowLeft') el.currentTime -= 5;
    else if (e.key === 'm') {
      el.muted = !el.muted;
      setMuted(el.muted);
    } else if (e.key === 'f') fullscreen();
  };

  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrap.current?.requestFullscreen?.();
  };

  const progress = duration ? time / duration : 0;

  return (
    <div
      ref={wrap}
      className={cn('group relative aspect-video w-full overflow-hidden bg-black', className)}
      onPointerMove={poke}
      onKeyDown={onKey}
      tabIndex={0}
      role="region"
      aria-label={`Video player: ${title}`}
      data-cursor={playing ? undefined : 'PLAY'}
    >
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-contain"
        poster={source.poster}
        playsInline
        muted={muted}
        autoPlay={autoPlay}
        preload="metadata"
        loop={!onEnded}
        onEnded={onEnded}
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          poke();
        }}
        onPause={() => {
          setPlaying(false);
          setIdle(false);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const b = e.currentTarget.buffered;
          if (b.length) setBuffered(b.end(b.length - 1) / (e.currentTarget.duration || 1));
        }}
      >
        {source.captions && <track kind="captions" src={source.captions} srcLang="en" label="English" default />}
      </video>

      {!playing && (
        <button
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/10"
          aria-label={`Play ${title}`}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 ease-out-expo group-hover:scale-110 md:h-24 md:w-24">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </span>
        </button>
      )}

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 transition-opacity duration-500 md:px-6',
          idle && playing ? 'opacity-0' : 'opacity-100',
        )}
      >
        {/* Timeline scrubber, styled like an AE time ruler */}
        <div className="relative mb-3 h-6">
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/15">
            <div className="absolute inset-y-0 left-0 bg-white/25" style={{ width: `${buffered * 100}%` }} />
            <div className="absolute inset-y-0 left-0 bg-accent-gradient" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="absolute top-0 h-full w-px bg-ember" style={{ left: `${progress * 100}%` }}>
            <div className="absolute -left-[5px] -top-1 h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-ember" />
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={time}
            onChange={(e) => {
              if (video.current) video.current.currentTime = Number(e.target.value);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Seek"
          />
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-paper/80">
          <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="hover:text-paper">
            {playing ? 'PAUSE' : 'PLAY'}
          </button>
          <span className="tabular-nums">
            {fmt(time)} / {fmt(duration)}
          </span>
          <span className="flex-1" />
          <button
            onClick={() => {
              if (!video.current) return;
              video.current.muted = !video.current.muted;
              setMuted(video.current.muted);
            }}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="hover:text-paper"
          >
            {muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
          <button onClick={fullscreen} aria-label="Fullscreen" className="hover:text-paper">
            FULL
          </button>
        </div>
      </div>
    </div>
  );
}
