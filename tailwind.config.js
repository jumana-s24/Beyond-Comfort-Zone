/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: "#7ca6dd", 
        secondary: "#9abae5", 
        accent: "#ebf1fa", 
        textPrimary: "#FFFFFF", 
        textSecondary: "#4B5563", 
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1.5s ease-in-out",
      },
      fontFamily: {
        mansalva: ['"Mansalva"', 'cursive'], // Add Mansalva font
        patrick: ['"Patrick Hand"', 'cursive'], // Add Patrick Hand
        indie: ['"Indie Flower"', 'cursive'],   // Add Indie Flower
        libre: ['"Libre Franklin"', "sans-serif"], 
      },
    },
  },
  plugins: [],
}

