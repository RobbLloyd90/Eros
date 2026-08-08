import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ThemeType, ChartModalState, Goal } from '../types';
import { ModalBackdrop } from './ModalBackdrop';
import { getInputStyle, getLabelStyle, getPrimaryButtonStyle } from '../utils/formStyles';
import { getLabelFontFamily } from '../utils/themeUtils';

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

  const inputStyle = getInputStyle(tStyle, theme, isLight);
  const labelStyle = getLabelStyle(tStyle, theme);

  return (
    <ModalBackdrop isOpen={modal.isOpen} isLight={isLight} tStyle={tStyle}>
      <div style={{ padding: '20px', borderBottom: isLight ? `1px solid rgba(0,0,0,0.05)` : `1px solid rgba(255,255,255,0.1)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1.5px', color: tStyle.colors.secondary, fontFamily: getLabelFontFamily(theme) }}>
          {modal.mode === 'add' ? 'CREATE CHART' : 'EDIT CHART'}
        </span>
        <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setModal((prev) => ({ ...prev, isOpen: false }))}>
          <X size={20} color={tStyle.colors.secondary} />
        </button>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
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
                    fontFamily: getLabelFontFamily(theme),
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

        <button type="button" style={getPrimaryButtonStyle(tStyle, theme, isLight)} onClick={handleSave}>
          {modal.mode === 'add' ? 'ADD TO DASHBOARD' : 'SAVE CHANGES'}
        </button>
      </div>
    </ModalBackdrop>
  );
};