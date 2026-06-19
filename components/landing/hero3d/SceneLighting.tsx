"use client";

import { ACCENT_ORANGE } from "./constants";

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#fff8f0", "#e8e4de", 0.55]} />
      <directionalLight
        castShadow
        position={[-5, 8, 4]}
        intensity={1.15}
        color="#fff4ea"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[4, 3, -6]} intensity={0.55} color="#c8d8ff" />
      <pointLight position={[0.2, 1.05, 0.55]} intensity={0.9} color={ACCENT_ORANGE} distance={3.5} />
    </>
  );
}
