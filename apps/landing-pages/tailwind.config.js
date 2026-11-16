/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      maxWidth: {
        296: "74rem",
      },
      margin: {
        90: "22.5rem",
      },
      rotate: {
        8: "8deg",
      },
      keyframes: {
        "wallet-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "wallet-bounce": "wallet-bounce 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
