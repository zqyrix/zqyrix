import React from 'react';

// Stub functions that do nothing to completely disable audio functionality
export const playHoverSound = () => {};
export const playClickSound = () => {};
export const playTransitionWhoosh = () => {};
export const playMeteorImpact = () => {};
export const playWhooshSound = () => {};
export const playImpactSound = () => {};

export default function AudioController() {
  // Renders nothing in the DOM to hide the audio toggle button
  return null;
}
