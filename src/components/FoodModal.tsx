import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ThemeType, FoodModalState } from '../types';
import { ModalBackdrop } from './ModalBackdrop';
import { getInputStyle, getLabelStyle, getPrimaryButtonStyle } from '../utils/formStyles';
import { getLabelFontFamily } from '../utils/themeUtils';

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
  const inputStyle = getInputStyle(tStyle, theme, isLight);
  const labelStyle = getLabelStyle(tStyle, theme);

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
          {modal.mode === 'add' ? 'LOG FOOD ITEM' : 'EDIT FOOD ITEM'}
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
        <div>
          <label htmlFor="food-category" style={labelStyle as any}>CATEGORY</label>
          <select
            id="food-category"
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
          <label htmlFor="food-store" style={labelStyle as any}>STORE NAME</label>
          <input
            id="food-store"
            style={inputStyle}
            placeholder="Coffee Shop"
            value={modal.store}
            onChange={(e) => setModal({ ...modal, store: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="food-item" style={labelStyle as any}>ITEM DESCRIPTION</label>
          <input
            id="food-item"
            style={inputStyle}
            placeholder="Coffee Beans"
            value={modal.item}
            onChange={(e) => setModal({ ...modal, item: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="food-method" style={labelStyle as any}>PAYMENT METHOD</label>
            <select
              id="food-method"
              style={inputStyle}
              value={modal.method}
              onChange={(e) => setModal({ ...modal, method: e.target.value as any })}
            >
              <option value="Debit/Cash">Debit / Cash</option>
              <option value="Credit">Credit</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="food-price" style={labelStyle as any}>PRICE (£)</label>
            <input
              id="food-price"
              style={inputStyle}
              type="number"
              placeholder="14.50"
              value={modal.price}
              onChange={(e) => setModal({ ...modal, price: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="food-date" style={labelStyle as any}>TRANSACTION DATE</label>
          <input
            id="food-date"
            style={inputStyle}
            type="date"
            value={modal.date}
            onChange={(e) => setModal({ ...modal, date: e.target.value })}
          />
        </div>

        <button type="button" style={getPrimaryButtonStyle(tStyle, theme, isLight)} onClick={handleSave}>
          SAVE ENTRY
        </button>
      </div>
    </ModalBackdrop>
  );
};

