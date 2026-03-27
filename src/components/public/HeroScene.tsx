"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

// Suppress THREE.Clock deprecation warning until @react-three/fiber updates
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      args[0].includes("THREE.Clock: This module has been deprecated")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  
  // Create a beautiful particle field
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  // use THREE.Timer instead of deprecated Clock
  const timer = useMemo(() => new (THREE as any).Timer(), []);

  useFrame(() => {
    timer.update();
    const time = timer.getElapsed();

    
    // Subtle wave motion
    if (ref.current) {
      ref.current.rotation.y = time * 0.05;
      ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      
      // Update positions for a "flowing" effect
      const geometry = ref.current.geometry;
      if (geometry && geometry.attributes.position) {
        const currentPositions = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
          const x = positions[i * 3];
          const z = positions[i * 3 + 2];
          
          if (x !== undefined && z !== undefined) {
             currentPositions[i * 3 + 1] = positions[i * 3 + 1]! + Math.sin(time + x * 0.5 + z * 0.3) * 0.2;
          }
        }
        geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4ade80" // brand-green color
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={["#0a2a1b"]} /> {/* brand-green-dark */}

        <ambientLight intensity={0.5} />
        <PointLight distance={20} intensity={2} color="#4ade80" position={[5, 5, 5]} />
        <ParticleField />
      </Canvas>
    </div>
  );
}

function PointLight({ distance, intensity, color, position }: any) {
  return <pointLight distance={distance} intensity={intensity} color={color} position={position} />;
}
