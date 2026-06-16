"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function SocGauge({ soc }: { soc: number }) {
  const data = [
    { name: "SoC", value: soc },
    { name: "Remaining", value: 100 - soc },
  ];
  const color = soc > 80 ? "#00D4AA" : soc > 40 ? "#3B82F6" : "#F59E0B";

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-sm text-muted mb-2 text-center">State of Charge</h3>
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#30363D" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-semibold text-white">{soc.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
