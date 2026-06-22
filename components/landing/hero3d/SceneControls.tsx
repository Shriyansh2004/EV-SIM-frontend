"use client";

import { useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE_CAMERA } from "./constants";

type SceneControlsProps = {
  enabled: boolean;
};

export function SceneControls({ enabled }: SceneControlsProps) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...SCENE_CAMERA.position);
    camera.lookAt(new THREE.Vector3(...SCENE_CAMERA.target));
  }, [camera]);

  if (!enabled) return null;

  return (
    <OrbitControls
      target={SCENE_CAMERA.target}
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      minDistance={3.2}
      maxDistance={10}
      minPolarAngle={0.3}
      maxPolarAngle={Math.PI / 2.05}
      maxAzimuthAngle={Math.PI / 1.65}
      minAzimuthAngle={-Math.PI / 1.65}
      rotateSpeed={0.65}
      zoomSpeed={0.85}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
}
