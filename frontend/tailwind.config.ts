import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090d16',
        surface: {
          50: '#1e293b',
          100: '#161f30',
          200: '#0f172a',
          300: '#0b1120',
          card: '#0d1527',
          border: '#1e2d4a',
        },
        cyber: {
          accent: '#06b6d4', // Cyan
          purple: '#8b5cf6',
          danger: '#f43f5e', // Rose
          warning: '#f59e0b', // Amber
          success: '#10b981', // Emerald
          info: '#3b82f6',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
