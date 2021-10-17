const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  // mode: 'jit',
  purge: [
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
    extend: {},
  },
  plugins: [],
}
