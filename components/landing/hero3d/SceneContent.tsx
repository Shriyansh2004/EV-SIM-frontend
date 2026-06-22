"use client";

import { Suspense, useEffect } from "react";
import { ContactShadows } from "@react-three/drei";
import { SceneFloor } from "./SceneFloor";
import { SceneLighting } from "./SceneLighting";
import { SceneModels } from "./SceneModels";
import { ChargingCable } from "./ChargingCable";
import { DataStream } from "./DataStream";
import { OcppLabels } from "./OcppLabels";
import { SceneControls } from "./SceneControls";
import { useHeroAnimation } from "./useHeroAnimation";

type SceneContentProps = {
  enableOrbitControls: boolean;
  enableReflections: boolean;
  enableContactShadows: boolean;
  particleCount: number;
  animate: boolean;
  onReady?: () => void;
};

function SceneLoader() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#d8d5d0" wireframe />
    </mesh>
  );
}

function SceneReady({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export function SceneContent({
  enableOrbitControls,
  enableReflections,
  enableContactShadows,
  particleCount,
  animate,
  onReady,
}: SceneContentProps) {
  useHeroAnimation(animate);

  return (
    <>
      <SceneControls enabled={enableOrbitControls} />
      <SceneLighting />
      <Suspense fallback={<SceneLoader />}>
        <SceneModels />
        <ChargingCable />
        <DataStream particleCount={particleCount} />
        <OcppLabels />
        <SceneFloor enableReflections={enableReflections} />
        {enableContactShadows ? (
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.35}
            scale={12}
            blur={2.4}
            far={4.5}
            color="#2b2a28"
          />
        ) : null}
        <SceneReady onReady={onReady} />
      </Suspense>
    </>
  );
}
