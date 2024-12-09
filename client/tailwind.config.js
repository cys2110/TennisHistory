/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,vue,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'sm:col-span-1',
    'md:col-span-2',
    'lg:col-span-3', // Add all combinations
  ],
}
