"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { VirtualEv } from "@/types";
import { MATLAB_COLORS, PLOT_THEME, axisProps } from "@/lib/chartTheme";

interface EvSocChartProps {
  ev: VirtualEv;
}

export function EvSocChart({ ev }: EvSocChartProps) {
  const data = useMemo(() => {
    const points = 20;
    const startSoc = Math.max(0, ev.socPercent - (ev.status === "charging" ? 15 : 0));
    return Array.from({ length: points }, (_, i) => ({
      t: i,
      soc: Math.min(100, startSoc + ((ev.socPercent - startSoc) / (points - 1)) * i),
    }));
  }, [ev.socPercent, ev.status]);

  return (
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <h3 className="section-label">Scope: SoC Trend</h3>
      </div>
      <div className="panel-body">
        <div className="matlab-figure h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={PLOT_THEME.gridStroke} />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} {...axisProps} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={PLOT_THEME.tooltipStyle}
                formatter={(v: number) => [`${v.toFixed(1)}%`, "SoC"]}
              />
              <ReferenceLine
                y={ev.targetSocPercent}
                stroke={MATLAB_COLORS.green}
                strokeDasharray="4 4"
                label={{ value: "Target", fill: MATLAB_COLORS.green, fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="soc"
                stroke={MATLAB_COLORS.blue}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
