/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mercadolivre: {
          yellow: '#ffe600',
          blue: '#2d3277',
          dark: '#1a1a1a',
          light: '#f5f5f5'
        }
      }
    },
  },
  plugins: [],
}
