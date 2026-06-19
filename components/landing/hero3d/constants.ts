export const ACCENT_ORANGE = "#FF6B1A";
export const BG_PRIMARY = "#FAFAF8";

export const OCPP_MESSAGES = [
  "BootNotification →",
  "Heartbeat →",
  "MeterValues →",
] as const;

export const SCENE_ANCHORS = {
  car: { position: [-2.6, 0, 0.35] as [number, number, number], rotation: [0, 0.55, 0] as [number, number, number], scale: 1.15 },
  charger: { position: [0, 0, 0] as [number, number, number], rotation: [0, -0.35, 0] as [number, number, number], scale: 0.011 },
  server: { position: [2.55, 0, -0.1] as [number, number, number], rotation: [0, -0.45, 0] as [number, number, number], scale: 0.55 },
  cable: {
    carPort: [-1.85, 0.42, 0.55] as [number, number, number],
    chargerPort: [0.18, 0.95, 0.42] as [number, number, number],
  },
  stream: {
    start: [0.22, 1.05, 0.38] as [number, number, number],
    mid: [1.35, 2.15, 0.05] as [number, number, number],
    end: [2.35, 1.35, -0.05] as [number, number, number],
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
