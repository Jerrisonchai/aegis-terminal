import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#020617',
        surface: '#0E1223',
        card: '#0F172A',
        muted: '#1A1E2F',
        border: '#334155',
        foreground: '#F8FAFC',
        'fg-muted': '#94A3B8',
        accent: '#22C55E',
        danger: '#EF4444',
        primary: '#3B82F6',
        buy: '#22C55E',
        watch: '#EAB308',
        weak: '#F97316',
        avoid: '#EF4444',
        neon: {
          green: '#22C55E',
          blue: '#3B82F6',
          cyan: '#06B6D4',
          purple: '#A855F7',
          pink: '#EC4899',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.6875rem, 0.65rem + 0.1875vw, 0.75rem)',
        'fluid-sm': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-base': 'clamp(0.875rem, 0.825rem + 0.25vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 0.925rem + 0.375vw, 1.25rem)',
        'fluid-xl': 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-right': 'slideRight 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
