"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ACCENT_ORANGE, SCENE_ANCHORS } from "./constants";
import { heroAnimationState } from "./animationState";

type DataStreamProps = {
  particleCount: number;
};

export function DataStream({ particleCount }: DataStreamProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);

  const curve = useMemo(() => {
    const { start, mid, end } = SCENE_ANCHORS.stream;
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ]);
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = particlesRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    const { streamOpacity, streamProgress } = heroAnimationState;
    group.visible = streamOpacity > 0.02;
    mesh.count = particleCount;

    for (let i = 0; i < particleCount; i += 1) {
      const offset = i / particleCount;
      const t = (streamProgress * 1.08 + offset * 0.22) % 1;
      const point = curve.getPoint(t);
      dummy.position.copy(point);
      const pulse = 0.04 + Math.sin(t * Math.PI * 4 + i) * 0.012;
      dummy.scale.setScalar(pulse * (0.75 + streamOpacity * 0.5));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      mesh.material.opacity = streamOpacity;
      mesh.material.emissiveIntensity = 0.8 + streamProgress * 0.8;
    }

    group.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.opacity = streamOpacity * 0.22;
      }
    });
  });

  if (particleCount === 0) return null;

  return (
    <group ref={groupRef}>
      <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial
          color={ACCENT_ORANGE}
          emissive={ACCENT_ORANGE}
          emissiveIntensity={0.9}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </instancedMesh>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.012, 8, false]} />
        <meshStandardMaterial
          color={ACCENT_ORANGE}
          emissive={ACCENT_ORANGE}
          emissiveIntensity={0.35}
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
