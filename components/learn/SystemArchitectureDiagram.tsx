import { Cloud, Code2, Database, Laptop, PlugZap } from "lucide-react";
import { BidirectionalArrow, DiagramNode, DiagramPanel } from "./DiagramParts";

export function SystemArchitectureDiagram() {
  return (
    <DiagramPanel
      title="System Architecture"
      subtitle="How EV-SIM components connect end-to-end"
    >
      <div className="bg-[#d4ecef] border-t border-border p-6 md:p-8 min-w-[640px]">
        <div className="flex items-center justify-center gap-1 md:gap-2">
          <DiagramNode
            icon={PlugZap}
            label="Virtual Charger"
            sublabel="Simulated CP client"
            boxClass="bg-white border-matlab-green/50"
            iconClass="text-matlab-green"
          />
          <BidirectionalArrow label="OCPP 2.0.1 · WebSocket" />
          <DiagramNode
            icon={Cloud}
            label="CSMS"
            sublabel="Charge point handler"
            boxClass="bg-matlab-cyan/15 border-matlab-cyan/60"
            iconClass="text-matlab-blue"
          />
          <BidirectionalArrow label="Internal routing" />
          <div className="flex flex-col items-center gap-3">
            <DiagramNode
              icon={Code2}
              label="Backend"
              sublabel="FastAPI · :8000"
              boxClass="bg-matlab-blue/10 border-matlab-blue/50"
              iconClass="text-matlab-blue"
            />
            <BidirectionalArrow label="SQLite · REST" vertical />
            <DiagramNode
              icon={Database}
              label="Database"
              sublabel="Sessions & chargers"
              boxClass="bg-matlab-purple/10 border-matlab-purple/50"
              iconClass="text-matlab-purple"
            />
          </div>
          <BidirectionalArrow label="REST + WS" />
          <DiagramNode
            icon={Laptop}
            label="Frontend"
            sublabel="Next.js dashboard"
            boxClass="bg-matlab-orange/10 border-matlab-orange/50"
            iconClass="text-matlab-orange"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
          {[
            { label: "Charger ↔ CSMS", detail: "ws://host/ocpp/{id}" },
            { label: "CSMS ↔ Backend", detail: "Shared process, OCPP handlers" },
            { label: "Backend ↔ DB", detail: "Chargers, sessions, meter values" },
            { label: "Backend ↔ UI", detail: "/api/* + /ws/updates" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/70 border border-border/60 rounded-matlab px-2 py-2"
            >
              <p className="text-[10px] font-semibold text-ink">{item.label}</p>
              <p className="text-[9px] font-mono text-muted mt-0.5">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </DiagramPanel>
  );
}
