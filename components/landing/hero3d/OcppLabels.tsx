"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { OCPP_MESSAGES, SCENE_ANCHORS } from "./constants";
import { heroAnimationState } from "./animationState";

export function OcppLabels() {
  const labelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelPos = SCENE_ANCHORS.stream.mid;

  useFrame(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = String(heroAnimationState.labelOpacity);
    }
    if (labelRef.current) {
      labelRef.current.textContent = OCPP_MESSAGES[heroAnimationState.labelIndex];
    }
  });

  return (
    <Html position={[labelPos[0], labelPos[1] + 0.2, labelPos[2]]} center distanceFactor={7.5}>
      <div ref={wrapperRef} style={{ pointerEvents: "none", opacity: 0 }}>
        <div
          ref={labelRef}
          className="font-lp-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md border whitespace-nowrap shadow-sm"
          style={{
            color: "var(--accent-orange)",
            background: "var(--accent-orange-soft)",
            borderColor: "color-mix(in srgb, var(--accent-orange) 35%, transparent)",
          }}
        >
          {OCPP_MESSAGES[0]}
        </div>
      </div>
    </Html>
  );
}
