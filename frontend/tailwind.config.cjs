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
                'brand-green-light': `hsl(${brandHue}, ${brandSat}%, ${58}%)`,
                'brand-red': `#ff3735`,
                'light-background': `hsl(${brandHue}, ${brandSat / 4}%, ${95}%)`,
                'light-foreground': `#FFF`,
                'light-midground': '#EBEBEB',
                'light-text': '#111',
                'dark-background': `hsl(${brandHue}, 7%, 4%)`,
                'dark-foreground': `hsl(${brandHue}, 3%, 9%)`,
                'dark-midground': `#282B28`,
                'dark-text': '#FFF',
                'gray-neutral': '#7F7F7F',
            },
            borderRadius: {
                12: '12px',
            },
            boxShadow: {
                hard: '0px 1px 2px #1116',
                glow: '0px 0px 4px 1px #00FF708F',
            },
            fontFamily: {
                lexend: ['Lexend', 'sans-serif'],
            },
            translate: {
                'center-50': '50%',
            }
        },
    },
    plugins: [],
};
