/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        farm: {
          900: "#1b3a1e",
          800: "#2E7D32",
          700: "#357a38",
          600: "#4CAF50",
        },
        surface: "#F6F8F6",
        success: "#16A34A",
        warn: "#F59E0B",
        danger: "#DC2626",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
};
