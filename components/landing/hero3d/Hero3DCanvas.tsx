"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { SceneContent } from "./SceneContent";
import { Hero3DPlaceholder } from "./Hero3DPlaceholder";

type Hero3DCanvasProps = {
  enableParallax: boolean;
  enableReflections: boolean;
  enableContactShadows: boolean;
  particleCount: number;
  animate: boolean;
  onReady?: () => void;
};

export default function Hero3DCanvas({
  enableParallax,
  enableReflections,
  enableContactShadows,
  particleCount,
  animate,
  onReady,
}: Hero3DCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Hero3DPlaceholder className="w-full h-full min-h-[260px] md:min-h-[340px]" />;
  }

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 38, near: 0.1, far: 40, position: [6.2, 4.4, 6.8] }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      className="!bg-transparent"
    >
      <Suspense fallback={null}>
        <SceneContent
          enableParallax={enableParallax}
          enableReflections={enableReflections}
          enableContactShadows={enableContactShadows}
          particleCount={particleCount}
          animate={animate}
          onReady={onReady}
        />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
