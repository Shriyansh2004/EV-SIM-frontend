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
            ? "h-64 flex items-center justify-center text-muted text-sm border border-dashed border-border rounded-md bg-surface/40"
            : "panel p-6 h-64 flex items-center justify-center text-muted text-sm shadow-card"
        }
      >
        No active charging sessions
      </div>
    );
  }

  const chart = (
    <ResponsiveContainer width="100%" height={embedded ? 256 : "85%"}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262c36" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#7d8694"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#7d8694"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={{
            background: "#181c23",
            border: "1px solid #262c36",
            borderRadius: 6,
            fontSize: 12,
          }}
          labelStyle={{ color: "#7d8694" }}
        />
        <Line
          type="monotone"
          dataKey="power"
          stroke="#60a5fa"
          strokeWidth={2}
          dot={{ r: 3, fill: "#60a5fa", strokeWidth: 0 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  if (embedded) {
    return <div className="h-64">{chart}</div>;
  }

  return (
    <div className="panel p-6 h-64 shadow-card">
      <h3 className="section-label mb-4">Live power draw (kW)</h3>
      {chart}
    </div>
  );
}
