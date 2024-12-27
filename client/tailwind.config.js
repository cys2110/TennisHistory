/** @type {import('tailwindcss').Config} */
import tailwindCssPrimeUI from 'tailwindcss-primeui'
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindCssPrimeUI],
}
