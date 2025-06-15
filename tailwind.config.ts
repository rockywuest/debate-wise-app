
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
          "-apple-system",
          "BlinkMacSystemFont", 
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "serif"
        ]
      },
      colors: {
        fw: {
          bg: "#1A1A1A",
          panel: "#2A2A2A",
          accent: "#E91E63",
          accent2: "#FF9800",
          accent3: "#2196F3",
          accent4: "#4CAF50",
          petrol: "#00ACC1",
          text: "#FFFFFF",
          subtext: "#B0B0B0",
          border: "#404040"
        },
        accent: {
          DEFAULT: "#E91E63",
          alt: "#FF9800"
        }
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "6px",
      },
      boxShadow: {
        card: "0 4px 24px 0 rgba(0, 0, 0, 0.3)",
        button: "0 2px 8px 0 rgba(233, 30, 99, 0.3)"
      },
      animation: {
        "pulse-brand": "pulse-brand 2s infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
