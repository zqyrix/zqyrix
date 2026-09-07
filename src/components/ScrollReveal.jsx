import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, delay = 0, duration = 0.8, yOffset = 25, style = {} }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if system prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false); // Reset animation state to replay upon scroll back
        }
      },
      {
        threshold: 0, // Trigger as soon as 1px is in view / out of view
        rootMargin: '0px 0px -5% 0px' // Slightly offset trigger zone at bottom
      }
    );

    const el = ref.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  // Separate layout styles (for the outer static box) from animation styles
  const {
    width,
    height,
    display,
    flexDirection,
    justifyContent,
    alignItems,
    alignSelf,
    margin,
    marginInline,
    marginTop,
    marginBottom,
    padding,
    position,
    ...innerStyles
  } = style;

  const outerStyle = {
    width,
    height,
    display,
    flexDirection,
    justifyContent,
    alignItems,
    alignSelf,
    margin,
    marginInline,
    marginTop,
    marginBottom,
    padding,
    position
  };

  return (
    <div ref={ref} style={outerStyle}>
      <div
        className="scroll-reveal"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : `translateY(${yOffset}px) scale(0.98)`,
          transition: `opacity ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
          willChange: 'opacity, transform',
          width: width ? '100%' : undefined,
          height: height ? '100%' : undefined,
          display: display,
          flexDirection: flexDirection,
          justifyContent: justifyContent,
          alignItems: alignItems,
          ...innerStyles
        }}
      >
        {children}
      </div>
    </div>
  );
}
