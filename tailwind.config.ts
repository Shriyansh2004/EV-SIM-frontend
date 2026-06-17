import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090b0f",
        surface: "#111419",
        "surface-raised": "#181c23",
        border: "#262c36",
        "border-subtle": "#1c2129",
        accent: "#34d399",
        warning: "#f59e0b",
        error: "#f87171",
        muted: "#7d8694",
        charging: "#60a5fa",
        finishing: "#c084fc",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.03)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(52,211,153,0.12)",
      },
      animation: {
        "pulse-charge": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      transitionDuration: {
        sidebar: "220ms",
      },
    },
  },
  plugins: [],
};
export default config;
