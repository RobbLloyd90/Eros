import React from 'react';
import type { ModalState } from '../../types';

interface SavingsSectionProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  isLight: boolean;
  tStyle: any;
  inputStyle: any;
  labelStyle: any;
}

/** Contribution / interest rate / interest earned fields for savings entries. */
export const SavingsSection: React.FC<SavingsSectionProps> = ({ modal, setModal, isLight, tStyle, inputStyle, labelStyle }) => (
  <>
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ flex: 1 }}>
        <label htmlFor="savings-contribution" style={labelStyle}>CONTRIBUTION</label>
        <input
          id="savings-contribution"
          style={inputStyle}
          type="number"
          value={modal.contribution}
          onChange={(e) => setModal({ ...modal, contribution: e.target.value })}
        />
      </div>
    </div>
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ flex: 1 }}>
        <label htmlFor="savings-interest-rate" style={labelStyle}>INTEREST RATE (%)</label>
        <input
          id="savings-interest-rate"
          style={inputStyle}
          type="number"
          value={modal.interestRate}
          onChange={(e) => setModal({ ...modal, interestRate: e.target.value })}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label htmlFor="savings-interest-earned" style={labelStyle}>INTEREST EARNED</label>
        <input
          id="savings-interest-earned"
          style={inputStyle}
          type="number"
          value={modal.interestEarned}
          onChange={(e) => setModal({ ...modal, interestEarned: e.target.value })}
        />
      </div>
    </div>
    <div style={{ flex: 2, backgroundColor: tStyle.colors.metricBg, height: '50px', display: 'flex', padding: '10px', borderRadius: '8px', border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)` }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', ...labelStyle }}>
        <input
          type="checkbox"
          checked={!!modal.isRecurring}
          onChange={(e) => setModal({ ...modal, isRecurring: e.target.checked, recurringFreq: modal.recurringFreq || 'monthly_last_day', fortnightStartWeek: modal.fortnightStartWeek || 1 })}
        />
        <span style={{ fontSize: '12px', color: tStyle.colors.primary }}>NON-FIXED INTEREST</span>
      </label>
    </div>
  </>
);
