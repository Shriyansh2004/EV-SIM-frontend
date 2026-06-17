"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Session } from "@/types";
import { MATLAB_COLORS, PLOT_THEME, axisProps } from "@/lib/chartTheme";

export function EnergyBarChart({ sessions }: { sessions: Session[] }) {
  const data = sessions
    .filter((s) => s.energyKwh > 0)
    .slice(0, 10)
    .map((s) => ({
      name: s.chargerId.slice(0, 8),
      energy: Number(s.energyKwh.toFixed(2)),
    }));

  if (data.length === 0) {
    return (
      <div className="panel h-64 flex items-center justify-center text-muted text-sm shadow-card">
        <div className="matlab-figure w-full h-full flex items-center justify-center m-4">
          No session energy data
        </div>
      </div>
    );
  }

  return (
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <h3 className="section-label">Figure: Energy per Session (kWh)</h3>
      </div>
      <div className="panel-body pt-2 pb-3 h-64">
        <div className="matlab-figure p-2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
              <CartesianGrid
                stroke={PLOT_THEME.gridStroke}
                strokeDasharray={PLOT_THEME.gridDash}
                vertical={false}
              />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} width={44} />
              <Tooltip
                contentStyle={PLOT_THEME.tooltipStyle}
                formatter={(value: number) => [`${value.toFixed(2)} kWh`, "Energy"]}
              />
              <Bar
                dataKey="energy"
                fill={MATLAB_COLORS.blue}
                stroke={MATLAB_COLORS.blue}
                strokeWidth={0.5}
                radius={0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
