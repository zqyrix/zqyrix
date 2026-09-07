import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarField({ count = 2000 }) {
  const pointsRef = useRef(null);

  // Generate random positions on a large sphere surrounding the scene
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 18 + Math.random() * 32; // radius between 18 and 50 (pull closer to form a dense galaxy wrapping the horizon)

      const idx = i * 3;
      pos[idx] = r * Math.sin(phi) * Math.cos(theta);
      pos[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[idx + 2] = r * Math.cos(phi);

      // Color mapping: 70% white/silver, 30% soft glowing ice-blue
      if (Math.random() > 0.3) {
        cols[idx] = 1.0;     // R
        cols[idx + 1] = 1.0; // G
        cols[idx + 2] = 1.0; // B
      } else {
        cols[idx] = 0.68;    // R (ice-blue red)
        cols[idx + 1] = 0.85; // G (ice-blue green)
        cols[idx + 2] = 1.0;  // B (ice-blue blue)
      }
    }
    
    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const { x, y } = state.mouse;
    
    // Slow rotational drift
    pointsRef.current.rotation.z += 0.0003;
    
    // Parallax response to mouse cursor movement
    // Smoothly interpolate (lerp) current rotation to target mouse direction
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      y * 0.12, // increased parallax magnitude
      0.05
    );
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(
      pointsRef.current.rotation.y,
      x * 0.12, // increased parallax magnitude
      0.05
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.13}
        sizeAttenuation={true}
        vertexColors={true}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
