"use client";

import clsx from "clsx";

interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

const PRESETS: Record<string, { nodes: FlowNode[]; edges: FlowEdge[] }> = {
  boot: {
    nodes: [
      { id: "cp", label: "Charge Point", sublabel: "CP-DEMO" },
      { id: "csms", label: "CSMS", sublabel: "WebSocket" },
    ],
    edges: [{ from: "cp", to: "csms", label: "BootNotification" }],
  },
  charging: {
    nodes: [
      { id: "ev", label: "Electric Vehicle" },
      { id: "cp", label: "Charge Point" },
      { id: "csms", label: "CSMS" },
    ],
    edges: [
      { from: "ev", to: "cp", label: "Power" },
      { from: "cp", to: "csms", label: "OCPP" },
    ],
  },
  transaction: {
    nodes: [
      { id: "start", label: "Started" },
      { id: "meter", label: "MeterValues" },
      { id: "end", label: "Ended" },
    ],
    edges: [
      { from: "start", to: "meter", label: "Updated" },
      { from: "meter", to: "end", label: "Ended" },
    ],
  },
  websocket: {
    nodes: [
      { id: "connect", label: "Connect" },
      { id: "boot", label: "Boot" },
      { id: "operate", label: "Operate" },
    ],
    edges: [
      { from: "connect", to: "boot", label: "WS open" },
      { from: "boot", to: "operate", label: "Accepted" },
    ],
  },
  session: {
    nodes: [
      { id: "start", label: "Remote Start" },
      { id: "charge", label: "Charging" },
      { id: "stop", label: "Remote Stop" },
    ],
    edges: [
      { from: "start", to: "charge", label: "TransactionEvent" },
      { from: "charge", to: "stop", label: "Ended" },
    ],
  },
};

export function InlineOcppDiagram({
  variant,
  nodes: nodesProp,
  edges: edgesProp,
  className,
}: {
  variant?: keyof typeof PRESETS;
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  className?: string;
}) {
  const preset = variant ? PRESETS[variant] : null;
  const nodes = nodesProp ?? preset?.nodes ?? [];
  const edges = edgesProp ?? preset?.edges ?? [];

  if (nodes.length === 0) return null;

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const nodeIds = nodes.map((n) => n.id);
  const nodeWidth = 120;
  const nodeHeight = 56;
  const gap = 48;
  const padding = 16;
  const width = padding * 2 + nodeIds.length * nodeWidth + (nodeIds.length - 1) * gap;
  const height = padding * 2 + nodeHeight + 24;

  const positions: Record<string, { x: number; y: number }> = {};
  nodeIds.forEach((id, i) => {
    positions[id] = {
      x: padding + i * (nodeWidth + gap),
      y: padding,
    };
  });

  return (
    <div
      className={clsx(
        "docs-inline-diagram my-8 rounded-xl border border-lp-grey-300 bg-lp-surface p-4 overflow-x-auto",
        className
      )}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[320px] h-auto"
        role="img"
        aria-label="OCPP message flow diagram"
      >
        {edges.map((edge) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          const x1 = from.x + nodeWidth;
          const x2 = to.x;
          const y = from.y + nodeHeight / 2;
          const midX = (x1 + x2) / 2;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke="var(--grey-300)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <circle cx={midX} cy={y} r="3" fill="var(--accent-orange)" />
              {edge.label && (
                <text
                  x={midX}
                  y={y - 8}
                  textAnchor="middle"
                  style={{
                    fontSize: "9px",
                    fill: "var(--grey-600)",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {nodeIds.map((id) => {
          const pos = positions[id];
          const node = nodeMap[id];
          if (!pos || !node) return null;

          return (
            <g key={id}>
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={nodeHeight}
                rx="10"
                fill="var(--bg-surface)"
                stroke="var(--grey-300)"
                strokeWidth="1.5"
              />
              <text
                x={pos.x + nodeWidth / 2}
                y={pos.y + (node.sublabel ? 22 : 32)}
                textAnchor="middle"
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  fill: "var(--grey-900)",
                  fontFamily: "var(--font-inter-tight)",
                }}
              >
                {node.label}
              </text>
              {node.sublabel && (
                <text
                  x={pos.x + nodeWidth / 2}
                  y={pos.y + 38}
                  textAnchor="middle"
                  style={{
                    fontSize: "9px",
                    fill: "var(--grey-600)",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {node.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
