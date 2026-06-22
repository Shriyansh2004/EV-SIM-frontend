"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "full" | "reduced" | "static";

function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "static";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (reducedMotion) return "static";
  if (isMobile && (cores <= 4 || memory <= 4)) return "static";
  if (isMobile || isTouch || cores <= 4 || memory <= 4) return "reduced";
  return "full";
}

export function useDeviceCapabilities() {
  const [tier, setTier] = useState<DeviceTier>("static");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setTier(detectTier());

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchMq = window.matchMedia("(pointer: coarse)");
    const mobileMq = window.matchMedia("(max-width: 767px)");

    const update = () => setTier(detectTier());
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    const onTouch = (e: MediaQueryListEvent) => setIsTouch(e.matches);

    setReducedMotion(motionMq.matches);
    setIsTouch(touchMq.matches);

    motionMq.addEventListener("change", onMotion);
    touchMq.addEventListener("change", onTouch);
    mobileMq.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      motionMq.removeEventListener("change", onMotion);
      touchMq.removeEventListener("change", onTouch);
      mobileMq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return {
    tier,
    reducedMotion,
    isTouch,
    enableOrbitControls: tier !== "static",
    enableReflections: tier === "full",
    enableContactShadows: tier !== "static",
    particleCount: tier === "full" ? 24 : tier === "reduced" ? 10 : 0,
    useLiveScene: tier !== "static",
  };
}
