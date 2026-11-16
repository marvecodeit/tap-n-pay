import type { Config } from "tailwindcss";
import basePreset from "@tapnpay/config/tailwind-preset";

const config: Config = {
  presets: [basePreset as Config],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        sora: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
