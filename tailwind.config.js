/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#F3E5AB',
          200: '#E6C86E',
          300: '#D4AF37',
          400: '#AA8C2C',
          500: '#806615'
        },
        black: {
          rich: '#050505',
          card: '#0A0A0A',
          surface: '#121212'
        }
      },
      fontFamily: {
        cursive: ['Great Vibes', 'cursive'],
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif']
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}