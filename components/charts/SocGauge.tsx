"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MATLAB_COLORS } from "@/lib/chartTheme";

export function SocGauge({ soc }: { soc: number }) {
  const data = [
    { name: "SoC", value: soc },
    { name: "Remaining", value: 100 - soc },
  ];
  const color =
    soc > 80 ? MATLAB_COLORS.green : soc > 40 ? MATLAB_COLORS.blue : MATLAB_COLORS.orange;

  return (
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <h3 className="section-label">Scope: State of Charge</h3>
      </div>
      <div className="panel-body">
        <div className="matlab-figure relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={78}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="#212121"
                strokeWidth={1}
              >
                <Cell fill={color} />
                <Cell fill="#e6e6e6" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="scope-readout text-3xl">{soc.toFixed(0)}</span>
            <span className="scope-readout-label mt-0.5">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
