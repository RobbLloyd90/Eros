import React from 'react';
import { motion } from 'framer-motion';
import type { ModalState } from '../../types';
import { INFLOW_CATEGORIES, OUTFLOW_CATEGORIES } from './constants';

interface CategoryPickerProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  inputStyle: any;
  labelStyle: any;
}

/** Category select for inflow/outflow entries, with a custom-category fallback input. */
export const CategoryPicker: React.FC<CategoryPickerProps> = ({ modal, setModal, inputStyle, labelStyle }) => {
  const activeCategories = modal.bladeId === 'inflows' ? INFLOW_CATEGORIES : OUTFLOW_CATEGORIES;
  const isCustomCategory = modal.category !== '' && !activeCategories.includes(modal.category);
  const selectValue = isCustomCategory ? 'Custom' : modal.category;

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setModal({ ...modal, category: val === 'Custom' ? '' : val });
  };

  return (
    <div>
      <label htmlFor="entry-category" style={labelStyle}>CATEGORY</label>
      <select
        id="entry-category"
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
  );
};
