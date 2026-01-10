/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'helpera-blue': '#1E3A8A', // Biru gelap sesuai desain Helpera
      },
    },
  },
  plugins: [],
}