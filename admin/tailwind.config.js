/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fade: 'fadeOut 1s ease-in-out',
      },

      // that is actual animation
      keyframes: theme => ({
        fadeOut: {
          '0%': { textColor: theme('colors.white') },
          '100%': { textColor: theme('colors.transparent') },
        },
      }),

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}