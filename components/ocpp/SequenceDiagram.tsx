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
    <div className="bg-surface border border-border rounded-xl p-6 overflow-x-auto">
      <h3 className="text-sm text-muted mb-6">OCPP 2.0.1 Charging Sequence</h3>
      <div className="flex items-start gap-8 min-w-[500px]">
        <div className="text-center">
          <div className="w-24 py-2 bg-accent/20 border border-accent rounded text-accent text-xs font-mono">
            Charge Point
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`h-px flex-1 ${
                  step.side === "cp" ? "bg-green-500" : "bg-cyan-500"
                }`}
              />
              <span className="text-xs font-mono text-white whitespace-nowrap px-2 py-1 bg-background rounded border border-border">
                {step.label}
              </span>
              <div
                className={`h-px flex-1 ${
                  step.side === "cp" ? "bg-green-500/30" : "bg-cyan-500/30"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="w-24 py-2 bg-cyan-500/20 border border-cyan-500 rounded text-cyan-400 text-xs font-mono">
            CSMS
          </div>
        </div>
      </div>
    </div>
  );
}
