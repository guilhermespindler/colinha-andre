/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'novo-orange': '#F37021',
        'novo-orange-dark': '#D95D16',
        'deep-blue': '#0E3570',
        'deep-blue-dark': '#0A2652',
        'brand-yellow': '#FBE122',
        'brand-green': '#00A859',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0E3570 0%, #0A2652 100%)',
      }
    },
  },
  plugins: [],
}
