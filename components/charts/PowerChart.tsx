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
import { Zap } from "lucide-react";

const IDLE_DATA = [{ name: "—", power: 0 }];

function PowerChartCanvas({
  data,
  idle = false,
}: {
  data: { name: string; power: number }[];
  idle?: boolean;
}) {
  const maxPower = idle
    ? 22
    : Math.max(22, ...data.map((d) => d.power)) * 1.1;

  return (
    <div className="matlab-figure p-2 h-full min-h-[220px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={idle ? IDLE_DATA : data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
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
            domain={[0, maxPower]}
            label={{
              value: "kW",
              angle: -90,
              position: "insideLeft",
              style: { fill: PLOT_THEME.tickFill, fontSize: 10 },
            }}
          />
          {!idle && (
            <Tooltip
              contentStyle={PLOT_THEME.tooltipStyle}
              labelStyle={{ color: PLOT_THEME.tickFill, fontWeight: 600 }}
              formatter={(value: number) => [`${value.toFixed(2)} kW`, "Power"]}
            />
          )}
          <Line
            type="monotone"
            dataKey="power"
            stroke={idle ? PLOT_THEME.gridStroke : MATLAB_COLORS.blue}
            strokeWidth={idle ? 1 : 1.5}
            strokeDasharray={idle ? "4 4" : undefined}
            dot={
              idle
                ? false
                : { r: 4, fill: MATLAB_COLORS.blue, stroke: "#fff", strokeWidth: 1 }
            }
            activeDot={idle ? false : { r: 5, stroke: MATLAB_COLORS.blue, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {idle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="rounded-matlab bg-white/90 border border-border-subtle px-4 py-3 text-center shadow-card">
            <Zap className="w-5 h-5 text-muted mx-auto mb-1.5" />
            <p className="text-xs font-mono text-muted">Idle — no power draw</p>
          </div>
        </div>
      )}
    </div>
  );
}

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

  const idle = data.length === 0;
  const chart = (
    <div className={embedded ? "h-64" : "h-64"}>
      <PowerChartCanvas data={data} idle={idle} />
    </div>
  );

  if (embedded) {
    return chart;
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
