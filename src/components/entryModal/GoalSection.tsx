import React from 'react';
import type { ModalState, SavingsEntry, ThemeType } from '../../types';
import { getLabelFontFamily } from '../../utils/themeUtils';

interface GoalSectionProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  savingsData: SavingsEntry[];
  theme: ThemeType;
  isLight: boolean;
  tStyle: any;
  inputStyle: any;
  labelStyle: any;
}

/** Target amount/date and linked-savings picker for goal entries. */
export const GoalSection: React.FC<GoalSectionProps> = ({ modal, setModal, savingsData, theme, isLight, tStyle, inputStyle, labelStyle }) => {
  const handleToggleLinkedSaving = (id: string) => {
    setModal((prev) => {
      const currentLinked = prev.linkedSavings || [];
      return {
        ...prev,
        linkedSavings: currentLinked.includes(id)
          ? currentLinked.filter((x) => x !== id)
          : [...currentLinked, id]
      };
    });
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="goal-target-amount" style={labelStyle}>TARGET AMOUNT (£)</label>
          <input
            id="goal-target-amount"
            style={inputStyle}
            type="number"
            value={modal.targetAmount}
            onChange={(e) => setModal({ ...modal, targetAmount: e.target.value })}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="goal-target-date" style={labelStyle}>DATE</label>
          <input
            id="goal-target-date"
            style={inputStyle}
            type="month"
            value={modal.targetDate}
            onChange={(e) => setModal({ ...modal, targetDate: e.target.value })}
          />
        </div>
      </div>
      <label style={labelStyle}>LINKED SAVINGS</label>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: tStyle.colors.metricBg,
          padding: '10px',
          borderRadius: '6px',
          border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)`
        }}
      >
        {(savingsData || []).map((s) => (
          <label
            key={s.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontFamily: getLabelFontFamily(theme)
            }}
          >
            <input
              type="checkbox"
              // SAFE CHECK: Ensure array exists before running .includes()
              checked={(modal.linkedSavings || []).includes(s.id)}
              onChange={() => handleToggleLinkedSaving(s.id)}
            />
            <span>{s.name}</span>
          </label>
        ))}
        {(!savingsData || savingsData.length === 0) && (
          <div style={{ fontSize: '10px', color: tStyle.colors.secondary }}>NO SAVINGS ENTRIES FOUND.</div>
        )}
      </div>
    </>
  );
};
