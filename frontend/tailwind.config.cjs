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
    },
  },
  plugins: [],
};
