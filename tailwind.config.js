/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme
        ivory: '#F2EFE7',
        aqua: '#9ACBD0',
        teal: '#48A6A7',
        ocean: '#006A71',
        // Dark theme palette
        night: '#222831',
        steel: '#393E46',
        khaki: '#948979',
        sand: '#DFD0B8',
      },
      fontFamily: {
        sans: ['Poppins', 'Noto Sans JP', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
