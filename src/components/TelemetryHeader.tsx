export const TelemetryHeader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 pt-8 pointer-events-none">
      <div className="bg-cyber-dark/60 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-[0_0_20px_rgba(255,0,102,0.15)] pointer-events-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
          <span className="text-xs font-mono text-gray-400 tracking-widest">🪐 N_OS // APEX_FINANCE</span>
          <span className="text-xs font-mono text-gray-400">MAY_2026</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Operational Margin</p>
            <p className="text-cyber-magenta font-mono font-bold text-xl drop-shadow-[0_0_8px_rgba(255,0,102,0.8)]">
              -£109.10
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Liquid Pool</p>
            <p className="text-cyber-magenta font-mono font-bold text-xl drop-shadow-[0_0_8px_rgba(255,0,102,0.8)]">
              -£59.57
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
