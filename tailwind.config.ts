import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 50px rgba(21, 38, 66, 0.08)",
        lift: "0 12px 32px rgba(27, 54, 90, 0.12)"
      },
      colors: {
        ink: {
          900: "#14263f",
          700: "#34506f",
          500: "#5a748f"
        },
        paper: "#fbf8f2",
        surface: "#ffffff",
        accent: {
          50: "#eef8f6",
          100: "#d8f1ea",
          500: "#2f8f7b",
          600: "#267566"
        },
        sand: {
          50: "#f7f3ec",
          100: "#efe7da",
          200: "#dfd1bc"
        }
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 1px 1px, rgba(67, 95, 126, 0.08) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;