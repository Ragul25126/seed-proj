import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Lovable-aligned palette (slate navy + warm gold/orange accent)
        navy: '#0b0f19', // Main background
        slate: '#0f172a', // Card background
        gold: '#F59E0B', // Accent orange/gold
        champagne: '#D4AF37', // Accent yellow/gold
        ink: {
          DEFAULT: '#050816',
          soft: '#0f172a',
          line: '#1e293b',
        },
        bone: '#0b0f19', // Replaced with dark for global bg
        body: '#f8fafc', // Text color
        secondary: '#94a3b8', // Muted text
        muted: '#64748b',
        border: '#1e293b',
      },
      fontFamily: {
        sans: ['Arial', '"Helvetica Neue"', 'Helvetica', 'var(--font-arimo)', 'sans-serif'],
        serif: ['Arial', '"Helvetica Neue"', 'Helvetica', 'var(--font-arimo)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        display: '-0.015em',
        label: '0.12em',
      },
      maxWidth: {
        container: '1200px',
      },
      fontSize: {
        display: ['clamp(3rem, 7vw, 5.5rem)', { lineHeight: '1.08', letterSpacing: '-0.015em', fontWeight: '400' }],
        h1: ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.12', letterSpacing: '-0.01em', fontWeight: '600' }],
        h2: ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.18', letterSpacing: '-0.005em', fontWeight: '600' }],
        h3: ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '600' }],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.12em', fontWeight: '500' }],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
