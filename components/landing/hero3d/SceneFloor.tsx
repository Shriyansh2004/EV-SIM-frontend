"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import { BG_PRIMARY } from "./constants";

type SceneFloorProps = {
  enableReflections: boolean;
};

export function SceneFloor({ enableReflections }: SceneFloorProps) {
  const color = useMemo(() => BG_PRIMARY, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
      <planeGeometry args={[14, 10]} />
      {enableReflections ? (
        <MeshReflectorMaterial
          blur={[280, 120]}
          resolution={768}
          mixBlur={0.85}
          mixStrength={0.35}
          roughness={0.75}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.25}
          color={color}
          metalness={0.15}
          mirror={0.25}
        />
      ) : (
        <meshStandardMaterial color={color} roughness={0.92} metalness={0.05} />
      )}
    </mesh>
  );
}
