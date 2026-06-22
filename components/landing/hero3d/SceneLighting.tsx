"use client";

import { ACCENT_ORANGE } from "./constants";

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#fffaf5", "#e8e4de", 0.6]} />
      <directionalLight
        castShadow
        position={[-4.5, 8, 3.5]}
        intensity={1.2}
        color="#fff8f0"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[3.5, 2.5, -5]} intensity={0.45} color="#d0dcff" />
      <pointLight position={[0.22, 0.92, 0.36]} intensity={1.35} color={ACCENT_ORANGE} distance={2.8} decay={2} />
      <pointLight position={[-0.35, 0.55, 0.38]} intensity={0.55} color="#ffe8d6" distance={2.2} decay={2} />
    </>
  );
}
