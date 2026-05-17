import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ThemeType, FoodModalState } from '../types';

interface FoodModalProps {
  modal: FoodModalState;
  setModal: React.Dispatch<React.SetStateAction<FoodModalState>>;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  handleSave: () => void;
}

const DEFAULT_CATEGORIES = ['Food', 'Drink', 'Alcohol', 'Coffee', 'Snack'];

export const FoodModal: React.FC<FoodModalProps> = ({ modal, setModal, theme, tStyle, isLight, handleSave }) => {
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

  const isCustomCategory = modal.category !== '' && !DEFAULT_CATEGORIES.includes(modal.category);
  const selectValue = isCustomCategory ? 'Custom' : modal.category;

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Custom') {
      setModal({ ...modal, category: '' });
    } else {
      setModal({ ...modal, category: val });
    }
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
                {modal.mode === 'add' ? 'LOG FOOD ITEM' : 'EDIT FOOD ITEM'}
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
              <div>
                <label style={labelStyle as any}>CATEGORY</label>
                <select
                  style={{ ...inputStyle, marginBottom: isCustomCategory ? '8px' : '0' }}
                  value={selectValue}
                  onChange={handleCategorySelect}
                >
                  <option value="" disabled>
                    Select a category...
                  </option>
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Custom">+ Add New Category...</option>
                </select>
                {isCustomCategory && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={inputStyle}
                    placeholder="Type custom category..."
                    value={modal.category}
                    onChange={(e) => setModal({ ...modal, category: e.target.value })}
                    autoFocus
                  />
                )}
              </div>

              <div>
                <label style={labelStyle as any}>STORE NAME</label>
                <input
                  style={inputStyle}
                  placeholder="Coffee Shop"
                  value={modal.store}
                  onChange={(e) => setModal({ ...modal, store: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle as any}>ITEM DESCRIPTION</label>
                <input
                  style={inputStyle}
                  placeholder="Coffee Beans"
                  value={modal.item}
                  onChange={(e) => setModal({ ...modal, item: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle as any}>PAYMENT METHOD</label>
                  <select
                    style={inputStyle}
                    value={modal.method}
                    onChange={(e) => setModal({ ...modal, method: e.target.value as any })}
                  >
                    <option value="Debit/Cash">Debit / Cash</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle as any}>PRICE (£)</label>
                  <input
                    style={inputStyle}
                    type="number"
                    placeholder="14.50"
                    value={modal.price}
                    onChange={(e) => setModal({ ...modal, price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle as any}>TRANSACTION DATE</label>
                <input
                  style={inputStyle}
                  type="date"
                  value={modal.date}
                  onChange={(e) => setModal({ ...modal, date: e.target.value })}
                />
              </div>

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
                onClick={handleSave}
              >
                SAVE ENTRY
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
