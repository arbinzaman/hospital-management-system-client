/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
    
      'tahiti': {
        primary: '#00CC99',
        dark: '#000000',
        grey: '#AEAEAE',
        white: '#FFFFFF',
        green: '#f0fdf4',

      }},
    extend: {},
  },
  plugins: [],
}