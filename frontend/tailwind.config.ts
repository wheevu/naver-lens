/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: "#04529D",
        jasmine: "#FFD987",
        bg: "#F7F8FA",
        gray: "#E5E7EB",
        success: "#4ADE80",
        error: "#F87171",
        pill: "#E0F2FE",
        pink: "#F9A8D4",
        green: "#A7F3D0",
        orange: "#FDBA74",
        purple: "#C4B5FD",
        'naver-green': '#03c75a',
        'naver-green-light': '#0cf09b',
      },
    },
  },
  plugins: [],
}