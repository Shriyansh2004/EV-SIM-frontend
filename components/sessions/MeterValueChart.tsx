"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MeterValue } from "@/types";
import { MATLAB_COLORS, PLOT_THEME, axisProps } from "@/lib/chartTheme";

export function MeterValueChart({ meterValues }: { meterValues: MeterValue[] }) {
  const data = meterValues.map((mv) => ({
    time: new Date(mv.timestamp).toLocaleTimeString(),
    power: mv.powerKw,
    energy: mv.energyKwh,
    soc: mv.socPercent,
  }));

  if (data.length === 0) {
    return (
      <div className="text-muted text-sm text-center py-8 matlab-figure">
        No meter values recorded
      </div>
    );
  }

  return (
    <div className="matlab-figure p-2">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 24, bottom: 4, left: 0 }}>
          <CartesianGrid
            stroke={PLOT_THEME.gridStroke}
            strokeDasharray={PLOT_THEME.gridDash}
            vertical
            horizontal
          />
          <XAxis dataKey="time" {...axisProps} />
          <YAxis {...axisProps} width={44} />
          <Tooltip contentStyle={PLOT_THEME.tooltipStyle} />
          <Legend wrapperStyle={PLOT_THEME.legendStyle} iconType="line" />
          <Line
            type="monotone"
            dataKey="power"
            stroke={MATLAB_COLORS.blue}
            name="Power (kW)"
            dot={false}
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke={MATLAB_COLORS.orange}
            name="Energy (kWh)"
            dot={false}
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey="soc"
            stroke={MATLAB_COLORS.green}
            name="SoC (%)"
            dot={false}
            strokeWidth={1.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
