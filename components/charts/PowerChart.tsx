"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { VirtualCharger } from "@/types";
import { MATLAB_COLORS, PLOT_THEME, axisProps } from "@/lib/chartTheme";

export function PowerChart({
  chargers,
  embedded = false,
}: {
  chargers: VirtualCharger[];
  embedded?: boolean;
}) {
  const data = chargers
    .filter((c) => c.currentSession && c.currentSession.currentPowerKw > 0)
    .map((c) => ({
      name: c.id,
      power: c.currentSession?.currentPowerKw ?? 0,
    }));

  if (data.length === 0) {
    return (
      <div
        className={
          embedded
            ? "h-64 flex items-center justify-center text-muted text-sm matlab-figure"
            : "panel p-4 h-64 flex items-center justify-center text-muted text-sm shadow-card"
        }
      >
        No active charging sessions
      </div>
    );
  }

  const chart = (
    <div className={embedded ? "matlab-figure p-2 h-64" : "matlab-figure p-2 h-[calc(100%-2rem)]"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid
            stroke={PLOT_THEME.gridStroke}
            strokeDasharray={PLOT_THEME.gridDash}
            vertical
            horizontal
          />
          <XAxis
            dataKey="name"
            {...axisProps}
            label={{
              value: "Charger ID",
              position: "insideBottom",
              offset: -2,
              style: { fill: PLOT_THEME.tickFill, fontSize: 10 },
            }}
          />
          <YAxis
            {...axisProps}
            width={44}
            label={{
              value: "kW",
              angle: -90,
              position: "insideLeft",
              style: { fill: PLOT_THEME.tickFill, fontSize: 10 },
            }}
          />
          <Tooltip
            contentStyle={PLOT_THEME.tooltipStyle}
            labelStyle={{ color: PLOT_THEME.tickFill, fontWeight: 600 }}
            formatter={(value: number) => [`${value.toFixed(2)} kW`, "Power"]}
          />
          <Line
            type="monotone"
            dataKey="power"
            stroke={MATLAB_COLORS.blue}
            strokeWidth={1.5}
            dot={{ r: 4, fill: MATLAB_COLORS.blue, stroke: "#fff", strokeWidth: 1 }}
            activeDot={{ r: 5, stroke: MATLAB_COLORS.blue, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  if (embedded) {
    return <div className="h-64">{chart}</div>;
  }

  return (
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <h3 className="section-label">Figure: Live Power Draw</h3>
      </div>
      <div className="panel-body pt-2 pb-3 h-64">{chart}</div>
    </div>
  );
}
