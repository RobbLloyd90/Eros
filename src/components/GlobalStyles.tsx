export const GlobalStyles = () => (
  <style>
    {`
      /* Self-hosted (no CDN) so the app fully works offline once installed */
      @font-face { font-family: 'Play'; font-style: normal; font-weight: 400; font-display: swap; src: url('/fonts/play-400.woff2') format('woff2'); }
      @font-face { font-family: 'Play'; font-style: normal; font-weight: 700; font-display: swap; src: url('/fonts/play-700.woff2') format('woff2'); }
      @font-face { font-family: 'Share Tech Mono'; font-style: normal; font-weight: 400; font-display: swap; src: url('/fonts/sharetechmono-400.woff2') format('woff2'); }
      @font-face { font-family: 'Orbitron'; font-style: normal; font-weight: 700; font-display: swap; src: url('/fonts/orbitron-700.woff2') format('woff2'); }
      @font-face { font-family: 'Inter'; font-style: normal; font-weight: 400 700; font-display: swap; src: url('/fonts/inter-variable.woff2') format('woff2'); }
      @font-face { font-family: 'Quicksand'; font-style: normal; font-weight: 500 700; font-display: swap; src: url('/fonts/quicksand-variable.woff2') format('woff2'); }
      @font-face { font-family: 'DotGothic16'; font-style: normal; font-weight: 400; font-display: swap; src: url('/fonts/dotgothic16-400.woff2') format('woff2'); }

      * { box-sizing: border-box; }
      
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.05); }
      ::-webkit-scrollbar-thumb { background: rgba(128, 128, 128, 0.2); border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(128, 128, 128, 0.4); }

      @keyframes float1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(15vw, 20vh) scale(1.2); }
        66% { transform: translate(-10vw, 30vh) scale(0.8); }
      }
      @keyframes float2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-20vw, -15vh) scale(1.1); }
        66% { transform: translate(15vw, -25vh) scale(0.9); }
      }
      @keyframes float3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(10vw, 15vh) scale(1.3); }
      }
    `}
  </style>
);
