import type { Config } from "tailwindcss";

export const tapnpayTailwindPreset: Partial<Config> = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
        },
        pos: {
          green: "#10b981",
          red: "#ef4444",
          amber: "#f59e0b",
          dark: "#0f172a",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};

export default tapnpayTailwindPreset;
