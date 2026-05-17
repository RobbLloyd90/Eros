import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ThemeType, ChartModalState, Goal } from '../types';

interface AddChartModalProps {
  modal: ChartModalState;
  setModal: React.Dispatch<React.SetStateAction<ChartModalState>>;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  goals: Goal[];
  handleSave: () => void;
}

export const AddChartModal: React.FC<AddChartModalProps> = ({
  modal,
  setModal,
  theme,
  tStyle,
  isLight,
  goals,
  handleSave
}) => {
  const toggleGoal = (id: string) => {
    setModal((prev) => {
      const currentIds = prev.targetIds || [];
      return {
        ...prev,
        targetIds: currentIds.includes(id)
          ? currentIds.filter((x) => x !== id)
          : [...currentIds, id]
      };
    });
  };

  const inputStyle = {
    backgroundColor: tStyle.colors.metricBg,
    color: tStyle.colors.primary,
    border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)`,
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
  };

  const labelStyle = {
    fontSize: '10px',
    color: tStyle.colors.secondary,
    letterSpacing: '1px',
    fontWeight: 700,
    fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
  };

  return (
    <AnimatePresence>
      {modal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
          }}
        >
          <motion.div
            initial={{ y: 30, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.98 }}
            style={{
              background: tStyle.colors.modalBg, backdropFilter: 'blur(24px)', width: '100%', maxWidth: '380px',
              borderRadius: '20px', border: isLight ? `1px solid rgba(255,255,255,0.9)` : `1px solid rgba(255,255,255,0.15)`,
              boxShadow: isLight ? 'inset 0 1px 1px rgba(255,255,255,1), 0 20px 40px rgba(0,0,0,0.15)' : 'inset 0 1px 1px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', color: tStyle.colors.primary
            }}
          >
            <div style={{ padding: '20px', borderBottom: isLight ? `1px solid rgba(0,0,0,0.05)` : `1px solid rgba(255,255,255,0.1)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1.5px', color: tStyle.colors.secondary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>
                {modal.mode === 'add' ? 'CREATE CHART' : 'EDIT CHART'}
              </span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setModal((prev) => ({ ...prev, isOpen: false }))}>
                <X size={20} color={tStyle.colors.secondary} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
              <div>
                <label style={labelStyle as any}>CHART TITLE</label>
                <input style={inputStyle} placeholder="e.g., House Deposit Progress" value={modal.title} onChange={(e) => setModal({ ...modal, title: e.target.value })} />
              </div>

              <div>
                <label style={labelStyle as any}>VISUAL STYLE</label>
                <select style={inputStyle} value={modal.type} onChange={(e) => {
                    const newType = e.target.value as any;
                    const newSource = newType === 'line' ? 'netWorth' : 'outflows';
                    setModal({ ...modal, type: newType, source: newSource });
                  }}>
                  <option value="pie">Pie Chart (Percentage)</option>
                  <option value="bar">Bar Chart (Totals)</option>
                  <option value="line">Line Chart (Trends over Time)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle as any}>DATA SOURCE</label>
                <select style={inputStyle} value={modal.source} onChange={(e) => setModal({ ...modal, source: e.target.value as any })}>
                  {modal.type === 'line' ? (
                    <>
                      <option value="netWorth">Long-Term Tracking (Savings vs Debt)</option>
                      <option value="goal_trend">Specific Savings Goal(s)</option>
                      <option value="savings_trend">Total Savings Over Time</option>
                      <option value="debt_trend">Total Debt Over Time</option>
                      <option value="inflows_trend">Total Incoming Over Time</option>
                      <option value="outflows_trend">Total Outgoings Over Time</option>
                      <option value="food_trend">Total Food Budget Over Time</option>
                    </>
                  ) : (
                    <>
                      <option value="food">Food Budget (By Category)</option>
                      <option value="outflows">Outgoings (By Item)</option>
                      <option value="inflows">Incoming (By Source)</option>
                    </>
                  )}
                </select>
              </div>

              {modal.source === 'goal_trend' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label style={labelStyle as any}>SELECT GOALS TO TRACK (COMBINE MULTIPLE)</label>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      backgroundColor: tStyle.colors.metricBg,
                      padding: '10px',
                      borderRadius: '6px',
                      border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)`,
                      marginTop: '4px'
                    }}
                  >
                    {(goals || []).map((g) => (
                      <label
                        key={g.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit',
                          color: tStyle.colors.primary
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={(modal.targetIds || []).includes(g.id)}
                          onChange={() => toggleGoal(g.id)}
                        />
                        <span>
                          {/* CRITICAL FIX: Forces name fallback and strict Number casting to prevent toFixed string crashes */}
                          {g.name || 'Unnamed Goal'} (£{Number(g.targetAmount || 0).toFixed(2)})
                        </span>
                      </label>
                    ))}
                    
                    {(!goals || goals.length === 0) && (
                      <div style={{ fontSize: '10px', color: tStyle.colors.secondary }}>NO ACTIVE GOALS FOUND.</div>
                    )}
                  </div>
                </motion.div>
              )}

              <button
                style={{
                  backgroundColor: tStyle.colors.pos, color: theme.includes('nothing') ? '#000' : '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', marginTop: '8px',
                  boxShadow: isLight ? 'inset 0 2px 2px rgba(255,255,255,0.4), 0 4px 10px rgba(16, 185, 129, 0.3)' : 'inset 0 2px 2px rgba(255,255,255,0.4)',
                  fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
                }}
                onClick={handleSave}
              >
                {modal.mode === 'add' ? 'ADD TO DASHBOARD' : 'SAVE CHANGES'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};