
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Playfair Display",
          "serif"
        ]
      },
      colors: {
        fw: {
          bg: "#23232B", // dark with hint of blue for depth
          panel: "#2C2C2C",
          accent: "#B90096",    // vibrant magenta (logo top left)
          accent2: "#FFA500",   // orange (logo top right)
          accent3: "#27B1EA",   // bright blue (logo bottom left)
          accent4: "#6CC24A",   // fresh green (logo bottom right)
          petrol: "#108EA7",
          text: "#F9F9F9",
          subtext: "#CCCCCC"
        },
        // Fallbacks for context (for shaded gradients)
        accent: {
          DEFAULT: "#B90096",
          alt: "#FFA500"
        }
      },
      borderRadius: {
        lg: "1.25rem",
        md: "1rem",
        sm: "0.5rem",
      },
      boxShadow: {
        card: "0 4px 36px 0 rgba(64, 24, 83, 0.15)"
      },
      keyframes: {
        "pulse-brand": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(185,0,150,.3)" },
          "50%": { boxShadow: "0 0 0 6px rgba(255,165,0,0.2)" }
        }
      },
      animation: {
        "pulse-brand": "pulse-brand 2s infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
