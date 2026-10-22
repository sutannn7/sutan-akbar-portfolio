'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface NamePlateProps {
  name: string;
  role: string;
}

/** Seberapa cepat slab mengikuti kursor (semakin rendah = semakin lentur). */
const DAMP = 5;

export function NamePlate({ name, role }: NamePlateProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Rotasi mengikuti kursor dengan spring damping; slab melayang pelan-pelan.
    const pointer = state.pointer;
    mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, pointer.x * 0.35, DAMP, delta);
    mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, -pointer.y * 0.2, DAMP, delta);
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <div className="relative w-full max-w-[560px] h-[320px]">
      {/* Nama dan peran sebagai HTML agar tajam, dapat disalin, dan terbaca screen reader */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center">
        <span className="font-sans font-medium text-foreground">{name}</span>
        <span className="font-mono text-sm text-muted-foreground mt-2">{role}</span>
      </div>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 4]} intensity={1.2} />
        <mesh ref={meshRef}>
          <RoundedBox args={[3.2, 1.8, 0.12]} radius={0.12} smoothness={4} />
          <meshPhysicalMaterial
            color="#C8F246"
            transmission={0.9}
            thickness={0.4}
            roughness={0.15}
            ior={1.3}
            transparent
            opacity={0.35}
          />
        </mesh>
      </Canvas>
    </div>
  );
}
