
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars, Sparkles } from '@react-three/drei';
// Correct way to import THREE for both value and type usage
import * as THREE from 'three';
import DiamondParticles from './DiamondParticles';
import Garland from './Garland';
import PostEffects from './PostEffects';

interface SceneProps {
  mode: 'WISH' | 'CHAOS';
  blurLevel: number;
  snowSize: number;
  isFrozen: boolean;
}

function StarTopper({ isFrozen }: { isFrozen: boolean }) {
  // Use THREE namespace for types
  const meshRef = useRef<THREE.Mesh>(null);
  
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.6;
    const innerRadius = 0.28;
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const finalAngle = (i * Math.PI) / points + Math.PI / 2;
      
      const x = Math.cos(finalAngle) * radius;
      const y = Math.sin(finalAngle) * radius;
      
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = {
    steps: 1,
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 3
  };

  useFrame((state) => {
    if (meshRef.current && !isFrozen) {
      // Breathing effect
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 3 + Math.sin(state.clock.elapsedTime * 2.5) * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 6.3, 0]}>
      <extrudeGeometry args={[starShape, extrudeSettings]} />
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffffff" 
        emissiveIntensity={4}
        toneMapped={false}
      />
    </mesh>
  );
}

function Snow({ density, isFrozen }: { density: number, isFrozen: boolean }) {
  const points = useRef<THREE.Points>(null);
  const MAX_COUNT = 13000;
  
  const particles = useMemo(() => {
    const p = new Float32Array(MAX_COUNT * 3);
    const v = new Float32Array(MAX_COUNT); // base velocities
    for (let i = 0; i < MAX_COUNT; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = Math.random() * 60 - 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 60;
      v[i] = 0.02 + Math.random() * 0.08;
    }
    return { positions: p, velocities: v };
  }, []);

  useFrame(() => {
    if (!points.current) return;
    
    // Dynamic count based on density slider, scaling up to 13,000
    const currentCount = Math.floor(2000 + density * 11000);
    points.current.geometry.setDrawRange(0, currentCount);

    if (isFrozen) return;

    const pos = points.current.geometry.attributes.position.array as Float32Array;
    // Speed multiplier: higher density = faster falling
    const speedMultiplier = 1.0 + density * 4.0;

    for (let i = 0; i < currentCount; i++) {
      pos[i * 3 + 1] -= particles.velocities[i] * speedMultiplier;
      pos[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.01;
      
      if (pos[i * 3 + 1] < -30) {
        pos[i * 3 + 1] = 30;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={MAX_COUNT} 
          array={particles.positions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1 + density * 0.12} 
        color="#ffffff" 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
      />
    </points>
  );
}

export default function Scene({ mode, blurLevel, snowSize, isFrozen }: SceneProps) {
  // Use THREE namespace for types
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && !isFrozen) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
      <OrbitControls 
        enablePan={false} 
        minDistance={8} 
        maxDistance={35} 
        enableDamping={true}
        dampingFactor={0.05}
      />

      <ambientLight intensity={0.4} color="#001133" />
      <pointLight position={[15, 15, 15]} intensity={2} color="#ffffff" />
      <pointLight position={[-15, -10, -15]} intensity={1.5} color="#4455ff" />

      <Environment files="/night.hdr" background={false} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />

      <Sparkles 
        count={5000} 
        scale={25} 
        size={2} 
        speed={0.2} 
        opacity={isFrozen ? 0.2 : 0.4} 
        color="#ffffff" 
      />

      <Snow density={snowSize} isFrozen={isFrozen} />

      <group ref={groupRef}>
        <DiamondParticles mode={mode} isFrozen={isFrozen} />
        <Garland visible={mode === 'WISH'} isFrozen={isFrozen} />
        {mode === 'WISH' && <StarTopper isFrozen={isFrozen} />}
      </group>

      <PostEffects blurLevel={blurLevel} />
    </>
  );
}
