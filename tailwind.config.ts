import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f5",
          100: "#ecebe6",
          200: "#d8d5ca",
          300: "#b8b3a5",
          400: "#918a7a",
          500: "#746d60",
          600: "#5b554c",
          700: "#46413b",
          800: "#302d29",
          900: "#1f1d1b",
          950: "#12110f"
        },
        accent: {
          500: "#2f7d6d",
          600: "#23685b"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Newsreader", "ui-serif", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 29, 27, 0.08)"
      }
    }
  },
  plugins: [forms]
};

export default config;
