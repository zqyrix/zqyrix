import React, { useEffect, useRef, useState } from 'react';
import { playHoverSound } from './AudioController';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  
  const [hoverText, setHoverText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse coordinate targets
  const mouseCoords = useRef({ x: 0, y: 0 });
  // Interpolated (lerped) positions
  const dotCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device is mobile or touch-enabled
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    // Enable custom cursor active class on body (hides standard cursor)
    document.body.classList.add('custom-cursor-active');
    setIsVisible(true);

    const handleMouseMove = (e) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Track button & link hovers
    const setupHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], .project-panel, .constellation-node');
      
      interactiveElements.forEach((el) => {
        // Prevent duplicate listener attachment
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = 'true';

        el.addEventListener('mouseenter', (e) => {
          setIsHovered(true);
          const customText = el.getAttribute('data-cursor-text') || '';
          setHoverText(customText);
          playHoverSound();
        });

        el.addEventListener('mouseleave', () => {
          setIsHovered(false);
          setHoverText('');
        });
      });
    };

    // Run setup initially
    setupHoverListeners();

    // Re-bind on dynamic content changes (using MutationObserver)
    const observer = new MutationObserver(setupHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Animation Loop
    let animId;
    const updateCursor = () => {
      // Lerp dot (faster speed)
      dotCoords.current.x += (mouseCoords.current.x - dotCoords.current.x) * 0.35;
      dotCoords.current.y += (mouseCoords.current.y - dotCoords.current.y) * 0.35;

      // Lerp ring (slower speed, creating inertial lag/gravitational trail)
      ringCoords.current.x += (mouseCoords.current.x - ringCoords.current.x) * 0.12;
      ringCoords.current.y += (mouseCoords.current.y - ringCoords.current.y) * 0.12;

      // Apply transforms directly via ref to bypass react rendering path
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotCoords.current.x}px, ${dotCoords.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringCoords.current.x}px, ${ringCoords.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }

      animId = requestAnimationFrame(updateCursor);
    };

    animId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('custom-cursor-active');
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Cursor Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '5px',
          height: '5px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          zIndex: 99999,
          pointerEvents: 'none',
          boxShadow: '0 0 5px #88b3ff',
          // Optimize performance
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Trailing Soft Gravitational Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '70px' : '32px',
          height: isHovered ? '70px' : '32px',
          border: isHovered ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.25)',
          backgroundColor: isHovered ? 'rgba(136, 179, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)',
          borderRadius: '50%',
          zIndex: 99998,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, background-color 0.3s',
          // Optimize performance
          willChange: 'width, height, transform',
          backfaceVisibility: 'hidden',
          boxShadow: isHovered ? '0 0 14px rgba(136, 179, 255, 0.2)' : 'none',
        }}
      >
        {/* Text inside cursor when hovering */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.05em',
            color: '#ffffff',
            opacity: isHovered && hoverText ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {hoverText}
        </span>
      </div>
    </>
  );
}
