"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ACCENT_ORANGE, SCENE_ANCHORS } from "./constants";
import { heroAnimationState } from "./animationState";

type ChargingCableProps = {
  glowRef?: React.RefObject<THREE.Mesh>;
};

export function ChargingCable({ glowRef }: ChargingCableProps) {
  const { carPort, chargerPort } = SCENE_ANCHORS.cable;

  const curve = useMemo(() => {
    const start = new THREE.Vector3(...carPort);
    const end = new THREE.Vector3(...chargerPort);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.18;
    return new THREE.CatmullRomCurve3([start, mid, end]);
  }, [carPort, chargerPort]);

  const tubeGeometry = useMemo(
    () => new THREE.TubeGeometry(curve, 32, 0.035, 8, false),
    [curve],
  );

  const localGlowRef = useRef<THREE.Mesh>(null);
  const connectorGlowRef = glowRef ?? localGlowRef;

  useFrame(() => {
    const mesh = connectorGlowRef.current;
    if (!mesh?.material || !(mesh.material instanceof THREE.MeshStandardMaterial)) return;
    const glow = heroAnimationState.connectorGlow;
    mesh.material.emissive.set("#FF6B1A");
    mesh.material.emissiveIntensity = glow * 1.6;
  });

  return (
    <group>
      <mesh geometry={tubeGeometry} castShadow>
        <meshStandardMaterial color="#2b2a28" roughness={0.75} metalness={0.15} />
      </mesh>
      <mesh ref={connectorGlowRef} position={chargerPort}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={ACCENT_ORANGE} emissive={ACCENT_ORANGE} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}
