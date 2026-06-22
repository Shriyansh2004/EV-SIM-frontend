"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Rotate3d } from "lucide-react";
import { Hero3DPlaceholder } from "./Hero3DPlaceholder";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

const Hero3DCanvas = dynamic(() => import("./Hero3DCanvas"), {
  ssr: false,
  loading: () => <Hero3DPlaceholder className="w-full h-full min-h-[260px] md:min-h-[340px]" />,
});

export function Hero3DVisual() {
  const {
    useLiveScene,
    enableOrbitControls,
    enableReflections,
    enableContactShadows,
    particleCount,
    reducedMotion,
    isTouch,
  } = useDeviceCapabilities();
  const [sceneReady, setSceneReady] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (!useLiveScene) return;
    const id = window.requestAnimationFrame(() => setShowCanvas(true));
    return () => window.cancelAnimationFrame(id);
  }, [useLiveScene]);

  if (!useLiveScene) {
    return (
      <div className="relative w-full min-h-[240px] sm:min-h-[280px] md:min-h-[340px]">
        <Hero3DPlaceholder className="w-full h-full min-h-[240px] sm:min-h-[280px] md:min-h-[340px]" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-[240px] sm:min-h-[280px] md:min-h-[340px] rounded-2xl overflow-hidden"
      role="img"
      aria-label="Interactive 3D view of an electric vehicle charging at a charge point. Drag to rotate the view."
    >
      <Hero3DPlaceholder
        className={clsx(
          "absolute inset-0 w-full h-full min-h-[240px] sm:min-h-[280px] md:min-h-[340px] transition-opacity duration-700",
          sceneReady ? "opacity-0" : "opacity-100",
        )}
      />
      {showCanvas ? (
        <div
          className={clsx(
            "absolute inset-0 transition-opacity duration-700",
            sceneReady ? "opacity-100" : "opacity-0",
          )}
        >
          <Hero3DCanvas
            enableOrbitControls={enableOrbitControls}
            enableReflections={enableReflections}
            enableContactShadows={enableContactShadows}
            particleCount={particleCount}
            animate={!reducedMotion}
            onReady={() => setSceneReady(true)}
          />
        </div>
      ) : null}
      {sceneReady && enableOrbitControls ? (
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 pointer-events-none z-10 flex items-center gap-1.5 rounded-full border border-lp-grey-200/80 bg-white/85 backdrop-blur-sm px-2.5 py-1 shadow-sm">
          <Rotate3d className="w-3 h-3 text-lp-grey-500 shrink-0" aria-hidden />
          <span className="font-lp-mono text-[9px] sm:text-[10px] text-lp-grey-500 tracking-wide">
            {isTouch ? "Drag to rotate" : "Drag to explore"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
