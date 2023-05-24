module.exports = {
  semi: true,
  trailingComma: "all",
  singleQuote: true,
  printWidth: 100,
  arrowParens: "avoid",
  jsxSingleQuote: false,
  tailwindConfig: "./tailwind.config.cjs",
  plugins: [require("prettier-plugin-tailwindcss")],
};