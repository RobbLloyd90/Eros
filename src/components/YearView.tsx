import React from 'react';
import { motion } from 'framer-motion';
import { MONTH_NAMES } from '../config';
import { useAppState } from '../context/AppStateContext';
import { getLabelFontFamily } from '../utils/themeUtils';

export const YearView: React.FC = () => {
  const { currentYear, ledger, theme, tStyle, setCurrentMonth, setView } = useAppState();
  const onSelectMonth = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setView('month');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      style={{
        padding: '0 16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
        height: '100%',
        alignContent: 'center',
        overflowY: 'auto'
      }}
    >
      {MONTH_NAMES.map((month, index) => {
        const monthKey = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
        const hasData = !!ledger[monthKey];

        return (
          <motion.div
            key={month}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelectMonth(index + 1)}
            style={{
              aspectRatio: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              ...tStyle.row,
              border: hasData ? `1px solid ${tStyle.colors.pos}` : tStyle.row.border
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: tStyle.colors.primary,
                fontFamily: getLabelFontFamily(theme)
              }}
            >
              {month}
            </span>
            {hasData && (
              <span
                style={{
                  fontSize: '9px',
                  color: tStyle.colors.pos,
                  marginTop: '4px',
                  fontFamily: getLabelFontFamily(theme)
                }}
              >
                ACTIVE
              </span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};
