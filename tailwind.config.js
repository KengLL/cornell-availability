/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cornell: {
          red: '#B31B1B',
          darkRed: '#8B1515',
        }
      }
    },
  },
  plugins: [],
}
