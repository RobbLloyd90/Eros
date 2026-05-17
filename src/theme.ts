import type { ThemeType } from './types';

export const getThemeStyles = (theme: ThemeType) => {
  switch (theme) {
    case 'aero_g3':
      return {
        screen: { backgroundColor: 'transparent', fontFamily: "'Quicksand', sans-serif" },
        header: {
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 49%, rgba(255,255,255,0.2) 51%, rgba(255,255,255,0.4) 100%)',
          backdropFilter: 'blur(32px) saturate(120%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        },
        value: { fontFamily: "'Quicksand', sans-serif", color: '#0f172a' },
        bladeContainer: (config: any) => ({
          backgroundColor: 'transparent',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          border: `1px solid rgba(255,255,255,0.9)`,
          boxShadow: `0px -8px 24px rgba(100, 115, 140, 0.15), inset 0 2px 4px rgba(255,255,255,1), inset 0 0 20px ${config.color}15`
        }),
        dashboardContainer: (config: any) => ({
          backgroundColor: 'transparent',
          borderRadius: '12px',
          border: `1px solid rgba(255,255,255,0.9)`,
          boxShadow: `0px -8px 24px rgba(100, 115, 140, 0.15), inset 0 2px 4px rgba(255,255,255,1), inset 0 0 20px ${config.color}15`
        }),
        tabHandle: (config: any) => ({
          backgroundColor: config.color,
          backgroundImage:
            'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 49%, rgba(0,0,0,0.05) 51%, rgba(0,0,0,0.15) 100%)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          borderBottom: `10px solid rgba(0,0,0,0.1)`,
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.9)'
        }),
        bladeContent: (config: any) => ({
          backgroundColor: config.aeroFrosted,
          backdropFilter: 'blur(24px) saturate(120%)',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px'
        }),
        tabTitle: () => ({
          fontFamily: "'Quicksand', sans-serif",
          color: '#ffffff',
          fontWeight: 800,
          textShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }),
        row: {
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 49%, rgba(255,255,255,0.3) 51%, rgba(255,255,255,0.6) 100%)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,1), 0 4px 12px rgba(0,0,0,0.04)'
        },
        colors: {
          primary: '#0f172a',
          secondary: '#475569',
          metricBg: 'rgba(255,255,255,0.5)',
          modalBg: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.85) 100%)',
          pos: '#0ea5e9',
          neg: '#f43f5e'
        }
      };
    case 'nothing_glow':
      return {
        screen: { backgroundColor: 'transparent', fontFamily: "'Inter', sans-serif" },
        header: {
          background: 'linear-gradient(180deg, rgba(6,7,6,0.8) 0%, rgba(6,7,6,0.5) 100%)',
          backdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(136, 226, 255, 0.3)',
          boxShadow: '0 4px 20px rgba(136, 226, 255, 0.05)'
        },
        value: { fontFamily: "'DotGothic16', sans-serif", color: '#88E2FF' },
        bladeContainer: () => ({
          backgroundColor: 'transparent',
          borderRadius: '16px',
          border: `1px solid rgba(136, 226, 255, 0.3)`,
          boxShadow: `0px -8px 24px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(136, 226, 255, 0.15)`
        }),
        tabHandle: () => ({
          backgroundColor: '#0d100d',
          backgroundImage: 'linear-gradient(180deg, rgba(136, 226, 255, 0.15) 0%, rgba(136, 226, 255, 0.02) 100%)',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
          borderBottom: `1px solid rgba(136, 226, 255, 0.2)`,
          boxShadow: 'inset 0 1px 1px rgba(136, 226, 255, 0.4)'
        }),
        bladeContent: () => ({
          backgroundColor: 'rgba(6, 7, 6, 0.4)',
          backdropFilter: 'blur(24px)',
          borderBottomLeftRadius: '15px',
          borderBottomRightRadius: '15px'
        }),
        tabTitle: () => ({
          fontFamily: "'DotGothic16', sans-serif",
          color: '#88E2FF',
          fontWeight: 400,
          fontSize: '16px',
          letterSpacing: '1px',
          textShadow: '0 0 8px rgba(136, 226, 255, 0.4)'
        }),
        row: {
          background: 'rgba(136, 226, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px dotted rgba(136, 226, 255, 0.4)',
          boxShadow: 'inset 0 1px 4px rgba(136, 226, 255, 0.1), 0 4px 12px rgba(0,0,0,0.4)'
        },
        colors: {
          primary: '#ffffff',
          secondary: '#888',
          metricBg: 'rgba(136, 226, 255, 0.08)',
          modalBg: 'linear-gradient(180deg, #111 0%, #000 100%)',
          pos: '#88E2FF',
          neg: '#FF2A2A'
        }
      };
    case 'nothing_os':
      return {
        screen: { backgroundColor: 'transparent', fontFamily: "'Inter', sans-serif" },
        header: {
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 100%)',
          backdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        },
        value: { fontFamily: "'DotGothic16', sans-serif", color: '#ffffff' },
        bladeContainer: () => ({
          backgroundColor: 'transparent',
          borderRadius: '12px',
          border: `1px solid rgba(255,255,255,0.2)`,
          boxShadow: `0px -8px 24px rgba(0,0,0,0.8)`
        }),
        tabHandle: () => ({
          backgroundColor: '#111',
          borderTopLeftRadius: '11px',
          borderTopRightRadius: '11px',
          borderBottom: `1px dotted rgba(255,255,255,0.2)`
        }),
        bladeContent: () => ({
          backgroundColor: 'rgba(10,10,10,0.5)',
          backdropFilter: 'blur(24px)',
          borderBottomLeftRadius: '11px',
          borderBottomRightRadius: '11px'
        }),
        tabTitle: () => ({
          fontFamily: "'DotGothic16', sans-serif",
          color: '#ffffff',
          fontWeight: 400,
          fontSize: '16px',
          letterSpacing: '2px'
        }),
        row: {
          background: 'rgba(25,25,25,0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        },
        colors: {
          primary: '#ffffff',
          secondary: '#888888',
          metricBg: 'rgba(255,255,255,0.05)',
          modalBg: 'rgba(10,10,10,0.95)',
          pos: '#ffffff',
          neg: '#E53935'
        }
      };
    case 'bondi':
      return {
        screen: { backgroundColor: 'transparent', fontFamily: "'Play', sans-serif" },
        header: {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(17,20,26,0.6) 100%)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)'
        },
        value: { fontFamily: "'Share Tech Mono', monospace", color: '#00D2D3' },
        bladeContainer: (config: any) => ({
          backgroundColor: 'transparent',
          borderRadius: '20px',
          border: `1px solid rgba(255,255,255,0.2)`,
          boxShadow: `0px -8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255,255,255,0.5), inset 0 0 20px ${config.color}33`
        }),
        tabHandle: (config: any) => ({
          backgroundColor: config.color,
          backgroundImage:
            'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.1) 100%)',
          borderTopLeftRadius: '19px',
          borderTopRightRadius: '19px',
          borderBottom: '1px solid rgba(0,0,0,0.3)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8)'
        }),
        bladeContent: (config: any) => ({
          backgroundColor: `${config.color}20`,
          backdropFilter: 'blur(32px) saturate(140%)',
          borderBottomLeftRadius: '19px',
          borderBottomRightRadius: '19px'
        }),
        tabTitle: () => ({
          fontFamily: "'Play', sans-serif",
          color: '#ffffff',
          fontWeight: 'bold',
          textShadow: '0 1px 3px rgba(0,0,0,0.6)'
        }),
        row: {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.4) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.3)'
        },
        colors: {
          primary: '#ffffff',
          secondary: '#aaaaaa',
          metricBg: 'rgba(0,0,0,0.4)',
          modalBg: 'linear-gradient(180deg, rgba(30,35,45,0.9) 0%, rgba(15,20,25,0.95) 100%)',
          pos: '#00d2d3',
          neg: '#ff4d6d'
        }
      };
    case 'cybercore':
      return {
        screen: { backgroundColor: 'transparent', fontFamily: "'Inter', sans-serif" },
        header: {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(10,5,20,0.8) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          borderBottom: '1px solid rgba(160, 32, 240, 0.4)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)'
        },
        value: { fontFamily: "'Share Tech Mono', monospace", color: '#FF0055' },
        bladeContainer: (config: any) => ({
          backgroundColor: 'transparent',
          borderRadius: '12px',
          border: `1px solid ${config.color}AA`,
          boxShadow: `0px -10px 30px ${config.color}55, inset 0 1px 2px rgba(255,255,255,0.3)`
        }),
        tabHandle: (config: any) => ({
          backgroundColor: config.color,
          backgroundImage:
            'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 49%, rgba(0,0,0,0.2) 51%, rgba(0,0,0,0.4) 100%)',
          borderTopLeftRadius: '11px',
          borderTopRightRadius: '11px',
          borderBottom: '1px solid rgba(0,0,0,0.4)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6)'
        }),
        bladeContent: () => ({
          backgroundColor: 'rgba(10, 5, 20, 0.5)',
          backdropFilter: 'blur(32px) saturate(180%)',
          borderBottomLeftRadius: '11px',
          borderBottomRightRadius: '11px'
        }),
        tabTitle: () => ({
          fontFamily: "'Orbitron', sans-serif",
          color: '#ffffff',
          letterSpacing: '1px',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)'
        }),
        row: {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 10px rgba(0,0,0,0.4)'
        },
        colors: {
          primary: '#ffffff',
          secondary: '#888888',
          metricBg: 'rgba(0,0,0,0.5)',
          modalBg: 'linear-gradient(180deg, rgba(30,10,40,0.9) 0%, rgba(10,5,20,0.95) 100%)',
          pos: '#00FF9D',
          neg: '#FF0055'
        }
      };
    case 'softtech':
    default:
      return {
        screen: { backgroundColor: 'transparent', fontFamily: "'Inter', sans-serif" },
        header: {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(19,23,31,0.8) 100%)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
        },
        value: { fontFamily: 'monospace', color: '#fff' },
        bladeContainer: () => ({
          backgroundColor: 'transparent',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0px -8px 24px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.2)'
        }),
        tabHandle: (config: any) => ({
          backgroundColor: config.color,
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 100%)',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
          borderBottom: '1px solid rgba(0,0,0,0.2)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)'
        }),
        bladeContent: () => ({
          backgroundColor: 'rgba(19, 23, 31, 0.6)',
          backdropFilter: 'blur(24px)',
          borderBottomLeftRadius: '15px',
          borderBottomRightRadius: '15px'
        }),
        tabTitle: () => ({
          fontFamily: "'Inter', sans-serif",
          color: '#ffffff',
          fontWeight: 600,
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }),
        row: {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.2) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.3)'
        },
        colors: {
          primary: '#ffffff',
          secondary: '#888888',
          metricBg: 'rgba(0,0,0,0.4)',
          modalBg: 'linear-gradient(180deg, rgba(40,45,55,0.9) 0%, rgba(20,25,35,0.95) 100%)',
          pos: '#10b981',
          neg: '#e11d48'
        }
      };
  }
};
