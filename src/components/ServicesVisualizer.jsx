import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ServicesVisualizer({ type }) {
  const groupRef = useRef(null);

  // 1. Grid Visualizer Assets (Web Development)
  const gridGeom = useMemo(() => {
    const size = 15;
    const count = size * size;
    const pos = new Float32Array(count * 3);
    
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        pos[i] = (x - size / 2) * 0.4;
        pos[i + 1] = 0;
        pos[i + 2] = (z - size / 2) * 0.4;
        i += 3;
      }
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3));
  }, []);

  // 2. Nodes/Paths Visualizer (Social Media & Automation)
  const pathData = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const r = 2.0 + (i % 3) * 0.6; // 3 distinct orbital paths
      const angle = (i / count) * Math.PI * 2;
      
      pos[idx] = r * Math.cos(angle);
      pos[idx + 1] = 0;
      pos[idx + 2] = r * Math.sin(angle);

      radii[i] = r;
      angles[i] = angle;
      speeds[i] = 1.0 + Math.random() * 0.5;
    }
    return { pos, angles, radii, speeds };
  }, []);

  // 3. Neural Net Visualizer (AI Solutions)
  const neuralData = useMemo(() => {
    const nodeCount = 12;
    const pos = new Float32Array(nodeCount * 3);
    
    // Generate layered neural layout
    for (let i = 0; i < nodeCount; i++) {
      const idx = i * 3;
      const layer = Math.floor(i / 4); // 3 layers of 4 nodes
      const nodeInLayer = i % 4;

      pos[idx] = (layer - 1) * 1.5; // X separation
      pos[idx + 1] = (nodeInLayer - 1.5) * 0.8; // Y separation
      pos[idx + 2] = (Math.random() - 0.5) * 0.4; // Z variation
    }

    // Connect layers
    const lineIndices = [];
    for (let l = 0; l < 2; l++) {
      for (let n1 = 0; n1 < 4; n1++) {
        for (let n2 = 0; n2 < 4; n2++) {
          lineIndices.push(l * 4 + n1);
          lineIndices.push((l + 1) * 4 + n2);
        }
      }
    }

    const geom = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setIndex(lineIndices);
    return geom;
  }, []);

  // 4. Circular Defensive Shield Visualizer (Cybersecurity)
  const circleGeom = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const r = i < 90 ? 2.2 : 2.5; // double concentric circle
      const angle = (i / 90) * Math.PI * 2;
      pos[idx] = r * Math.cos(angle);
      pos[idx + 1] = (Math.random() - 0.5) * 0.1;
      pos[idx + 2] = r * Math.sin(angle);
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3));
  }, []);

  // Frame animation loop to update and fade in/out structures based on active hovered type
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Smoothly fade in visualizer opacity when active, fade out when null
    const targetOpacity = type ? 0.75 : 0.0;
    groupRef.current.children.forEach((child) => {
      if (child.material) {
        child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, targetOpacity, 0.08);
      }
    });

    // 1. Grid movement (Web Dev)
    const gridMesh = groupRef.current.getObjectByName('grid');
    if (gridMesh && type === 'grid') {
      const posAttr = gridMesh.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        // Wave equation
        const y = Math.sin(x * 1.5 + time * 2.0) * Math.cos(z * 1.5 + time * 2.0) * 0.15;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
      gridMesh.rotation.y = time * 0.05;
    }

    // 2. Paths movement (Social Media & Automation)
    const pathsMesh = groupRef.current.getObjectByName('paths');
    if (pathsMesh && (type === 'nodes' || type === 'paths')) {
      const posAttr = pathsMesh.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const r = pathData.radii[i];
        // Increment angles
        pathData.angles[i] += pathData.speeds[i] * 0.015;
        posAttr.setX(i, r * Math.cos(pathData.angles[i]));
        posAttr.setZ(i, r * Math.sin(pathData.angles[i]));
        if (type === 'nodes') {
          // Add small vertical wave
          posAttr.setY(i, Math.sin(pathData.angles[i] * 3.0 + time) * 0.15);
        } else {
          posAttr.setY(i, 0);
        }
      }
      posAttr.needsUpdate = true;
      pathsMesh.rotation.y = -time * 0.08;
    }

    // 3. Neural Net movement (AI)
    const neuralMesh = groupRef.current.getObjectByName('neural');
    const neuralLines = groupRef.current.getObjectByName('neural-lines');
    if (neuralMesh && type === 'neural') {
      neuralMesh.rotation.y = time * 0.15;
      if (neuralLines) neuralLines.rotation.y = time * 0.15;
    }

    // 4. Circle movement (Cybersecurity)
    const circleMesh = groupRef.current.getObjectByName('circle');
    if (circleMesh && type === 'circle') {
      // Rotate inner and outer rings in opposite directions
      circleMesh.rotation.y = time * 0.35;
      circleMesh.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    // Position the visualizer relative to the black hole (shifted slightly behind)
    <group ref={groupRef} position={[0, 0, -0.4]}>
      {/* A. Grid Visualizer (Web Dev) */}
      <points name="grid" geometry={gridGeom}>
        <pointsMaterial
          size={0.06}
          color="#d6e4ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* B. Connected Nodes / Paths (Social Media & Automation) */}
      <points name="paths">
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pathData.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color="#88b3ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* C. Neural Net (AI Solutions) */}
      <group>
        <points name="neural" geometry={neuralData}>
          <pointsMaterial
            size={0.12}
            color="#ffffff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
        <lineSegments name="neural-lines" geometry={neuralData}>
          <lineBasicMaterial
            color="#d6e4ff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      {/* D. Concentric Rings (Cybersecurity) */}
      <points name="circle" geometry={circleGeom}>
        <pointsMaterial
          size={0.06}
          color="#ffffff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
