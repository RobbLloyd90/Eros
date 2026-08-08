import React from 'react';
import { X } from 'lucide-react';
import type { ThemeType, ModalState, SavingsEntry } from '../types';
import { BLADE_CONFIG } from '../config';
import { ModalBackdrop } from './ModalBackdrop';
import { CategoryPicker } from './entryModal/CategoryPicker';
import { RecurringIncomeSection } from './entryModal/RecurringIncomeSection';
import { SavingsSection } from './entryModal/SavingsSection';
import { DebtSection } from './entryModal/DebtSection';
import { GoalSection } from './entryModal/GoalSection';
import { getInputStyle, getLabelStyle, getPrimaryButtonStyle } from '../utils/formStyles';
import { getLabelFontFamily } from '../utils/themeUtils';

interface EntryModalProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  savingsData: SavingsEntry[];
  handleModalSave: () => void;
}

export const EntryModal: React.FC<EntryModalProps> = ({
  modal,
  setModal,
  theme,
  tStyle,
  isLight,
  savingsData,
  handleModalSave
}) => {
  const isLinkedFoodEntry = modal.id === 'fluid-food';

  const inputStyle = getInputStyle(tStyle, theme, isLight);
  const labelStyle = getLabelStyle(tStyle, theme);

  return (
    <ModalBackdrop isOpen={modal.isOpen} isLight={isLight} tStyle={tStyle}>
      <div
        style={{
          padding: '20px',
          borderBottom: isLight ? `1px solid rgba(0,0,0,0.05)` : `1px solid rgba(255,255,255,0.1)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1.5px',
            color: tStyle.colors.secondary,
            fontFamily: getLabelFontFamily(theme)
          }}
        >
          {modal.mode === 'add' ? 'NEW ENTRY' : 'EDIT ENTRY'}
        </span>
        <button
          type="button"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <X size={20} color={tStyle.colors.secondary} />
        </button>
      </div>
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          overflowY: 'auto',
          maxHeight: '70vh'
        }}
      >
        <label htmlFor="entry-section" style={labelStyle as any}>SECTION</label>
        <select
          id="entry-section"
          style={inputStyle}
          value={modal.bladeId}
          onChange={(e) =>
            setModal({ ...modal, bladeId: e.target.value as ModalState['bladeId'], isGoal: e.target.value === 'goals', category: '' })
          }
          disabled={modal.mode === 'edit'}
        >
          {BLADE_CONFIG.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        <label htmlFor="entry-name" style={labelStyle as any}>ENTRY NAME</label>
        <input
          id="entry-name"
          style={{ ...inputStyle, opacity: isLinkedFoodEntry ? 0.5 : 1 }}
          placeholder="Identifier"
          value={modal.name}
          onChange={(e) => setModal({ ...modal, name: e.target.value })}
          disabled={isLinkedFoodEntry}
        />

        {/* DYNAMIC CATEGORY PICKER (Only showing for flow engines) */}
        {(modal.bladeId === 'inflows' || modal.bladeId === 'outflows') && !modal.isGoal && (
          <CategoryPicker modal={modal} setModal={setModal} inputStyle={inputStyle} labelStyle={labelStyle} />
        )}

        {/* --- RECURRING INCOME UI --- */}
        {modal.bladeId === 'inflows' && !modal.isGoal && (
          <RecurringIncomeSection
            modal={modal}
            setModal={setModal}
            theme={theme}
            isLight={isLight}
            tStyle={tStyle}
            inputStyle={inputStyle}
            labelStyle={labelStyle}
          />
        )}

        {/* SAVINGS UI */}
        {modal.bladeId === 'savings' && !modal.isGoal && (
          <SavingsSection modal={modal} setModal={setModal} isLight={isLight} tStyle={tStyle} inputStyle={inputStyle} labelStyle={labelStyle} />
        )}

        {/* DEBT UI */}
        {modal.bladeId === 'debt' && !modal.isGoal && (
          <DebtSection modal={modal} setModal={setModal} tStyle={tStyle} inputStyle={inputStyle} labelStyle={labelStyle} />
        )}

        {/* STANDARD FLOWS UI */}
        {(modal.bladeId === 'inflows' || modal.bladeId === 'outflows') && !modal.isGoal && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="entry-expected" style={labelStyle as any}>EXPECTED (£)</label>
              <input
                id="entry-expected"
                style={inputStyle}
                type="number"
                value={modal.expected}
                onChange={(e) => setModal({ ...modal, expected: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="entry-actual"
                style={
                  { ...labelStyle, color: isLinkedFoodEntry ? tStyle.colors.pos : tStyle.colors.secondary } as any
                }
              >
                ACTUAL {isLinkedFoodEntry && '(LINKED)'}
              </label>
              <input
                id="entry-actual"
                style={{ ...inputStyle, opacity: isLinkedFoodEntry ? 0.5 : 1 }}
                type="number"
                value={modal.actual}
                onChange={(e) => setModal({ ...modal, actual: e.target.value })}
                disabled={isLinkedFoodEntry}
              />
            </div>
          </div>
        )}

        {/* GOALS UI */}
        {modal.isGoal && (
          <GoalSection
            modal={modal}
            setModal={setModal}
            savingsData={savingsData}
            theme={theme}
            isLight={isLight}
            tStyle={tStyle}
            inputStyle={inputStyle}
            labelStyle={labelStyle}
          />
        )}

        <button type="button" style={getPrimaryButtonStyle(tStyle, theme, isLight)} onClick={handleModalSave}>
          SAVE
        </button>
      </div>
    </ModalBackdrop>
  );
};
