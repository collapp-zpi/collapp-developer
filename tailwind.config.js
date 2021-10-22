const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  // mode: 'jit',
  purge: [
    './shared/**/*.{tsx}',
    './components/**/*.{tsx}',
    './includes/**/*.{tsx}',
    './pages/**/*.{tsx}',
  ],
  darkMode: 'media',
  theme: {
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
