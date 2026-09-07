import { useState, useEffect } from 'react';

export function useMousePosition() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalized coordinates (-1 to 1) for WebGL coordinate systems
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      setPosition({
        x,
        y,
        clientX: e.clientX,
        clientY: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
}
