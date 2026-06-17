import { BatteryCharging, Car, Plug, Zap } from "lucide-react";
import { DiagramPanel, FlowArrow, FlowStep } from "./DiagramParts";

export function ChargingWorkflowDiagram() {
  return (
    <DiagramPanel
      title="EV Charging Workflow"
      subtitle="Step-by-step flow from plug-in to completed session"
    >
      <div className="bg-[#d4ecef] border-t border-border p-6">
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-matlab-green/50 flex items-center justify-center shadow-card">
              <Car className="w-7 h-7 text-ink" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-semibold text-ink">Electric Vehicle</span>
          </div>
          <div className="flex items-center gap-1 text-muted">
            <div className="w-8 h-0.5 bg-ink/40" />
            <Plug className="w-4 h-4" />
            <div className="w-8 h-0.5 bg-ink/40" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-matlab-blue/50 flex items-center justify-center shadow-card">
              <Zap className="w-7 h-7 text-matlab-blue" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-semibold text-ink">Charge Point</span>
          </div>
          <div className="flex items-center gap-1 text-muted">
            <div className="w-8 h-0.5 bg-ink/40" />
            <BatteryCharging className="w-4 h-4 text-matlab-green" />
            <div className="w-8 h-0.5 bg-ink/40" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-matlab-green/15 border-2 border-matlab-green/50 flex items-center justify-center shadow-card">
              <span className="text-sm font-bold text-matlab-green font-mono">CSMS</span>
            </div>
            <span className="text-[10px] font-semibold text-ink">Management</span>
          </div>
        </div>

        <div className="max-w-lg mx-auto space-y-0">
          <FlowStep
            step={1}
            title="Register & connect"
            description="Virtual charger connects via WebSocket and sends BootNotification. CSMS accepts and marks the charger Available."
          />
          <FlowArrow />
          <FlowStep
            step={2}
            title="Remote start"
            description="Operator clicks Remote Start in the dashboard. Backend sends RequestStartTransaction to the charger over OCPP."
          />
          <FlowArrow />
          <FlowStep
            step={3}
            title="Session begins"
            description="Charger sends TransactionEvent (Started). CSMS creates a session and begins tracking energy, power, and state of charge."
            active
          />
          <FlowArrow />
          <FlowStep
            step={4}
            title="Energy delivery"
            description="Every few seconds the charger reports TransactionEvent (Updated) with meter values — kWh delivered, kW draw, and SoC %."
          />
          <FlowArrow />
          <FlowStep
            step={5}
            title="Session ends"
            description="Remote Stop or natural completion triggers TransactionEvent (Ended). Session is closed and totals are saved to the database."
          />
        </div>
      </div>
    </DiagramPanel>
  );
}
