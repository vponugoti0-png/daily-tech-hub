"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

function DataOrb() {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.25;
    ref.current.rotation.x += dt * 0.08;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <Sphere ref={ref} args={[1.15, 64, 64]} scale={1.15}>
        <MeshDistortMaterial
          color="#FF6B4A"
          attach="material"
          distort={0.35}
          speed={2}
          roughness={0.2}
          metalness={0.55}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

function OrbitRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<Group>(null);
  const dots = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return [Math.cos(a) * radius, Math.sin(a) * 0.25, Math.sin(a) * radius] as const;
      }),
    [radius],
  );
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return (
    <group ref={ref} rotation={[0.4, 0.2, 0.1]}>
      {dots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 opacity-90" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        aria-hidden
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 3, 2]} intensity={1.2} color="#4CC9F0" />
        <directionalLight position={[-3, -2, -1]} intensity={0.45} color="#9B5CFF" />
        <Stars radius={40} depth={30} count={400} factor={2} saturation={0} fade speed={0.6} />
        <DataOrb />
        <OrbitRing radius={2.1} speed={0.35} color="#FFD166" />
        <OrbitRing radius={2.7} speed={-0.22} color="#4CC9F0" />
      </Canvas>
    </div>
  );
}
