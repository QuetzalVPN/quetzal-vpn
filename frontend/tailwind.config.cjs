/** @type {import('tailwindcss').Config} */

const brandHue = 146;
const brandSat = 100;
const brandBright = 50;

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-green': `hsl(${brandHue}, ${brandSat}%, ${brandBright}%)`,
        background: `hsl(${brandHue}, ${brandSat / 4}%, ${97}%)`,
        foreground: `#FFF`,
        midground: '#EBEBEB',
      },
      borderRadius: {
        12: '12px',
      },
      boxShadow: {
        big: '-1px 1px 6px 0px rgba(0,0,0,0.38)',
        glow: '0px 0px 4px 1px #00FF708F',
      },
      fontFamily: {
        lexend: ['Lexend', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
