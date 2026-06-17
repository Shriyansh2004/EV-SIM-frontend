import { OCPP_FIELD_DESCRIPTIONS } from "@/types";
import type { OcppMessage } from "@/types";

export function OcppMessageInspector({ message }: { message: OcppMessage | null }) {
  if (!message) {
    return (
      <div className="panel p-6 text-muted text-sm shadow-card">
        Select a message to inspect
      </div>
    );
  }

  const description = OCPP_FIELD_DESCRIPTIONS[message.action];

  return (
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <h3 className="section-label">Inspector: {message.action}</h3>
      </div>
      <div className="panel-body space-y-4">
        <div>
          <p className="text-muted text-sm font-mono">
            {message.direction === "CP_TO_CSMS" ? "Charge Point → CSMS" : "CSMS → Charge Point"} ·{" "}
            {message.messageType}
          </p>
        </div>
        {description && (
          <div className="matlab-cmd text-sm text-muted">
            <span className="text-matlab-blue font-semibold">?</span> {description}
          </div>
        )}
        <pre className="matlab-cmd text-[11px] text-matlab-green max-h-96">
          {JSON.stringify(message.payload, null, 2)}
        </pre>
      </div>
    </div>
  );
}
