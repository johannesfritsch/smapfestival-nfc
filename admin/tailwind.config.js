/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        text: 'textInOut 3.0s linear both',
      },

      // that is actual animation
      keyframes: theme => ({
        textInOut: {
          '0%': { opacity: 0, transform: 'scale(0.85)', filter: 'blur(16px)' },
          '20%': { opacity: 1, filter: 'blur(0px)' },
          '80%': { opacity: 1, filter: 'blur(0px)' },
          '100%': { opacity: 0, transform: 'scale(1)', filter: 'blur(64px)' },
        },
      }),

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}