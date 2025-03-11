/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'green-teal': '#0ab463',
        'gainsboro': '#dadada',
        'ligth-silver': '#ededed',
        'pinkish-grey': '#c4c4c4',
        'strong-grey': '#383838',
        'dodger-blue': '#0094ff'
      },
      boxShadow: {
        'header': '0 2px 0 0 #dadada',
      },
    },
  },
  plugins: [],
}

