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
          "cns-blue": "#004B43",
          "cns-blue-light": "#00796B",
          "cns-blue-dark": "#002F2A",
          "cns-green": "#00A676",
          "cns-gray": "#F5F7F9",
        }
      },
      fontFamily: {
        'cns': ['Arial', 'Helvetica', 'sans-serif'],
      }
    },
  },
  plugins: [],
}