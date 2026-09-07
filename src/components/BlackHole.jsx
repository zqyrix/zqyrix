import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function BlackHole({ scrollProgress }) {
  const meshRef = useRef(null);
  const coreRef = useRef(null);

  // Load the uploaded Gargantua black hole image directly
  const texture = useTexture('/blackhole.jpg');
  if (texture) {
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
  }

  useFrame((state) => {
    const { x, y } = state.mouse;
    const time = state.clock.getElapsedTime();

    // 1. 3D Mouse Parallax: tilts the black hole plane in response to cursor moves
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        y * 0.35, // tilt up/down
        0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        x * 0.35, // tilt left/right
        0.05
      );

      // 2. Scroll-driven Spin: spins the black hole texture around the Z-axis (roll)
      // This rotates the accretion disk smoothly, accelerating when scrolling
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        time * 0.04 + (scrollProgress * 1.4),
        0.06
      );
    }

    // 3. Occlusion Core: tracks mouse tilt to keep the star-blocking sphere aligned
    if (coreRef.current) {
      coreRef.current.rotation.x = THREE.MathUtils.lerp(
        coreRef.current.rotation.x,
        y * 0.35,
        0.05
      );
      coreRef.current.rotation.y = THREE.MathUtils.lerp(
        coreRef.current.rotation.y,
        x * 0.35,
        0.05
      );
    }
  });

  return (
    <group>
      {/* 1. Singularity Occlusion Sphere: pure black 3D sphere that sits behind the plane */}
      {/* to physically block background stars from passing through the event horizon */}
      <mesh ref={coreRef} position={[0, 0, -0.06]}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. Textured 3D Plane representing the Gargantua black hole */}
      {/* Blends seamlessly with deep space black using Additive blending */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[10, 6.25]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Subtle event horizon lensing rim */}
      <mesh position={[0, 0, -0.02]}>
        <ringGeometry args={[1.08, 1.15, 64]} />
        <meshBasicMaterial
          color="#d6e4ff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
