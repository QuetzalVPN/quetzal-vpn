/** @type {import("tailwindcss").Config} */

const brandHue = 146;
const brandSat = 100;
const brandBright = 50;

const redHue = 1;
const redSat = 100;
const redBright = 60;

const yellowHue = 51;
const yellowSat = 96;
const yellowBright = 41;

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], darkMode: "class", theme: {
    extend: {
      colors: {
        "brand-green": `hsl(${brandHue}, ${brandSat}%, ${brandBright}%)`,
        "brand-green-light": `hsl(${brandHue}, ${brandSat}%, ${brandBright + 20}%)`,
        "brand-red": `hsl(${redHue}, ${redSat}%, ${redBright}%)`,
        "brand-red-light": `hsl(${redHue}, ${redSat}%, ${redBright + 20}%)`,
        "brand-yellow": `hsl(${yellowHue}, ${yellowSat}%, ${yellowBright}%)`,
        "brand-yellow-light": `hsl(${yellowHue}, ${yellowSat}%, ${yellowBright + 20}%)`,
        "light-background": `hsl(${brandHue}, ${brandSat / 4}%, ${95}%)`,
        "light-foreground": `#FFF`,
        "light-midground": "#EBEBEB",
        "light-text": "#111",
        "dark-background": `hsl(${brandHue}, 7%, 4%)`,
        "dark-foreground": `hsl(${brandHue}, 3%, 9%)`,
        "dark-midground": `#282B28`,
        "dark-text": "#FFF",
        "gray-neutral": "#7F7F7F"
      }, borderRadius: {
        12: "12px"
      }, boxShadow: {
        hard: "0px 1px 2px #1116",
        glow: "0px 0px 4px 1px",
        switch: "0px 0px 0px 6px #7F7F7F7F",
        "big": "0px 0px 5px 1px",
      }, fontFamily: {
        lexend: ["Lexend", "sans-serif"]
      }, translate: {
        "center-50": "50%"
      }, screens: {
        "-2xl": { "max": "1535px" },
        "-xl": { "max": "1279px" },
        "-lg": { "max": "1023px" },
        "-md": { "max": "767px" },
        "-sm": { "max": "639px" }
      }
    }
  }, plugins: []
};
