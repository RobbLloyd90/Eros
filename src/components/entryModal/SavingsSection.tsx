import React from 'react';
import type { ModalState } from '../../types';
import { calculateMonthlySavingsInterest } from '../../utils/dataEngine';

interface SavingsSectionProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  isLight: boolean;
  tStyle: any;
  inputStyle: any;
  labelStyle: any;
}

/** Current balance / contribution / interest rate fields for savings entries. */
export const SavingsSection: React.FC<SavingsSectionProps> = ({ modal, setModal, isLight, tStyle, inputStyle, labelStyle }) => {
  const recalculatedInterest = (currentBalance: string, interestRate: string) =>
    calculateMonthlySavingsInterest(parseFloat(currentBalance) || 0, parseFloat(interestRate) || 0).toFixed(2);

  const handleCurrentBalanceChange = (value: string) => {
    setModal({
      ...modal,
      currentBalance: value,
      ...(modal.isFixedInterestRate && { interestEarned: recalculatedInterest(value, modal.interestRate) })
    });
  };

  const handleInterestRateChange = (value: string) => {
    setModal({
      ...modal,
      interestRate: value,
      ...(modal.isFixedInterestRate && { interestEarned: recalculatedInterest(modal.currentBalance, value) })
    });
  };

  const handleFixedInterestToggle = (checked: boolean) => {
    setModal({
      ...modal,
      isFixedInterestRate: checked,
      ...(checked && { interestEarned: recalculatedInterest(modal.currentBalance, modal.interestRate) })
    });
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="savings-current-balance" style={labelStyle}>CURRENT BALANCE (£)</label>
          <input
            id="savings-current-balance"
            style={inputStyle}
            type="number"
            value={modal.currentBalance}
            onChange={(e) => handleCurrentBalanceChange(e.target.value)}
          />
        </div>
      </div>
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
      <div style={{ backgroundColor: tStyle.colors.metricBg, padding: '10px', borderRadius: '8px', border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)` }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', ...labelStyle }}>
          <input
            type="checkbox"
            checked={!!modal.isRecurringContribution}
            onChange={(e) => setModal({ ...modal, isRecurringContribution: e.target.checked })}
          />
          <span style={{ fontSize: '12px', color: tStyle.colors.primary }}>RECURRING CONTRIBUTION (carries into next month)</span>
        </label>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="savings-interest-rate" style={labelStyle}>INTEREST RATE (%)</label>
          <input
            id="savings-interest-rate"
            style={inputStyle}
            type="number"
            value={modal.interestRate}
            onChange={(e) => handleInterestRateChange(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="savings-interest-earned" style={labelStyle}>INTEREST EARNED</label>
          <input
            id="savings-interest-earned"
            style={{ ...inputStyle, opacity: modal.isFixedInterestRate ? 0.6 : 1 }}
            type="number"
            value={modal.interestEarned}
            disabled={!!modal.isFixedInterestRate}
            onChange={(e) => setModal({ ...modal, interestEarned: e.target.value })}
          />
        </div>
      </div>
      <div style={{ flex: 2, backgroundColor: tStyle.colors.metricBg, height: '50px', display: 'flex', padding: '10px', borderRadius: '8px', border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)` }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', ...labelStyle }}>
          <input
            type="checkbox"
            checked={!!modal.isFixedInterestRate}
            onChange={(e) => handleFixedInterestToggle(e.target.checked)}
          />
          <span style={{ fontSize: '12px', color: tStyle.colors.primary }}>FIXED INTEREST RATE (auto-calculates interest earned)</span>
        </label>
      </div>
    </>
  );
};

