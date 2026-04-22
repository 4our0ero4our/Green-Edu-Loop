/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#ecfdf3',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        earth: {
          100: '#f5f0e8',
          200: '#e7dcc7',
          300: '#d3c1a0',
          700: '#7a6444',
        },
      },
      boxShadow: {
        soft: '0 4px 12px -8px rgba(15, 23, 42, 0.2)',
      },
    },
  },
  plugins: [],
}

