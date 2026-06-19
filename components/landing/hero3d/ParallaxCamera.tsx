"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type ParallaxCameraProps = {
  enabled: boolean;
};

const BASE_POSITION = new THREE.Vector3(6.2, 4.4, 6.8);
const LOOK_AT = new THREE.Vector3(0, 0.55, 0);
const MAX_YAW = THREE.MathUtils.degToRad(4);
const MAX_PITCH = THREE.MathUtils.degToRad(3.5);

export function ParallaxCamera({ enabled }: ParallaxCameraProps) {
  const { camera, gl } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      target.current.x = nx;
      target.current.y = ny;
    };

    gl.domElement.addEventListener("pointermove", onMove);
    return () => gl.domElement.removeEventListener("pointermove", onMove);
  }, [enabled, gl.domElement]);

  useFrame(() => {
    camera.lookAt(LOOK_AT);

    if (!enabled) {
      camera.position.copy(BASE_POSITION);
      return;
    }

    current.current.x = THREE.MathUtils.lerp(current.current.x, target.current.x, 0.06);
    current.current.y = THREE.MathUtils.lerp(current.current.y, target.current.y, 0.06);

    const offset = new THREE.Vector3(
      current.current.x * MAX_YAW * 4,
      -current.current.y * MAX_PITCH * 2.5,
      0,
    );
    offset.applyQuaternion(camera.quaternion);

    camera.position.copy(BASE_POSITION).add(offset);
    camera.lookAt(LOOK_AT);
  });

  return null;
}
