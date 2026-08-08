import React from 'react';
import type { ModalState } from '../../types';

interface DebtSectionProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  inputStyle: any;
  labelStyle: any;
}

/** Minimum payment / interest rate / interest accrued / actual payment fields for debt entries. */
export const DebtSection: React.FC<DebtSectionProps> = ({ modal, setModal, inputStyle, labelStyle }) => (
  <>
    <div style={{ display: 'flex', gap: '12px' }}>
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
          onChange={(e) => setModal({ ...modal, interestRate: e.target.value })}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label htmlFor="debt-interest-accrued" style={labelStyle}>INTEREST ACCRUED (£)</label>
        <input
          id="debt-interest-accrued"
          style={inputStyle}
          type="number"
          value={modal.interestAccrued}
          onChange={(e) => setModal({ ...modal, interestAccrued: e.target.value })}
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
  </>
);
