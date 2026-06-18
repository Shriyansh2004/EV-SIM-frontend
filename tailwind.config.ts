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
        background: "#f0f0f0",
        surface: "#ffffff",
        "surface-raised": "#fafafa",
        "title-bar": "#e6e6e6",
        border: "#bdbdbd",
        "border-subtle": "#d9d9d9",
        accent: "#0072bd",
        warning: "#edb120",
        error: "#a2142f",
        muted: "#616161",
        charging: "#0072bd",
        finishing: "#7e2f8e",
        matlab: {
          blue: "#0072bd",
          orange: "#d95319",
          yellow: "#edb120",
          purple: "#7e2f8e",
          green: "#77ac30",
          cyan: "#4dbeee",
          red: "#a2142f",
        },
        plot: {
          bg: "#ffffff",
          grid: "#cccccc",
          axis: "#212121",
        },
        ink: "#212121",
        sidebar: {
          DEFAULT: "#ea580c",
          dark: "#c2410c",
          border: "rgba(255,255,255,0.14)",
          muted: "rgba(255,255,255,0.72)",
        },
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "Courier New", "monospace"],
        sans: ["Helvetica Neue", "Arial", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.08)",
        "card-hover": "inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.12)",
        inset: "inset 1px 1px 2px rgba(0,0,0,0.08)",
        "matlab-btn": "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 0 #9e9e9e",
        sidebar: "4px 0 28px rgba(194, 65, 12, 0.22)",
        "nav-active": "0 4px 14px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        "simulink-grid":
          "radial-gradient(circle, #c8c8c8 1px, transparent 1px)",
        "sidebar-gradient":
          "linear-gradient(175deg, #fb923c 0%, #f97316 38%, #ea580c 72%, #c2410c 100%)",
      },
      backgroundSize: {
        "simulink-grid": "16px 16px",
      },
      animation: {
        "pulse-charge": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      transitionDuration: {
        sidebar: "220ms",
      },
      borderRadius: {
        matlab: "2px",
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
