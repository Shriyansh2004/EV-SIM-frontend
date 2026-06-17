/** MATLAB default line / series colors (ColorOrder) */
export const MATLAB_COLORS = {
  blue: "#0072BD",
  orange: "#D95319",
  yellow: "#EDB120",
  purple: "#7E2F8E",
  green: "#77AC30",
  cyan: "#4DBEEE",
  red: "#A2142F",
} as const;

export const PLOT_THEME = {
  background: "#FFFFFF",
  gridStroke: "#CCCCCC",
  gridDash: "none" as const,
  axisStroke: "#212121",
  tickFill: "#616161",
  fontFamily: "Helvetica Neue, Arial, sans-serif",
  fontSize: 11,
  tooltipStyle: {
    background: "#FFFFFF",
    border: "1px solid #BDBDBD",
    borderRadius: 0,
    fontSize: 11,
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    color: "#212121",
    boxShadow: "1px 1px 3px rgba(0,0,0,0.12)",
  },
  legendStyle: {
    fontSize: 11,
    color: "#212121",
    fontFamily: "Helvetica Neue, Arial, sans-serif",
  },
};

export const axisProps = {
  stroke: PLOT_THEME.axisStroke,
  tick: { fill: PLOT_THEME.tickFill, fontSize: PLOT_THEME.fontSize },
  tickLine: { stroke: PLOT_THEME.axisStroke },
  axisLine: { stroke: PLOT_THEME.axisStroke },
};
