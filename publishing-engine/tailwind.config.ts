import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AI Architect Academy brand colors
        brand: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#cbd5e1',
            a: {
              color: '#8b5cf6',
              '&:hover': {
                color: '#a78bfa',
              },
            },
            strong: {
              color: '#f8fafc',
            },
            h1: {
              color: '#f8fafc',
            },
            h2: {
              color: '#f8fafc',
            },
            h3: {
              color: '#f8fafc',
            },
            h4: {
              color: '#f8fafc',
            },
            code: {
              color: '#e879f9',
              backgroundColor: '#1e293b',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              borderLeftColor: '#8b5cf6',
              color: '#e2e8f0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
