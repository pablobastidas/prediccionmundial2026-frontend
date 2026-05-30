import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wc: {
          red:    '#C8102E',
          blue:   '#0A3161',
          sky:    '#009DDC',
          gold:   '#F0A500',
          green:  '#006847',
          white:  '#F5F5F5',
          dark:   '#0D1B2A',
          card:   '#132237',
          muted:  '#1E3A52',
          border: '#2A4A68',
        },
        brand: {
          dark: '#FFFFFF',
          surface: '#FBFBFE',
          primary: '#101113',
          accent: '#0062FF',
          vibrant: '#6366F1',
          magenta: '#D946EF',
          success: '#10B981',
          danger: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0A3161 0%, #0D1B2A 50%, #006847 100%)',
        'card-gradient': 'linear-gradient(145deg, #132237 0%, #1E3A52 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F0A500 0%, #FFD166 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.35)',
        'card-hover': '0 8px 40px rgba(0,157,220,0.25)',
        'glow-gold': '0 0 20px rgba(240,165,0,0.4)',
        'glow-red': '0 0 20px rgba(200,16,46,0.4)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'reveal': 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shine': 'shine 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shine: {
          '0%': { transform: 'translateX(-200%) skewX(-30deg)' },
          '100%': { transform: 'translateX(200%) skewX(-30deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'scroll-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
    },
  },
  plugins: [],
}
export default config
