import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lp: {
          primary: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          dark: "var(--bg-dark)",
          orange: "var(--accent-orange)",
          "orange-soft": "var(--accent-orange-soft)",
          "grey-900": "var(--grey-900)",
          "grey-600": "var(--grey-600)",
          "grey-300": "color-mix(in srgb, var(--grey-300) calc(<alpha-value> * 100%), transparent)",
          "grey-100": "color-mix(in srgb, var(--grey-100) calc(<alpha-value> * 100%), transparent)",
        },
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
        "lp-display": ["var(--font-inter-tight)", "system-ui", "sans-serif"],
        "lp-body": ["var(--font-inter)", "system-ui", "sans-serif"],
        "lp-mono": ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        "lp-card": "0 4px 24px rgba(0, 0, 0, 0.06)",
        "lp-card-hover": "0 8px 32px rgba(0, 0, 0, 0.1)",
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
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-in": "fade-in 0.35s ease-out",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.92)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionDuration: {
        sidebar: "220ms",
      },
      borderRadius: {
        "lp-lg": "16px",
        "lp-xl": "24px",
        matlab: "6px",
        sm: "4px",
        lg: "10px",
        xl: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
