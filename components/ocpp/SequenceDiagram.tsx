const STEPS = [
  { label: "BootNotification", side: "cp" },
  { label: "BootNotification Response", side: "csms" },
  { label: "StatusNotification", side: "cp" },
  { label: "Heartbeat", side: "cp" },
  { label: "Authorize", side: "cp" },
  { label: "TransactionEvent (Started)", side: "cp" },
  { label: "MeterValues / Updated", side: "cp" },
  { label: "TransactionEvent (Ended)", side: "cp" },
];

export function SequenceDiagram() {
  return (
    <div className="panel shadow-card overflow-x-auto">
      <div className="panel-header py-2">
        <h3 className="section-label">Simulink: OCPP 2.0.1 Charging Sequence</h3>
      </div>
      <div className="panel-body simulink-canvas p-6 min-w-[500px]">
        <div className="flex items-start gap-8">
          <div className="text-center">
            <div className="simulink-block text-matlab-green border-matlab-green w-24 text-center">
              Charge Point
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`h-px flex-1 ${
                    step.side === "cp" ? "bg-matlab-green" : "bg-matlab-cyan"
                  }`}
                />
                <span className="text-[10px] font-mono text-ink whitespace-nowrap px-2 py-1 simulink-block">
                  {step.label}
                </span>
                <div
                  className={`h-px flex-1 ${
                    step.side === "cp" ? "bg-matlab-green/30" : "bg-matlab-cyan/30"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="simulink-block text-matlab-cyan border-matlab-cyan w-24 text-center">
              CSMS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
