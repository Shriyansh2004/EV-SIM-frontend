"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Model as EvCarModel } from "./models/EvCar";
import { Model as EvChargerModel } from "./models/EvCharger";
import { Model as ServerRackModel } from "./models/ServerRack";
import { SCENE_ANCHORS } from "./constants";
import { heroAnimationState } from "./animationState";

/*
 * CC0 stylized low-poly assets from Poly Pizza (Quaternius sedan, vending machine
 * as charger stand-in, Jeremy Eyring server rack). Replace ev-charger.glb with a
 * dedicated EV wallbox model when a photorealistic asset is available.
 */

function applyCarMaterials(group: THREE.Group) {
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || !child.material) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!(material instanceof THREE.MeshStandardMaterial)) return;
      const name = material.name.toLowerCase();
      if (name.includes("window")) {
        material.metalness = 0.85;
        material.roughness = 0.08;
        material.transparent = true;
        material.opacity = 0.75;
      } else if (name.includes("blue") || name.includes("grey")) {
        material.metalness = 0.6;
        material.roughness = 0.3;
        material.color.set("#d8dde3");
      } else {
        material.metalness = 0.35;
        material.roughness = 0.55;
      }
    });
  });
}

function applyChargerMaterials(group: THREE.Group) {
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || !child.material) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!(material instanceof THREE.MeshStandardMaterial)) return;
      material.metalness = 0.2;
      material.roughness = 0.6;
    });
  });
}

function applyServerMaterials(group: THREE.Group) {
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || !child.material) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!(material instanceof THREE.MeshStandardMaterial)) return;
      material.metalness = 0.8;
      material.roughness = 0.4;
    });
  });
}

export function SceneModels() {
  const carRef = useRef<THREE.Group>(null);
  const chargerRef = useRef<THREE.Group>(null);
  const serverRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (carRef.current) applyCarMaterials(carRef.current);
    if (chargerRef.current) applyChargerMaterials(chargerRef.current);
    if (serverRef.current) applyServerMaterials(serverRef.current);
  }, []);

  useFrame(() => {
    if (!serverRef.current) return;
    const pulse = heroAnimationState.serverPulse;
    serverRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        if (child.name.startsWith("1u_server")) {
          material.emissive.set("#FF6B1A");
          material.emissiveIntensity = pulse * 0.55;
        }
      });
    });
  });

  const car = SCENE_ANCHORS.car;
  const charger = SCENE_ANCHORS.charger;
  const server = SCENE_ANCHORS.server;

  return (
    <>
      <group ref={carRef} position={car.position} rotation={car.rotation} scale={car.scale}>
        <EvCarModel />
      </group>
      <group ref={chargerRef} position={charger.position} rotation={charger.rotation} scale={charger.scale}>
        <EvChargerModel />
      </group>
      <group ref={serverRef} position={server.position} rotation={server.rotation} scale={server.scale}>
        <ServerRackModel />
      </group>
    </>
  );
}
