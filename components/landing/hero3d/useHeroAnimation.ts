"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { OCPP_MESSAGES } from "./constants";
import { heroAnimationState, resetHeroAnimationState } from "./animationState";

export function useHeroAnimation(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    resetHeroAnimationState();
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });

    tl.to(heroAnimationState, { connectorGlow: 0.35, duration: 2, ease: "none" }, 0)
      .to(heroAnimationState, { connectorGlow: 1, duration: 0.6, yoyo: true, repeat: 1 }, 2)
      .to(
        heroAnimationState,
        {
          streamOpacity: 1,
          streamProgress: 1,
          labelOpacity: 1,
          duration: 2.8,
          ease: "power1.inOut",
          onUpdate: () => {
            heroAnimationState.labelIndex = Math.min(
              OCPP_MESSAGES.length - 1,
              Math.floor(heroAnimationState.streamProgress * OCPP_MESSAGES.length),
            );
          },
        },
        3,
      )
      .to(heroAnimationState, { serverPulse: 1, duration: 0.35, ease: "power2.out" }, 6)
      .to(heroAnimationState, { serverPulse: 0, duration: 0.45, ease: "power2.in" }, 6.55)
      .to(
        heroAnimationState,
        {
          streamOpacity: 0,
          streamProgress: 0,
          labelOpacity: 0,
          connectorGlow: 0.25,
          duration: 0.85,
          ease: "power2.inOut",
        },
        7.1,
      );

    return () => {
      tl.kill();
      resetHeroAnimationState();
    };
  }, [enabled]);
}
