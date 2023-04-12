/** @type {import('tailwindcss').Config} */

const brandHue = 146;
const brandSat = 100;
const brandBright = 50;

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-green': `hsl(${brandHue}, ${brandSat}%, ${brandBright}%)`,
        'brand-red': `#ff3735`,
        'light-background': `hsl(${brandHue}, ${brandSat / 4}%, ${97}%)`,
        'light-foreground': `#FFF`,
        'light-midground': '#EBEBEB',
        'light-text': '#111',
        'dark-background': `hsl(${brandHue}, 7%, 5%)`,
        'dark-foreground': `hsl(${brandHue}, 3%, 7%)`,
        'dark-midground': `#282B28`,
        'dark-text': '#FFF',
        'gray-neutral': '#7F7F7F',
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
