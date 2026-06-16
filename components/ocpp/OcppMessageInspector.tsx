import { OCPP_FIELD_DESCRIPTIONS } from "@/types";
import type { OcppMessage } from "@/types";

export function OcppMessageInspector({ message }: { message: OcppMessage | null }) {
  if (!message) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 text-muted text-sm">
        Select a message to inspect
      </div>
    );
  }

  const description = OCPP_FIELD_DESCRIPTIONS[message.action];

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
      <div>
        <h3 className="text-white font-medium">{message.action}</h3>
        <p className="text-muted text-sm mt-1">
          {message.direction === "CP_TO_CSMS" ? "Charge Point → CSMS" : "CSMS → Charge Point"} ·{" "}
          {message.messageType}
        </p>
      </div>
      {description && (
        <div className="bg-background rounded-lg p-3 text-sm text-muted border border-border">
          <span className="text-accent font-medium">?</span> {description}
        </div>
      )}
      <pre className="bg-background rounded-lg p-4 text-xs font-mono text-green-400 overflow-auto max-h-96 border border-border">
        {JSON.stringify(message.payload, null, 2)}
      </pre>
    </div>
  );
}
