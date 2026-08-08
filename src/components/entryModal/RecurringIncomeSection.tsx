import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ModalState, ThemeType } from '../../types';
import { getLabelFontFamily } from '../../utils/themeUtils';

interface RecurringIncomeSectionProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  theme: ThemeType;
  isLight: boolean;
  tStyle: any;
  inputStyle: any;
  labelStyle: any;
}

/** Recurring-income toggle + pay-cycle frequency configuration for inflow entries. */
export const RecurringIncomeSection: React.FC<RecurringIncomeSectionProps> = ({
  modal,
  setModal,
  theme,
  isLight,
  tStyle,
  inputStyle,
  labelStyle
}) => (
  <div style={{ backgroundColor: tStyle.colors.metricBg, padding: '12px', borderRadius: '8px', border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)` }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', ...labelStyle }}>
      <input
        type="checkbox"
        checked={!!modal.isRecurring}
        onChange={(e) => setModal({ ...modal, isRecurring: e.target.checked, recurringFreq: modal.recurringFreq || 'monthly_last_day', fortnightStartWeek: modal.fortnightStartWeek || 1 })}
      />
      <span style={{ fontSize: '12px', color: tStyle.colors.primary }}>RECURRING INCOME</span>
    </label>

    <AnimatePresence>
      {modal.isRecurring && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', overflow: 'hidden' }}>
          <div>
            <label htmlFor="recurring-freq" style={labelStyle}>PAY CYCLE FREQUENCY</label>
            <select id="recurring-freq" style={inputStyle} value={modal.recurringFreq || 'monthly_last_day'} onChange={(e) => setModal({ ...modal, recurringFreq: e.target.value })}>
              <option value="weekly">Weekly (Every Friday)</option>
              <option value="fortnightly">Fortnightly (Every other Friday)</option>
              <option value="monthly_last_friday">Monthly (Last Working Friday)</option>
              <option value="monthly_last_day">Monthly (Last Working Day of the Month)</option>
            </select>
          </div>

          {modal.recurringFreq === 'fortnightly' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label htmlFor="fortnight-start" style={labelStyle}>CYCLE START POINT</label>
              <select id="fortnight-start" style={inputStyle} value={modal.fortnightStartWeek || 1} onChange={(e) => setModal({ ...modal, fortnightStartWeek: Number(e.target.value) })}>
                <option value={1}>Starts Week 1 of the Month</option>
                <option value={2}>Starts Week 2 of the Month</option>
              </select>
              <div style={{ fontSize: '9px', color: tStyle.colors.secondary, marginTop: '4px', fontFamily: getLabelFontFamily(theme) }}>
                This tells the engine which alternating Fridays to inject the ledger.
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
