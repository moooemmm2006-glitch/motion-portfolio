import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        violet: {
          soft: 'rgb(var(--color-violet-soft) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-violet) / <alpha-value>)',
        },
        ember: 'rgb(var(--color-ember) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'var(--font-ar-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'var(--font-ar-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'var(--font-ar-sans)', 'monospace'],
      },
      transitionTimingFunction: {
        // After Effects "Easy Ease" (33% influence) and stronger graph-editor curves
        ease: 'cubic-bezier(0.33, 0, 0.67, 1)',
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out-cine': 'cubic-bezier(0.83, 0, 0.17, 1)',
      },
      letterSpacing: { tightest: '-0.06em' },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(120deg, rgb(var(--color-violet-soft)), rgb(var(--color-violet)))',
      },
    },
  },
  plugins: [],
};

export default config;
