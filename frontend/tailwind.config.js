/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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

