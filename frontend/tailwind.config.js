/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'cns': {
          dark: '#004b44',
          medium: '#316963',
          darkest: '#002f26',
          light: '#5c8884',
          DEFAULT: '#004b44',
        }
      },
      fontFamily: {
        'cns': ['Arial', 'Helvetica', 'sans-serif'],
      }
    },
  },
  plugins: [],
}