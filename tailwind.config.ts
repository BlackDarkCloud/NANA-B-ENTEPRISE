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
        glow: "0 0 0 4px rgb(18 61 145 / 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        fadeInUp: { "0%": { opacity: "0", transform: "translateY(18px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { "0%": { opacity: "0", transform: "scale(.94)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        floatSlow: { "0%,100%": { transform: "translateY(0) rotate(0deg)" }, "50%": { transform: "translateY(-14px) rotate(3deg)" } },
        floatSlower: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(12px)" } },
        pulseRing: { "0%": { boxShadow: "0 0 0 0 rgb(217 30 43 / 0.35)" }, "100%": { boxShadow: "0 0 0 12px rgb(217 30 43 / 0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        "fade-in-up": "fadeInUp .6s cubic-bezier(.16,1,.3,1) both",
        "scale-in": "scaleIn .3s cubic-bezier(.16,1,.3,1) both",
        "float-slow": "floatSlow 7s ease-in-out infinite",
        "float-slower": "floatSlower 9s ease-in-out infinite",
        "pulse-ring": "pulseRing 1.4s cubic-bezier(0,0,.2,1) infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
