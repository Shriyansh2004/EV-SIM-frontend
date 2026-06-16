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
      <div className="bg-surface border border-border rounded-xl p-6 h-64 flex items-center justify-center text-muted text-sm">
        No session energy data
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-64">
      <h3 className="text-sm text-muted mb-4">Energy per Session (kWh)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
          <XAxis dataKey="name" stroke="#8B949E" fontSize={12} />
          <YAxis stroke="#8B949E" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "#161B22",
              border: "1px solid #30363D",
              borderRadius: 8,
            }}
          />
          <Bar dataKey="energy" fill="#00D4AA" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
