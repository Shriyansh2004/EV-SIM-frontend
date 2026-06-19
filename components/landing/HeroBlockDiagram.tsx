"use client";

import { useEffect, useState } from "react";

const OCPP_MESSAGES = [
  "BootNotification →",
  "StatusNotification →",
  "Heartbeat →",
  "TransactionEvent →",
];

const EV_MESSAGES = ["Plug / Charge →", "SoC sync →", "MeterValues →"];

function Block({
  x,
  y,
  w,
  h,
  lines,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: { text: string; size?: number; fill?: string }[];
}) {
  const cx = x + w / 2;
  const lineHeight = 17;
  const startY = y + h / 2 - ((lines.length - 1) * lineHeight) / 2 + 4;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        fill="var(--bg-surface)"
        stroke="var(--grey-300)"
        strokeWidth="1.5"
      />
      {lines.map((line, i) => (
        <text
          key={line.text}
          x={cx}
          y={startY + i * lineHeight}
          textAnchor="middle"
          style={{
            fontSize: `${line.size ?? (i === 0 ? 11 : 10)}px`,
            fill: line.fill ?? (i === 0 ? "var(--grey-900)" : "var(--grey-600)"),
            fontFamily: "var(--font-jetbrains-mono)",
            fontWeight: i === 0 ? 600 : 400,
          }}
        >
          {line.text}
        </text>
      ))}
    </g>
  );
}

function Connection({
  x1,
  x2,
  y,
  animate,
  reducedMotion,
  delay = 0,
}: {
  x1: number;
  x2: number;
  y: number;
  animate: boolean;
  reducedMotion: boolean;
  delay?: number;
}) {
  const path = `M ${x1} ${y} L ${x2} ${y}`;
  const midX = (x1 + x2) / 2;

  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke="var(--grey-300)"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      {animate && !reducedMotion ? (
        <>
          <circle r="3.5" fill="var(--accent-orange)">
            <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${delay}s`} path={path} />
          </circle>
          <circle r="3" fill="var(--accent-orange)" opacity="0.65">
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              begin={`${delay + 0.8}s`}
              path={path}
            />
          </circle>
        </>
      ) : (
        <circle cx={midX} cy={y} r="3.5" fill="var(--accent-orange)" opacity="0.85" />
      )}
    </g>
  );
}

export function HeroBlockDiagram() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [evMsgIndex, setEvMsgIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % OCPP_MESSAGES.length);
      setEvMsgIndex((i) => (i + 1) % EV_MESSAGES.length);
    }, 4800);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const blockY = 72;
  const blockH = 80;
  const blockW = 100;
  const evX = 16;
  const chargerX = 168;
  const csmsX = 420;
  const lineY = 112;

  return (
    <div
      className="relative bg-lp-surface border border-lp-grey-300 rounded-lp-xl shadow-lp-card overflow-hidden"
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-lp-grey-300 bg-lp-grey-100/60">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-lp-grey-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-lp-grey-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-lp-grey-300" />
        </div>
        <span className="ml-2 text-[11px] font-lp-mono text-lp-grey-600">
          simulink_canvas.ocpp
        </span>
      </div>

      <div
        className="relative p-6 md:p-8 min-h-[280px] md:min-h-[300px]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--grey-300) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <svg
          viewBox="0 0 536 220"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Block
            x={evX}
            y={blockY}
            w={blockW}
            h={blockH}
            lines={[{ text: "EV" }, { text: "Virtual" }, { text: "SoC · kWh", size: 9 }]}
          />
          <Block
            x={chargerX}
            y={blockY}
            w={blockW}
            h={blockH}
            lines={[
              { text: "Virtual" },
              { text: "Charger" },
              { text: "OCPP 2.0.1", size: 9 },
            ]}
          />
          <Block
            x={csmsX}
            y={blockY}
            w={blockW}
            h={blockH}
            lines={[
              { text: "CSMS" },
              { text: "Handler" },
              { text: "WebSocket", size: 9 },
            ]}
          />

          <Connection
            x1={evX + blockW}
            x2={chargerX}
            y={lineY}
            animate
            reducedMotion={reducedMotion}
          />

          <line
            x1={chargerX + blockW}
            y1={lineY}
            x2={csmsX}
            y2={lineY}
            stroke="var(--grey-300)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {!reducedMotion ? (
            <>
              <circle r="4" fill="var(--accent-orange)">
                <animateMotion
                  dur="2.4s"
                  repeatCount="indefinite"
                  path={`M ${chargerX + blockW} ${lineY} L ${csmsX} ${lineY}`}
                />
              </circle>
              <circle r="4" fill="var(--accent-orange)" opacity="0.7">
                <animateMotion
                  dur="2.4s"
                  repeatCount="indefinite"
                  begin="0.8s"
                  path={`M ${chargerX + blockW} ${lineY} L ${csmsX} ${lineY}`}
                />
              </circle>
              <circle r="3" fill="var(--accent-orange)" opacity="0.5">
                <animateMotion
                  dur="2.4s"
                  repeatCount="indefinite"
                  begin="1.6s"
                  path={`M ${chargerX + blockW} ${lineY} L ${csmsX} ${lineY}`}
                />
              </circle>
            </>
          ) : (
            <>
              <circle
                cx={(chargerX + blockW + csmsX) / 2}
                cy={lineY}
                r="4"
                fill="var(--accent-orange)"
              />
              <circle
                cx={(chargerX + blockW + csmsX) / 2 + 20}
                cy={lineY}
                r="3"
                fill="var(--accent-orange)"
                opacity="0.6"
              />
            </>
          )}

          <rect
            x={(evX + blockW + chargerX) / 2 - 48}
            y="162"
            width="96"
            height="22"
            rx="6"
            fill="var(--accent-orange-soft)"
            stroke="var(--accent-orange)"
            strokeWidth="0.5"
            opacity="0.9"
          />
          <text
            x={(evX + blockW + chargerX) / 2}
            y="177"
            textAnchor="middle"
            style={{
              fontSize: "9px",
              fill: "var(--accent-orange)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
            className={reducedMotion ? "" : "hero-ocpp-label"}
          >
            {EV_MESSAGES[evMsgIndex]}
          </text>

          <rect
            x={(chargerX + blockW + csmsX) / 2 - 52}
            y="162"
            width="104"
            height="22"
            rx="6"
            fill="var(--accent-orange-soft)"
            stroke="var(--accent-orange)"
            strokeWidth="0.5"
            opacity="0.9"
          />
          <text
            x={(chargerX + blockW + csmsX) / 2}
            y="177"
            textAnchor="middle"
            style={{
              fontSize: "9px",
              fill: "var(--accent-orange)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
            className={reducedMotion ? "" : "hero-ocpp-label"}
          >
            {OCPP_MESSAGES[msgIndex]}
          </text>
        </svg>
      </div>
    </div>
  );
}
