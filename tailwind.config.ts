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
          accent: "#2E5CE6",
        },
        ink: "#101828",
        surface: "#F7F8FB",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgb(16 24 40 / 0.06), 0 1px 3px -1px rgb(16 24 40 / 0.04)",
        card: "0 8px 30px -10px rgb(16 24 40 / 0.12)",
        lift: "0 20px 40px -18px rgb(8 37 95 / 0.35)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
