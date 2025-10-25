/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F2EFE7',
        aqua: '#9ACBD0',
        teal: '#48A6A7',
        ocean: '#006A71',
      },
      fontFamily: {
        sans: ['Poppins', 'Noto Sans JP', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
