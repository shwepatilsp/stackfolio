/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        'slate-primary': '#ffffff',
        'slate-secondary': '#94a3b8',
        'brand-glow': '#22d3ee',
        'brand-accent': '#67e8f9',
        'brand-surface': 'rgba(20, 20, 20, 0.7)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

