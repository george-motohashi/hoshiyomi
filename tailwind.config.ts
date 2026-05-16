import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#0B1026",
          deep: "#070A1A",
          soft: "#161B3D",
        },
        violet: {
          mystic: "#3D2B6B",
          light: "#6F5BB5",
        },
        gold: {
          DEFAULT: "#D4AF37",
          soft: "#E8C766",
        },
        moon: {
          DEFAULT: "#F5F3FF",
          dim: "#CFC9E6",
        },
      },
      fontFamily: {
        serif: ["var(--font-shippori)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "starry-night":
          "radial-gradient(ellipse at top, #1E1B4B 0%, #0B1026 45%, #070A1A 100%)",
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-12px) translateX(6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
