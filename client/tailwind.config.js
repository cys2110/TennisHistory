/** @type {import('tailwindcss').Config} */
import tailwindCssPrimeUI from 'tailwindcss-primeui'
import tailwindScrollbar from 'tailwind-scrollbar'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindCssPrimeUI, tailwindScrollbar],
}
