/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0c1128',
        neon: {
          blue: '#00f0ff',
          purple: '#b026ff',
        },
        paper: {
          DEFAULT: '#f5f1e8',
          card: '#ebe5d8',
        },
        ink: {
          DEFAULT: '#1a1a2e',
          soft: '#4a4a5e',
          muted: '#8a8a9a',
        },
        accent: {
          orange: '#ff6b35',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        magazine: ['"Noto Sans SC"', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
