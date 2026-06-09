import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 50px rgba(0, 45, 114, 0.08)",
        lift: "0 12px 32px rgba(0, 45, 114, 0.12)"
      },
      colors: {
        ink: {
          900: "#002D72",
          700: "#004AAD",
          500: "#0B51C1"
        },
        paper: "#F4F7FC",
        surface: "#ffffff",
        accent: {
          50: "#EEF4FF",
          100: "#DDE8FF",
          500: "#0B51C1",
          600: "#004AAD"
        },
        sand: {
          50: "#F4F7FC",
          100: "#E7EEF8",
          200: "#D5DFED"
        }
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 1px 1px, rgba(0, 45, 114, 0.08) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;