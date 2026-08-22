/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ps5-dark': '#0a0a1a',
        'ps5-purple': '#6b46c1',
        'ps5-cyan': '#06b6d4',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(107, 70, 193, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
