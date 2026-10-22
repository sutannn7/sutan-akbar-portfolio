'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface NamePlateProps {
  name: string;
  role: string;
}

type Pointer = { x: number; y: number };

/** Seberapa cepat slab mengikuti kursor (semakin rendah = semakin lentur). */
const DAMP = 5;

/** clientX/Y ke NDC -1…1 (konvensi R3F: y positif ke atas). */
function toPointerNDC(clientX: number, clientY: number): Pointer {
  return {
    x: (clientX / window.innerWidth) * 2 - 1,
    y: -((clientY / window.innerHeight) * 2 - 1),
  };
}

/** PlateMesh memiliki useRef + useFrame dan harus rendered di dalam <Canvas>.
 * pointer adalah ref yang ditulis NamePlate lewat window.pointermove; dibaca
 * segar di setiap frame useFrame. */
function PlateMesh({ pointer }: { pointer: { current: Pointer } }) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Rotasi mengikuti kursor dengan spring damping; slab melayang pelan-pelan.
    const p = pointer.current;
    mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, p.x * 0.35, DAMP, delta);
    mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, -p.y * 0.2, DAMP, delta);
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  return (
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
  );
}

/** NamePlate (diekspor): wrapper <div>, overlay nama/peran HTML, dan <Canvas> yang
 * berisi lampu + <PlateMesh>. useFrame hidup di PlateMesh (anak Canvas), bukan di sini. */
export function NamePlate({ name, role }: NamePlateProps) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  const onPointerMove = useCallback((event: PointerEvent) => {
    pointer.current = toPointerNDC(event.clientX, event.clientY);
  }, []);

  // page.tsx membungkus plate dengan pointer-events-none, sehingga peristiwa pointer
  // browser tidak pernah sampai ke <Canvas> dan state.pointer R3F selalu 0,0.
  // Ambil kursor secara global pada window, simpan ke ref, dan baca ref itu di useFrame.
  // Listener dibersihkan saat unmount.
  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [onPointerMove]);

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
        <PlateMesh pointer={pointer} />
      </Canvas>
    </div>
  );
}
