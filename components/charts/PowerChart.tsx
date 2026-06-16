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

export function PowerChart({ chargers }: { chargers: VirtualCharger[] }) {
  const data = chargers
    .filter((c) => c.currentSession && c.currentSession.currentPowerKw > 0)
    .map((c) => ({
      name: c.id,
      power: c.currentSession?.currentPowerKw ?? 0,
    }));

  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 h-64 flex items-center justify-center text-muted text-sm">
        No active charging sessions
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-64">
      <h3 className="text-sm text-muted mb-4">Live Power Draw (kW)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
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
          <Line type="monotone" dataKey="power" stroke="#3B82F6" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
