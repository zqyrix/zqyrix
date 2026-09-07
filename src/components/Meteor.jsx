import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playWhooshSound, playImpactSound } from './AudioController';

export default function Meteor({ onImpact }) {
  const meshRef = useRef(null);
  const trailRef = useRef(null);

  // States: 'idle' | 'active' | 'absorbed'
  const [status, setStatus] = useState('idle');
  const cooldownTimer = useRef(0);

  // Physics state variables
  const position = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  
  // Gravitational parameter (mu = G * M)
  const mu = 22.0; 
  // Orbital dissipation (simulates relativistic drag/loss of orbital energy near singularity)
  const dragFactor = 0.045; 

  // Trail buffer variables (last 50 positions)
  const trailLength = 50;
  const trailPositions = useMemo(() => new Float32Array(trailLength * 3), []);
  const trailAlphas = useMemo(() => {
    const alphas = new Float32Array(trailLength);
    for (let i = 0; i < trailLength; i++) {
      alphas[i] = (trailLength - i) / trailLength; // fade older positions
    }
    return alphas;
  }, []);

  const resetMeteor = () => {
    // Spawn in the upper-left, far background
    position.current.set(-11.0, 9.0, -4.0);
    // Initial velocity pointing slightly off-center to create a beautiful orbital curve
    velocity.current.set(3.8, -2.8, 1.4);
    
    // Reset trail buffer to start position
    for (let i = 0; i < trailLength; i++) {
      const idx = i * 3;
      trailPositions[idx] = position.current.x;
      trailPositions[idx + 1] = position.current.y;
      trailPositions[idx + 2] = position.current.z;
    }

    setStatus('active');
    playWhooshSound(); // Play passing whoosh synth
  };

  useFrame((state, delta) => {
    // Cap delta to prevent physics explosion on lag frames
    const dt = Math.min(delta, 0.03);

    if (status === 'idle') {
      cooldownTimer.current += dt;
      // Re-trigger every 8-12 seconds
      if (cooldownTimer.current > 7.0) {
        resetMeteor();
        cooldownTimer.current = 0;
      }
      return;
    }

    if (status === 'active') {
      const pos = position.current;
      const r = pos.length(); // Distance to singularity (0,0,0)

      // 1. Cross Event Horizon Check
      if (r <= 1.25) {
        setStatus('idle');
        onImpact();       // Trigger shake & ripple ripple
        playImpactSound(); // Play deep sub impact
        
        // Hide mesh immediately
        if (meshRef.current) meshRef.current.scale.set(0, 0, 0);
        return;
      }

      // 2. Gravitational Pull: F = -G*M*r_vec / r^3
      const gravity = pos.clone().negate().normalize().multiplyScalar(mu / (r * r));
      velocity.current.add(gravity.multiplyScalar(dt));

      // 3. Relativistic Drag: increases exponentially near the singularity to force spiral orbit
      if (r < 4.0) {
        const dragStrength = (dragFactor / (r * r)) * velocity.current.length();
        const dragForce = velocity.current.clone().negate().normalize().multiplyScalar(dragStrength);
        velocity.current.add(dragForce.multiplyScalar(dt));
      }

      // 4. Update Position
      pos.add(velocity.current.clone().multiplyScalar(dt));

      // 5. Apply Stretch (spaghettification) along velocity direction
      if (meshRef.current) {
        meshRef.current.position.copy(pos);
        
        const velLen = velocity.current.length();
        const dir = velocity.current.clone().normalize();
        
        // Align mesh rotation with velocity direction
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        meshRef.current.quaternion.copy(quaternion);

        // Stretch mesh based on velocity magnitude and proximity to horizon
        const stretchZ = 1.0 + (velLen * 0.08) / Math.max(r - 1.2, 0.1);
        const squishXY = 1.0 / Math.sqrt(stretchZ); // maintain mass volume
        meshRef.current.scale.set(squishXY * 0.14, stretchZ * 0.28, squishXY * 0.14);
      }

      // 6. Update Trail ring buffer: shift elements right and prepend new coordinate
      for (let i = trailLength - 1; i > 0; i--) {
        const dest = i * 3;
        const src = (i - 1) * 3;
        trailPositions[dest] = trailPositions[src];
        trailPositions[dest + 1] = trailPositions[src + 1];
        trailPositions[dest + 2] = trailPositions[src + 2];
      }
      trailPositions[0] = pos.x;
      trailPositions[1] = pos.y;
      trailPositions[2] = pos.z;

      if (trailRef.current) {
        trailRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* 1. Spaghettified Dodecahedron Meteor Body */}
      {status === 'active' && (
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#ffffff"
            // High glow emissive look
            toneMapped={false}
          />
        </mesh>
      )}

      {/* 2. Meteor Plasma Core Glow */}
      {status === 'active' && (
        <mesh position={position.current} scale={0.4}>
          <sphereGeometry args={[1.0, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 3. Glowing Particle Trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-aAlpha"
            args={[trailAlphas, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          sizeAttenuation={true}
          color="#88b3ff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
