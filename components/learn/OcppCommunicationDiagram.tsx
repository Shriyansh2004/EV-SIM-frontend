import { ArrowLeftRight, MessageSquare, Radio, Server } from "lucide-react";
import { DiagramPanel } from "./DiagramParts";

const MESSAGES = [
  { dir: "CP → CSMS", msg: "BootNotification", color: "text-matlab-green" },
  { dir: "CSMS → CP", msg: "BootNotification (Accepted)", color: "text-matlab-cyan" },
  { dir: "CP → CSMS", msg: "StatusNotification", color: "text-matlab-green" },
  { dir: "CSMS → CP", msg: "RequestStartTransaction", color: "text-matlab-cyan" },
  { dir: "CP → CSMS", msg: "TransactionEvent (Started)", color: "text-matlab-green" },
  { dir: "CP → CSMS", msg: "TransactionEvent (Updated)", color: "text-matlab-green" },
  { dir: "CP → CSMS", msg: "TransactionEvent (Ended)", color: "text-matlab-green" },
];

export function OcppCommunicationDiagram() {
  return (
    <DiagramPanel
      title="OCPP Communication"
      subtitle="JSON-RPC messages over a persistent WebSocket connection"
    >
      <div className="simulink-canvas p-6 min-w-[560px]">
        <div className="flex items-stretch gap-4">
          <div className="w-28 shrink-0 flex flex-col items-center">
            <div className="simulink-block text-matlab-green border-matlab-green w-full text-center py-3">
              Virtual
              <br />
              Charger
            </div>
            <div className="flex-1 w-px bg-matlab-green/40 my-2" />
            <p className="text-[9px] font-mono text-muted text-center">
              OCPP client
              <br />
              (mobilityhouse/ocpp)
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-2 px-2">
            <div className="flex items-center gap-2 w-full">
              <Radio className="w-4 h-4 text-matlab-blue shrink-0" />
              <div className="flex-1 bg-matlab-blue/10 border border-matlab-blue/30 rounded-matlab px-3 py-2 text-center">
                <p className="text-[10px] font-mono font-semibold text-matlab-blue">
                  WebSocket · /ocpp/{"{charger_id}"}
                </p>
                <p className="text-[9px] text-muted mt-0.5">
                  Persistent, bidirectional, full-duplex
                </p>
              </div>
              <ArrowLeftRight className="w-4 h-4 text-matlab-blue shrink-0" />
            </div>

            <div className="w-full space-y-1.5 mt-2">
              {MESSAGES.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-muted w-16 shrink-0 text-right">
                    {m.dir}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 simulink-block whitespace-nowrap ${m.color}`}
                  >
                    {m.msg}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              ))}
            </div>
          </div>

          <div className="w-28 shrink-0 flex flex-col items-center">
            <div className="simulink-block text-matlab-cyan border-matlab-cyan w-full text-center py-3">
              CSMS
              <br />
              Handler
            </div>
            <div className="flex-1 w-px bg-matlab-cyan/40 my-2" />
            <p className="text-[9px] font-mono text-muted text-center">
              ConnectedChargePoint
              <br />
              OCPP 2.0.1 server
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 bg-white border border-border rounded-matlab p-3">
          <MessageSquare className="w-4 h-4 text-matlab-purple shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-ink">Message format</p>
            <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
              Each OCPP call is a JSON array:{" "}
              <code className="font-mono text-[10px] bg-title-bar px-1">
                [MessageType, MessageId, Action, Payload]
              </code>
              . The charger initiates most messages; the CSMS can send commands like{" "}
              <span className="font-mono text-[10px]">RequestStartTransaction</span> at any time
              over the same socket.
            </p>
          </div>
          <Server className="w-4 h-4 text-muted shrink-0 mt-0.5 ml-auto hidden sm:block" />
        </div>
      </div>
    </DiagramPanel>
  );
}
