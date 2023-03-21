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
      },
      boxShadow: {
        idk: '-1px 1px 6px 0px rgba(0,0,0,0.38)',
      },
    },
  },
  plugins: [],
};
