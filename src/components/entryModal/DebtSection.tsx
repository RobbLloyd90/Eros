import React from 'react';
import type { ModalState } from '../../types';
import { calculateDailyDebtInterest, getDaysBetweenDates, FALLBACK_DEBT_ACCRUAL_DAYS } from '../../utils/dataEngine';

interface DebtSectionProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  tStyle: any;
  inputStyle: any;
  labelStyle: any;
}

/** Remaining loan value / payment date / interest rate / actual payment fields for debt entries. */
export const DebtSection: React.FC<DebtSectionProps> = ({ modal, setModal, tStyle, inputStyle, labelStyle }) => {
  // Debt interest is always fixed-rate: interestAccrued is always auto-calculated, never manually entered.
  const recalculatedInterest = (currentBalance: string, interestRate: string, paymentDate: string) => {
    const days = modal.previousPaymentDate ? getDaysBetweenDates(modal.previousPaymentDate, paymentDate) : FALLBACK_DEBT_ACCRUAL_DAYS;
    return calculateDailyDebtInterest(parseFloat(currentBalance) || 0, parseFloat(interestRate) || 0, days).toFixed(2);
  };

  const handleBalanceChange = (value: string) => {
    setModal({ ...modal, currentBalance: value, interestAccrued: recalculatedInterest(value, modal.interestRate, modal.paymentDate || '') });
  };

  const handleInterestRateChange = (value: string) => {
    setModal({ ...modal, interestRate: value, interestAccrued: recalculatedInterest(modal.currentBalance, value, modal.paymentDate || '') });
  };

  const handlePaymentDateChange = (value: string) => {
    setModal({ ...modal, paymentDate: value, interestAccrued: recalculatedInterest(modal.currentBalance, modal.interestRate, value) });
  };

  const remainingAfterPayment = (parseFloat(modal.currentBalance) || 0) + (parseFloat(modal.interestAccrued) || 0) - (parseFloat(modal.actualPayment) || 0);

  return (
    <>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="debt-current-balance" style={labelStyle}>REMAINING LOAN VALUE (£)</label>
          <input
            id="debt-current-balance"
            style={inputStyle}
            type="number"
            value={modal.currentBalance}
            onChange={(e) => handleBalanceChange(e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="debt-payment-date" style={labelStyle}>PAYMENT DATE</label>
          <input
            id="debt-payment-date"
            style={inputStyle}
            type="date"
            value={modal.paymentDate || ''}
            onChange={(e) => handlePaymentDateChange(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="debt-min-payment" style={labelStyle}>MIN PAYMENT (£)</label>
          <input
            id="debt-min-payment"
            style={inputStyle}
            type="number"
            value={modal.minimumPayment}
            onChange={(e) => setModal({ ...modal, minimumPayment: e.target.value })}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="debt-interest-rate" style={labelStyle}>INTEREST RATE (%)</label>
          <input
            id="debt-interest-rate"
            style={inputStyle}
            type="number"
            value={modal.interestRate}
            onChange={(e) => handleInterestRateChange(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="debt-interest-accrued" style={labelStyle}>INTEREST ACCRUED (£)</label>
          <input
            id="debt-interest-accrued"
            style={{ ...inputStyle, opacity: 0.6 }}
            type="number"
            value={modal.interestAccrued}
            disabled
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="debt-actual-payment" style={labelStyle}>ACTUAL PAYMENT (£)</label>
          <input
            id="debt-actual-payment"
            style={inputStyle}
            type="number"
            value={modal.actualPayment}
            onChange={(e) => setModal({ ...modal, actualPayment: e.target.value })}
          />
        </div>
      </div>
      <div style={{ fontSize: '10px', color: tStyle.colors.secondary, ...labelStyle }}>
        REMAINING AFTER THIS PAYMENT: £{remainingAfterPayment.toFixed(2)}
      </div>
    </>
  );
};

