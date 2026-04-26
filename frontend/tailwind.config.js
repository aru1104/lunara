/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          50:  "#EEEDFE", 100: "#CECBF6", 200: "#AFA9EC",
          300: "#9f7aea", 400: "#7F77DD", 500: "#6C4FD4",
          600: "#534AB7", 700: "#3C3489", 800: "#26215C", 900: "#0F0A1E",
        },
        teal: {
          300: "#5DCAA5", 400: "#1D9E75", 500: "#0F6E56",
          600: "#085041", 700: "#04342C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};