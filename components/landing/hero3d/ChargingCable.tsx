"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ACCENT_ORANGE, SCENE_ANCHORS } from "./constants";
import { heroAnimationState } from "./animationState";

const FLOW_PARTICLE_COUNT = 10;

type ChargingCableProps = {
  glowRef?: React.RefObject<THREE.Mesh>;
};

export function ChargingCable({ glowRef }: ChargingCableProps) {
  const { carPort, chargerPort } = SCENE_ANCHORS.cable;
  const flowRef = useRef<THREE.InstancedMesh>(null);
  const carGlowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const localGlowRef = useRef<THREE.Mesh>(null);
  const connectorGlowRef = glowRef ?? localGlowRef;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const timeRef = useRef(0);

  const curve = useMemo(() => {
    const start = new THREE.Vector3(...carPort);
    const end = new THREE.Vector3(...chargerPort);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.24;
    return new THREE.CatmullRomCurve3([start, mid, end]);
  }, [carPort, chargerPort]);

  const tubeGeometry = useMemo(
    () => new THREE.TubeGeometry(curve, 48, 0.05, 12, false),
    [curve],
  );

  useFrame((_, delta) => {
    timeRef.current += delta;
    const glow = heroAnimationState.connectorGlow;
    const intensity = glow * 1.9;

    const updateGlow = (mesh: THREE.Mesh | null, baseScale: number) => {
      if (!mesh?.material || !(mesh.material instanceof THREE.MeshStandardMaterial)) return;
      mesh.material.emissive.set(ACCENT_ORANGE);
      mesh.material.emissiveIntensity = intensity;
      mesh.scale.setScalar(baseScale * (0.88 + glow * 0.28));
    };

    updateGlow(connectorGlowRef.current, 1);
    updateGlow(carGlowRef.current, 0.82);

    if (ringRef.current?.material instanceof THREE.MeshStandardMaterial) {
      const ringMat = ringRef.current.material;
      ringMat.opacity = 0.28 + glow * 0.5;
      ringMat.emissiveIntensity = glow * 1.3;
      ringRef.current.rotation.z += delta * 0.45;
    }

    const flowMesh = flowRef.current;
    if (!flowMesh) return;
    const flowStrength = Math.max(0, glow - 0.15);
    flowMesh.visible = flowStrength > 0.04;

    for (let i = 0; i < FLOW_PARTICLE_COUNT; i += 1) {
      const offset = i / FLOW_PARTICLE_COUNT;
      const t = (timeRef.current * 0.38 + offset) % 1;
      const point = curve.getPoint(t);
      dummy.position.copy(point);
      const pulse = 0.038 + Math.sin(t * Math.PI * 2 + i) * 0.012;
      dummy.scale.setScalar(pulse * flowStrength);
      dummy.updateMatrix();
      flowMesh.setMatrixAt(i, dummy.matrix);
    }
    flowMesh.instanceMatrix.needsUpdate = true;
    if (flowMesh.material instanceof THREE.MeshStandardMaterial) {
      flowMesh.material.opacity = flowStrength;
      flowMesh.material.emissiveIntensity = 1.1 + glow;
    }
  });

  return (
    <group>
      <mesh geometry={tubeGeometry} castShadow>
        <meshStandardMaterial color="#1a1918" roughness={0.62} metalness={0.28} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.024, 8, false]} />
        <meshStandardMaterial
          color={ACCENT_ORANGE}
          emissive={ACCENT_ORANGE}
          emissiveIntensity={0.2}
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={connectorGlowRef} position={chargerPort}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color={ACCENT_ORANGE}
          emissive={ACCENT_ORANGE}
          emissiveIntensity={0.35}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={carGlowRef} position={carPort}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color={ACCENT_ORANGE}
          emissive={ACCENT_ORANGE}
          emissiveIntensity={0.3}
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh ref={ringRef} position={chargerPort} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.013, 12, 32]} />
        <meshStandardMaterial
          color={ACCENT_ORANGE}
          emissive={ACCENT_ORANGE}
          emissiveIntensity={0.45}
          transparent
          opacity={0.32}
          toneMapped={false}
        />
      </mesh>
      <instancedMesh ref={flowRef} args={[undefined, undefined, FLOW_PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color={ACCENT_ORANGE}
          emissive={ACCENT_ORANGE}
          emissiveIntensity={1}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
