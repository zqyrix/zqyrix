import React, { useState, useEffect, useRef } from 'react';
import AudioController from './components/AudioController';
import CustomCursor from './components/CustomCursor';
import BlackHoleScene from './components/BlackHoleScene';
import LayoutOverlay from './components/LayoutOverlay';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [hoveredService, setHoveredService] = useState(null);

  // References for typography scroll effects
  const lastScrollY = useRef(0);
  const scrollSpeed = useRef(0);
  
  // Animated (lerped) typographic properties
  const typographyProps = useRef({
    scale: 1,
    letterSpacing: 0,
    opacity: 1,
    blur: 0,
    translateZ: 0
  });

  const activeHeadingsRef = useRef([]);

  // Cache headings whenever the active section changes to prevent DOM querying in the 60fps loop
  useEffect(() => {
    const currentSectionEl = document.querySelector(
      `section:nth-of-type(${activeSection + 1})`
    );
    if (currentSectionEl) {
      activeHeadingsRef.current = Array.from(
        currentSectionEl.querySelectorAll('h1, h2, .technical-label')
      );
    } else {
      activeHeadingsRef.current = [];
    }
  }, [activeSection]);

  // Smoothly scroll window to target section index using physical element offsetTop
  const handleNavigation = (sectionIndex) => {
    const sectionIds = [
      'section-hero',
      'section-lab',
      'section-work',
      'section-capabilities',
      'section-services',
      'section-contact'
    ];
    const el = document.getElementById(sectionIds[sectionIndex]);
    if (el) {
      window.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // 1. Scroll event listener to track progress and direction dynamically based on section offsets
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const sectionIds = [
        'section-hero',
        'section-lab',
        'section-work',
        'section-capabilities',
        'section-services',
        'section-contact'
      ];

      const offsets = sectionIds.map((id) => {
        const el = document.getElementById(id);
        return el ? el.offsetTop : 0;
      });

      // Calculate discrete active section index based on scroll position (40% viewport offset for early trigger feel)
      let currentActive = 0;
      const scrollThreshold = scrollTop + window.innerHeight * 0.4;
      for (let i = 0; i < offsets.length; i++) {
        if (scrollThreshold >= offsets[i]) {
          currentActive = i;
        }
      }
      setActiveSection(currentActive);

      // Interpolate continuous progress (0.00 to 5.00) based on actual physical scroll position between sections
      let progress = 0.0;
      let found = false;
      for (let i = 0; i < offsets.length - 1; i++) {
        const start = offsets[i];
        const end = offsets[i + 1];
        if (scrollTop >= start && scrollTop < end) {
          const range = end - start;
          const pct = range > 0 ? (scrollTop - start) / range : 0;
          progress = i + pct;
          found = true;
          break;
        }
      }
      if (!found) {
        if (scrollTop >= offsets[offsets.length - 1]) {
          progress = 5.0;
        } else {
          progress = 0.0;
        }
      }
      setScrollProgress(progress);

      // Track scroll delta speed (pixels per frame)
      const delta = scrollTop - lastScrollY.current;
      scrollSpeed.current = delta;
      lastScrollY.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initially to capture load state
    handleScroll();

    // 2. Animation loop to apply lerped typography distortion to active headers
    let animId;
    const isMobileDevice = window.innerWidth <= 820;

    const updateTypographyEffect = () => {
      const speed = scrollSpeed.current;

      // target state calculation based on scroll speed & direction
      let targetScale = 1.0;
      let targetLetterSpacing = 0.0; // in px
      let targetOpacity = 1.0;
      let targetBlur = 0.0;          // in px
      let targetTranslateZ = 0.0;    // in px

      // Apply effects if the user is scrolling
      if (Math.abs(speed) > 0.5) {
        if (speed > 0) {
          // Scrolling DOWN: Zoom out, fade opacity, translate Z backwards
          const intensity = Math.min(speed * 0.0016, 0.22);
          targetScale = 1.0 - intensity;
          targetOpacity = 1.0 - intensity * 1.3;
          targetBlur = intensity * 6;
          targetTranslateZ = -intensity * 100;
        } else {
          // Scrolling UP: Zoom in, translate Z forwards
          const intensity = Math.min(Math.abs(speed) * 0.0016, 0.22);
          targetScale = 1.0 + intensity;
          targetOpacity = 1.0 - intensity * 0.4; // slight fade on motion
          targetBlur = intensity * 3;
          targetTranslateZ = intensity * 100;
        }
      }

      // Linear interpolation (lerping) for ultra-smooth fluid transitions
      const t = 0.045; // lower ease factor for much smoother visual decay
      const props = typographyProps.current;
      props.scale += (targetScale - props.scale) * t;
      props.opacity += (targetOpacity - props.opacity) * t;
      props.blur += (targetBlur - props.blur) * t;
      props.translateZ += (targetTranslateZ - props.translateZ) * t;

      // Apply styles directly to the cached active section headings (bypasses React renders)
      // We exclude letterSpacing animation to prevent layout thrashing and maintain 60 FPS smoothness
      activeHeadingsRef.current.forEach((h) => {
        h.style.transform = `perspective(800px) translate3d(0, 0, ${props.translateZ}px) scale(${props.scale})`;
        h.style.opacity = props.opacity;
        h.style.filter = props.blur > 0.12 ? `blur(${props.blur}px)` : 'none';
        h.style.transformStyle = 'preserve-3d';
      });

      // Decay scroll speed value slowly to restore headers back to rest state when scrolling stops
      scrollSpeed.current *= 0.93;

      animId = requestAnimationFrame(updateTypographyEffect);
    };

    // Skip heavy typography loop updates on mobile devices to preserve scrolling frame rate
    if (!isMobileDevice) {
      animId = requestAnimationFrame(updateTypographyEffect);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeSection]);

  // Adjust body background color based on contact blackout section
  useEffect(() => {
    // If contact section is active, make background pitch black and hide details
    if (activeSection === 5) {
      document.body.style.backgroundColor = '#000000';
    } else {
      document.body.style.backgroundColor = '#030303';
    }
  }, [activeSection]);

  return (
    <>
      {/* Top horizontal Scroll Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          width: `${(scrollProgress / 5.0) * 100}%`,
          background: 'linear-gradient(to right, #ffffff, #88b3ff)',
          zIndex: 1000,
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
          transition: 'width 0.08s ease-out',
          willChange: 'width',
          pointerEvents: 'none'
        }}
      />
      {/* Audio controls */}
      <AudioController />
      
      {/* Custom Cursor System */}
      <CustomCursor />
      
      {/* Creative layout layers */}
      <div className="grid-overlay" />
      <div className="ambient-vignette" />

      {/* WebGL 3D Background Canvas */}
      <BlackHoleScene scrollProgress={scrollProgress} hoveredService={hoveredService} />

      {/* Scrollable DOM Content Overlay */}
      <LayoutOverlay
        activeSection={activeSection}
        onNavigate={handleNavigation}
        onHoverService={setHoveredService}
      />
    </>
  );
}
