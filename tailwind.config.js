/** @type {import('tailwindcss').Config} */
const themeColors = require('./src/theme/colors.json');

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: themeColors,
      fontFamily: {
        sans: ['System'],
        display: ['System'],
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};
