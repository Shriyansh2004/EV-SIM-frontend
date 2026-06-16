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

export function MeterValueChart({ meterValues }: { meterValues: MeterValue[] }) {
  const data = meterValues.map((mv) => ({
    time: new Date(mv.timestamp).toLocaleTimeString(),
    power: mv.powerKw,
    energy: mv.energyKwh,
    soc: mv.socPercent,
  }));

  if (data.length === 0) {
    return (
      <div className="text-muted text-sm text-center py-8">No meter values recorded</div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
        <XAxis dataKey="time" stroke="#8B949E" fontSize={11} />
        <YAxis stroke="#8B949E" fontSize={11} />
        <Tooltip
          contentStyle={{
            background: "#161B22",
            border: "1px solid #30363D",
            borderRadius: 8,
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="power" stroke="#3B82F6" name="Power (kW)" dot={false} />
        <Line type="monotone" dataKey="energy" stroke="#00D4AA" name="Energy (kWh)" dot={false} />
        <Line type="monotone" dataKey="soc" stroke="#F59E0B" name="SoC (%)" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
