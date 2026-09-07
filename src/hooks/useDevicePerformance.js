import { useState, useEffect } from 'react';

export function useDevicePerformance() {
  const [tier, setTier] = useState('high'); // 'high' | 'low'
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check based on user agent and touch capability
    const mobileCheck =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.matchMedia('(max-width: 768px)').matches;

    setIsMobile(mobileCheck);
    if (mobileCheck) {
      setTier('low');
      return;
    }

    // Measure FPS over a short period to detect low-end desktops/laptops
    let frameCount = 0;
    let startTime = performance.now();
    let animationFrameId;

    const checkFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const duration = currentTime - startTime;

      // Check after 1.5 seconds of execution
      if (duration >= 1500) {
        const fps = (frameCount * 1000) / duration;
        if (fps < 45) {
          setTier('low');
          console.warn(`[ZQYRIX WebGL] Low frame rate detected (${Math.round(fps)} FPS). Throttling 3D particle count.`);
        }
        return;
      }

      animationFrameId = requestAnimationFrame(checkFPS);
    };

    animationFrameId = requestAnimationFrame(checkFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return {
    tier,
    isMobile,
    maxParticles: tier === 'high' ? 35000 : 8000,
    useBloom: tier === 'high',
  };
}
