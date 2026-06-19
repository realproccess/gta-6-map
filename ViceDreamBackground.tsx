import React from 'react';

export function ViceDreamBackground() {
  return (
    // We use a fixed gradient that stays behind everything
    <div className="app-theme-dimmer" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url("/hd-upscaled-8K-1780381221537.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 0,
    }} />
  );
}
