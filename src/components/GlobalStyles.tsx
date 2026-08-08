export const GlobalStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Share+Tech+Mono&family=Orbitron:wght@700&family=Inter:wght@400;600;700&family=Quicksand:wght@500;700;800&family=DotGothic16&display=swap');
      
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
