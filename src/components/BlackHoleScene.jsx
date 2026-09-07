import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BlackHole from './BlackHole';
import Meteor from './Meteor';
import StarField from './StarField';
import ServicesVisualizer from './ServicesVisualizer';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

// Section Camera checkpoints: [Section ID, { position: [x,y,z], lookAt: [x,y,z] }]
const CAMERA_CHECKPOINTS = [
  // 0: Hero - black hole sits on the right, room for text on the left
  { position: new THREE.Vector3(-2.8, 0.4, 7.5), lookAt: new THREE.Vector3(-1.8, -0.1, 0) },
  // 1: The Lab - moves closer, black hole shifts center-right
  { position: new THREE.Vector3(-1.6, 0.6, 5.5), lookAt: new THREE.Vector3(-0.6, 0, 0) },
  // 2: Projects - camera angles down, black hole moves left-background
  { position: new THREE.Vector3(1.8, -0.4, 5.0), lookAt: new THREE.Vector3(0.3, 0, 0) },
  // 3: Capabilities - wider pull back to display interactive node web
  { position: new THREE.Vector3(0.0, 0.0, 7.5), lookAt: new THREE.Vector3(0, 0, 0) },
  // 4: Services - side profile view of accretion disk
  { position: new THREE.Vector3(-3.2, 1.2, 4.8), lookAt: new THREE.Vector3(-0.2, -0.2, 0) },
  // 5: Contact - zooms far out, black hole fades into deep space darkness
  { position: new THREE.Vector3(0.0, 0.0, 15.0), lookAt: new THREE.Vector3(0, 0, 0) }
];

// Inner component to handle frame-by-frame camera interpolation and impact shaking
function SceneController({ scrollProgress, shakeIntensity, setShakeIntensity, setImpactRipple }) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(1.1, -0.1, 0));

  useFrame((state, delta) => {
    // 1. Calculate Target Camera Positions & Focal points based on scroll progress
    // scrollProgress is a float from 0 to 5 representing position between checkpoints
    const index = Math.min(Math.max(scrollProgress, 0), CAMERA_CHECKPOINTS.length - 1);
    
    const floorIdx = Math.floor(index);
    const ceilIdx = Math.min(floorIdx + 1, CAMERA_CHECKPOINTS.length - 1);
    const alpha = index - floorIdx;

    const startCheck = CAMERA_CHECKPOINTS[floorIdx];
    const endCheck = CAMERA_CHECKPOINTS[ceilIdx];

    const targetPos = new THREE.Vector3().lerpVectors(startCheck.position, endCheck.position, alpha);
    const targetLookAt = new THREE.Vector3().lerpVectors(startCheck.lookAt, endCheck.lookAt, alpha);

    // Smoothly interpolate (lerp) camera coordinates
    camera.position.lerp(targetPos, 0.06);
    currentLookAt.current.lerp(targetLookAt, 0.06);
    camera.lookAt(currentLookAt.current);

    // 2. Camera Impact Shake (triggered by meteor horizon cross)
    if (shakeIntensity > 0.01) {
      const shakeX = (Math.random() - 0.5) * shakeIntensity * 0.14;
      const shakeY = (Math.random() - 0.5) * shakeIntensity * 0.14;
      const shakeZ = (Math.random() - 0.5) * shakeIntensity * 0.14;
      
      camera.position.x += shakeX;
      camera.position.y += shakeY;
      camera.position.z += shakeZ;

      // Decay the shake intensity quickly
      setShakeIntensity((prev) => prev * 0.88);
    }
  });

  return null;
}

export default function BlackHoleScene({ scrollProgress, hoveredService }) {
  const performanceInfo = useDevicePerformance();
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [impactRipple, setImpactRipple] = useState(0);

  // Triggered when a meteor hits the event horizon
  const handleMeteorImpact = () => {
    setShakeIntensity(1.0); // start camera shake
    setImpactRipple(1.5);   // start expansion ripple on accretion disk
  };

  // Slowly decay the accretion disk impact ripple uniform
  useEffect(() => {
    if (impactRipple > 0) {
      const interval = setInterval(() => {
        setImpactRipple((prev) => {
          if (prev < 0.05) {
            clearInterval(interval);
            return 0;
          }
          return prev * 0.9;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [impactRipple]);

  return (
    <div className="webgl-canvas-container">
      <Canvas
        camera={{ position: [2.2, 0.4, 7.5], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: !performanceInfo.isMobile,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={performanceInfo.isMobile ? Math.min(window.devicePixelRatio || 1, 2.0) : (performanceInfo.tier === 'high' ? Math.min(window.devicePixelRatio || 1, 2.0) : Math.min(window.devicePixelRatio || 1, 1.5))}
      >
        <color attach="background" args={["#000000"]} />
        
        {/* Subtle lighting to light up the comet body */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[-5, 5, 2]} intensity={0.8} />

        {/* 3D Scene Components wrapped in Suspense for async texture preloading */}
        <Suspense fallback={null}>
          <StarField count={performanceInfo.tier === 'high' ? 3500 : 1200} />
          <BlackHole scrollProgress={scrollProgress} />
          <Meteor onImpact={handleMeteorImpact} />
          <ServicesVisualizer type={hoveredService} />
        </Suspense>

        {/* Camera Coordinator */}
        <SceneController
          scrollProgress={scrollProgress}
          shakeIntensity={shakeIntensity}
          setShakeIntensity={setShakeIntensity}
          setImpactRipple={setImpactRipple}
        />
      </Canvas>
    </div>
  );
}
