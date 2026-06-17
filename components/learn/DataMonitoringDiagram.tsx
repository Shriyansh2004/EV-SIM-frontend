import {
  Activity,
  Database,
  LayoutDashboard,
  Radio,
  Server,
  Wifi,
} from "lucide-react";
import { BidirectionalArrow, DiagramNode, DiagramPanel } from "./DiagramParts";

const MONITORING_PAGES = [
  { icon: LayoutDashboard, label: "Dashboard", detail: "Live metrics & charger grid" },
  { icon: Activity, label: "Sessions", detail: "Energy, power, SoC charts" },
  { icon: Radio, label: "OCPP Explorer", detail: "Raw message inspector" },
];

export function DataMonitoringDiagram() {
  return (
    <DiagramPanel
      title="Data Storage & Monitoring"
      subtitle="How charging data is persisted and displayed in real time"
    >
      <div className="simulink-canvas p-6 min-w-[600px]">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <DiagramNode
            icon={Server}
            label="CSMS Handler"
            sublabel="OCPP events"
            boxClass="bg-matlab-cyan/15 border-matlab-cyan/50"
            iconClass="text-matlab-blue"
          />
          <BidirectionalArrow label="write / read" />
          <div className="flex flex-col items-center gap-3">
            <DiagramNode
              icon={Database}
              label="SQLite DB"
              sublabel="chargers · sessions · meter_values"
              boxClass="bg-matlab-purple/10 border-matlab-purple/50"
              iconClass="text-matlab-purple"
            />
            <div className="bg-white border border-dashed border-border rounded-matlab px-3 py-1.5">
              <p className="text-[9px] font-mono text-muted text-center">
                + in-memory OCPP log
              </p>
            </div>
          </div>
          <BidirectionalArrow label="REST /api/*" />
          <DiagramNode
            icon={Wifi}
            label="Backend API"
            sublabel="FastAPI routes"
            boxClass="bg-matlab-blue/10 border-matlab-blue/50"
            iconClass="text-matlab-blue"
          />
          <BidirectionalArrow label="WS /ws/updates" />
          <DiagramNode
            icon={LayoutDashboard}
            label="Frontend"
            sublabel="Zustand store"
            boxClass="bg-matlab-orange/10 border-matlab-orange/50"
            iconClass="text-matlab-orange"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MONITORING_PAGES.map(({ icon: Icon, label, detail }) => (
            <div
              key={label}
              className="flex items-start gap-2.5 bg-white border border-border rounded-matlab p-3"
            >
              <div className="w-8 h-8 rounded-matlab bg-title-bar flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-matlab-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink">{label}</p>
                <p className="text-[10px] text-muted mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-white border border-border rounded-matlab p-3">
          <p className="text-xs font-semibold text-ink mb-2">Real-time update path</p>
          <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono text-muted">
            {[
              "OCPP message received",
              "→",
              "session_manager updated",
              "→",
              "broadcast via /ws/updates",
              "→",
              "frontend store refreshed",
              "→",
              "UI re-renders",
            ].map((part, i) => (
              <span
                key={i}
                className={
                  part === "→"
                    ? "text-matlab-blue font-bold"
                    : "bg-title-bar px-1.5 py-0.5 rounded-matlab"
                }
              >
                {part}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DiagramPanel>
  );
}
