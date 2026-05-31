import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ThemeType, ModalState, Entry } from '../types';
import { BLADE_CONFIG } from '../config';

interface EntryModalProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  savingsData: Entry[];
  handleModalSave: () => void;
}

const INFLOW_CATEGORIES = ['Salary', 'Investment', 'Freelance', 'Gift', 'Other'];
const OUTFLOW_CATEGORIES = ['Housing', 'Utilities', 'Groceries', 'Transport', 'Insurance', 'Entertainment', 'Other'];

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

  // Context-aware category checking engine
  const activeCategories = modal.bladeId === 'inflows' ? INFLOW_CATEGORIES : OUTFLOW_CATEGORIES;
  const isCustomCategory = modal.category !== '' && !activeCategories.includes(modal.category);
  const selectValue = isCustomCategory ? 'Custom' : modal.category;

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Custom') {
      setModal({ ...modal, category: '' });
    } else {
      setModal({ ...modal, category: val });
    }
  };

  // --- Internal state handler for toggling linked savings safely ---
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
    <AnimatePresence>
      {modal.isOpen && (
        <motion.div
          intent="popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <motion.div
            initial={{ y: 30, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.98 }}
            style={{
              background: tStyle.colors.modalBg,
              backdropFilter: 'blur(24px)',
              width: '100%',
              maxWidth: '380px',
              borderRadius: '20px',
              border: isLight ? `1px solid rgba(255,255,255,0.9)` : `1px solid rgba(255,255,255,0.15)`,
              boxShadow: isLight
                ? 'inset 0 1px 1px rgba(255,255,255,1), 0 20px 40px rgba(0,0,0,0.15)'
                : 'inset 0 1px 1px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              color: tStyle.colors.primary
            }}
          >
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
                  fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
                }}
              >
                {modal.mode === 'add' ? 'NEW ENTRY' : 'EDIT ENTRY'}
              </span>
              <button
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
              <label style={labelStyle as any}>SECTION</label>
              <select
                style={inputStyle}
                value={modal.bladeId}
                onChange={(e) =>
                  setModal({ ...modal, bladeId: e.target.value, isGoal: e.target.value === 'goals', category: '' })
                }
                disabled={modal.mode === 'edit'}
              >
                {BLADE_CONFIG.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>

              <label style={labelStyle as any}>ENTRY NAME</label>
              <input
                style={{ ...inputStyle, opacity: isLinkedFoodEntry ? 0.5 : 1 }}
                placeholder="Identifier"
                value={modal.name}
                onChange={(e) => setModal({ ...modal, name: e.target.value })}
                disabled={isLinkedFoodEntry}
              />

              {/* DYNAMIC CATEGORY PICKER (Only showing for flow engines) */}
              {(modal.bladeId === 'inflows' || modal.bladeId === 'outflows') && !modal.isGoal && (
                <div>
                  <label style={labelStyle as any}>CATEGORY</label>
                  <select
                    style={{ ...inputStyle, marginBottom: isCustomCategory ? '8px' : '0' }}
                    value={selectValue}
                    onChange={handleCategorySelect}
                  >
                    <option value="" disabled>
                      Select category...
                    </option>
                    {activeCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Custom">+ Add Custom Category...</option>
                  </select>
                  {isCustomCategory && (
                    <motion.input
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={inputStyle}
                      placeholder="Type custom specification..."
                      value={modal.category}
                      onChange={(e) => setModal({ ...modal, category: e.target.value })}
                      autoFocus
                    />
                  )}
                </div>
              )}

              {/* --- NEW: RECURRING INCOME UI --- */}
              {modal.bladeId === 'inflows' && !modal.isGoal && (
                <div style={{ backgroundColor: tStyle.colors.metricBg, padding: '12px', borderRadius: '8px', border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)` }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', ...labelStyle as any }}>
                    <input 
                      type="checkbox" 
                      checked={!!modal.isRecurring} 
                      onChange={(e) => setModal({ ...modal, isRecurring: e.target.checked, recurringFreq: modal.recurringFreq || 'monthly_last_day', fortnightStartWeek: modal.fortnightStartWeek || 1 })} 
                    />
                    <span style={{ fontSize: '12px', color: tStyle.colors.primary }}>THIS IS A RECURRING INCOME</span>
                  </label>

                  <AnimatePresence>
                    {modal.isRecurring && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', overflow: 'hidden' }}>
                        <div>
                          <label style={labelStyle as any}>PAY CYCLE FREQUENCY</label>
                          <select style={inputStyle} value={modal.recurringFreq || 'monthly_last_day'} onChange={(e) => setModal({ ...modal, recurringFreq: e.target.value })}>
                            <option value="weekly">Weekly (Every Friday)</option>
                            <option value="fortnightly">Fortnightly (Every other Friday)</option>
                            <option value="monthly_last_friday">Monthly (Last Working Friday)</option>
                            <option value="monthly_last_day">Monthly (Last Working Day of the Month)</option>
                          </select>
                        </div>
                        
                        {modal.recurringFreq === 'fortnightly' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <label style={labelStyle as any}>CYCLE START POINT</label>
                            <select style={inputStyle} value={modal.fortnightStartWeek || 1} onChange={(e) => setModal({ ...modal, fortnightStartWeek: Number(e.target.value) })}>
                              <option value={1}>Starts Week 1 of the Month</option>
                              <option value={2}>Starts Week 2 of the Month</option>
                            </select>
                            <div style={{ fontSize: '9px', color: tStyle.colors.secondary, marginTop: '4px', fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>
                              This tells the engine which alternating Fridays to inject the ledger.
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {/* --- END RECURRING UI --- */}

              {/* SAVINGS UI (Preserved exactly from your file) */}
              {modal.bladeId === 'savings' && !modal.isGoal && (
                <>
                  <div style={{ display: 'flex', gap: '12px' }}>

                    <div style={{ flex: 1 }}>
                      <label style={labelStyle as any}>CONTRIBUTION</label>
                      <input
                        style={inputStyle}
                        type="number"
                        value={modal.contribution}
                        onChange={(e) => setModal({ ...modal, contribution: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle as any}>INTEREST RATE (%)</label>
                      <input
                        style={inputStyle}
                        type="number"
                        value={modal.interestRate}
                        onChange={(e) => setModal({ ...modal, interestRate: e.target.value })}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle as any}>INTEREST EARNED</label>
                      <input
                        style={inputStyle}
                        type="number"
                        value={modal.interestEarned}
                        onChange={(e) => setModal({ ...modal, interestEarned: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* DEBT UI (Preserved exactly from your file) */}
              {modal.bladeId === 'debt' && !modal.isGoal && (
                <>
                  <div style={{ display: 'flex', gap: '12px' }}>

                    <div style={{ flex: 1 }}>
                      <label style={labelStyle as any}>MIN PAYMENT (£)</label>
                      <input
                        style={inputStyle}
                        type="number"
                        value={modal.minimumPayment}
                        onChange={(e) => setModal({ ...modal, minimumPayment: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle as any}>INTEREST RATE (%)</label>
                      <input
                        style={inputStyle}
                        type="number"
                        value={modal.interestRate}
                        onChange={(e) => setModal({ ...modal, interestRate: e.target.value })}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle as any}>INTEREST ACCRUED (£)</label>
                      <input
                        style={inputStyle}
                        type="number"
                        value={modal.interestAccrued}
                        onChange={(e) => setModal({ ...modal, interestAccrued: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle as any}>ACTUAL PAYMENT (£)</label>
                      <input
                        style={inputStyle}
                        type="number"
                        value={modal.actualPayment}
                        onChange={(e) => setModal({ ...modal, actualPayment: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* STANDARD FLOWS UI */}
              {(modal.bladeId === 'inflows' || modal.bladeId === 'outflows') && !modal.isGoal && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle as any}>EXPECTED (£)</label>
                    <input
                      style={inputStyle}
                      type="number"
                      value={modal.expected}
                      onChange={(e) => setModal({ ...modal, expected: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={
                        { ...labelStyle, color: isLinkedFoodEntry ? tStyle.colors.pos : tStyle.colors.secondary } as any
                      }
                    >
                      ACTUAL {isLinkedFoodEntry && '(LINKED)'}
                    </label>
                    <input
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
                <>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle as any}>TARGET AMOUNT (£)</label>
                      <input
                        style={inputStyle}
                        type="number"
                        value={modal.targetAmount}
                        onChange={(e) => setModal({ ...modal, targetAmount: e.target.value })}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle as any}>DATE</label>
                      <input
                        style={inputStyle}
                        type="month"
                        value={modal.targetDate}
                        onChange={(e) => setModal({ ...modal, targetDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <label style={labelStyle as any}>LINKED SAVINGS</label>
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
                          fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
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
              )}

              <button
                style={{
                  backgroundColor: tStyle.colors.pos,
                  color: theme.includes('nothing') ? '#000' : '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  marginTop: '8px',
                  boxShadow: isLight
                    ? 'inset 0 2px 2px rgba(255,255,255,0.4), 0 4px 10px rgba(16, 185, 129, 0.3)'
                    : 'inset 0 2px 2px rgba(255,255,255,0.4)',
                  fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
                }}
                onClick={handleModalSave}
              >
                SAVE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};