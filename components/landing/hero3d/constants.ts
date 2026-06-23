import { content } from "@/lib/content";

export const ACCENT_ORANGE = "#FF6B1A";
export const BG_PRIMARY = "#FAFAF8";

export const OCPP_MESSAGES = content.landing.hero.visual.ocppMessages;

export const SCENE_CAMERA = {
  position: [4.6, 3.2, 5.4] as [number, number, number],
  target: [-0.35, 0.58, 0.28] as [number, number, number],
  fov: 36,
} as const;

export const SCENE_ANCHORS = {
  car: { position: [-1.65, 0, 0.18] as [number, number, number], rotation: [0, 0.68, 0] as [number, number, number], scale: 1.12 },
  charger: { position: [0.12, 0, 0] as [number, number, number], rotation: [0, -0.52, 0] as [number, number, number], scale: 0.0125 },
  server: { position: [2.3, 0, -0.05] as [number, number, number], rotation: [0, -0.45, 0] as [number, number, number], scale: 0.55 },
  cable: {
    carPort: [-0.92, 0.4, 0.4] as [number, number, number],
    chargerPort: [0.22, 0.9, 0.34] as [number, number, number],
  },
  stream: {
    start: [0.3, 1.02, 0.3] as [number, number, number],
    mid: [1.25, 1.95, 0.04] as [number, number, number],
    end: [2.15, 1.28, -0.04] as [number, number, number],
  },
} as const;

export type HeroAnimationState = {
  connectorGlow: number;
  streamOpacity: number;
  streamProgress: number;
  serverPulse: number;
  labelOpacity: number;
  labelIndex: number;
};

export const INITIAL_ANIMATION_STATE: HeroAnimationState = {
  connectorGlow: 0.25,
  streamOpacity: 0,
  streamProgress: 0,
  serverPulse: 0,
  labelOpacity: 0,
  labelIndex: 0,
};
