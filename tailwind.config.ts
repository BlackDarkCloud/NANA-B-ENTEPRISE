import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#123D91",
          dark: "#08255F",
          light: "#E9F0FF",
          red: "#D91E2B",
        },
        ink: "#101828",
      },
      fontFamily: {
        sans: ["Inter", "Aptos", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
