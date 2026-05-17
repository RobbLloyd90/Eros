import React from 'react';
import type { ThemeType } from '../types';

export const LiquidBackground = ({ theme }: { theme: ThemeType }) => {
  const getOrbColors = () => {
    switch (theme) {
      case 'aero_g3':
        return { bg: '#e0f2fe', orb1: '#8ec5fc', orb2: '#e0c3fc', orb3: '#c2e9fb' };
      case 'nothing_glow':
        return {
          bg: '#060706',
          orb1: 'rgba(136, 226, 255, 0.25)',
          orb2: 'rgba(90, 200, 255, 0.15)',
          orb3: 'rgba(0, 150, 255, 0.1)'
        };
      case 'cybercore':
        return { bg: '#030008', orb1: '#ff0055', orb2: '#00f0ff', orb3: '#9d00ff' };
      case 'bondi':
        return { bg: '#050608', orb1: '#00D2D3', orb2: '#005c5c', orb3: '#009B9B' };
      case 'softtech':
        return { bg: '#0E1116', orb1: '#1a2333', orb2: '#222b3a', orb3: '#13171F' };
      case 'nothing_os':
        return { bg: '#000000', orb1: 'rgba(255,255,255,0.06)', orb2: 'rgba(128,128,128,0.04)', orb3: 'transparent' };
      default:
        return { bg: '#e0f2fe', orb1: '#8ec5fc', orb2: '#e0c3fc', orb3: '#c2e9fb' };
    }
  };

  const colors = getOrbColors();
  const isNothing = theme.includes('nothing');

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.bg,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '70vw',
          height: '70vw',
          borderRadius: '50%',
          background: colors.orb1,
          filter: 'blur(70px)',
          opacity: 0.8,
          top: '-10%',
          left: '-10%',
          animation: 'float1 18s infinite ease-in-out'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '80vw',
          height: '80vw',
          borderRadius: '50%',
          background: colors.orb2,
          filter: 'blur(90px)',
          opacity: 0.7,
          bottom: '-20%',
          right: '-10%',
          animation: 'float2 22s infinite ease-in-out'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: colors.orb3,
          filter: 'blur(60px)',
          opacity: 0.6,
          top: '25%',
          left: '15%',
          animation: 'float3 20s infinite ease-in-out'
        }}
      />

      {isNothing && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(${theme === 'nothing_glow' ? 'rgba(136, 226, 255, 0.1)' : 'rgba(255,255,255,0.1)'} 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            zIndex: 1
          }}
        />
      )}
    </div>
  );
};
