/** @type {import('tailwindcss').Config} */
import tailwindcssPrimeUI from 'tailwindcss-primeui'
export default {
  content: ['./src/**/*.{html,js,vue,ts}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssPrimeUI],
  safelist: [
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'sm:col-span-1',
    'md:col-span-2',
    'lg:col-span-3', // Add all combinations
  ],
}
