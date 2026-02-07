import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0D0D0F",
          surface: "#1A1714",
          "surface-raised": "#242019",
        },
        accent: {
          gold: "#D4A546",
          "gold-dark": "#B8922E",
        },
        text: {
          primary: "#F0E6D6",
          secondary: "#9B8B6E",
        },
        border: {
          DEFAULT: "#2A2520",
        },
        resource: {
          brick: "#E85D4A",
          wheat: "#E8C44A",
          ore: "#8A9BAE",
          wood: "#4A9B5A",
          sheep: "#8BBF7A",
          desert: "#C4956A",
          sea: "#1A6B6B",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "shimmer": "shimmer 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "tile-enter": "tile-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "number-drop": "number-drop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "fade-up": "fade-up 0.3s ease-out forwards",
        "wave": "wave 8s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 4px rgba(212, 165, 70, 0.3)" },
          "50%": { boxShadow: "0 0 12px rgba(212, 165, 70, 0.6)" },
        },
        "tile-enter": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "number-drop": {
          "0%": { transform: "scale(0) translateY(-4px)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        wave: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
