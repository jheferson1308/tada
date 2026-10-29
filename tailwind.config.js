/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crema: '#FBF3EA',
        durazno: '#FCE6D2',
        marron: '#4A2E22',
        fresa: '#E85D75',
        salvia: '#8FAE8B',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        dmsans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'pill': '9999px',
        'card': '20px',
        'card-lg': '30px',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(74, 46, 34, 0.08)',
        'hover': '0 12px 40px rgba(74, 46, 34, 0.12)',
      }
    },
  },
  plugins: [],
}
