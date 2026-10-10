/** Tiny WebAudio blips for optional UI sounds (off by default). */
let ctx: AudioContext | null = null;
let enabled = false;

export const setSoundEnabled = (v: boolean) => {
  enabled = v;
};

export function blip(freq = 880, duration = 0.05, gain = 0.03) {
  if (!enabled || typeof window === 'undefined') return;
  ctx ??= new AudioContext();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}
