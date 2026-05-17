import React from 'react';
import { motion } from 'framer-motion';
import { MONTH_NAMES } from '../config';
import type { ThemeType, GlobalLedger } from '../types';

interface YearViewProps {
  currentYear: number;
  ledger: GlobalLedger;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  onSelectMonth: (monthIndex: number) => void;
}

export const YearView: React.FC<YearViewProps> = ({ currentYear, ledger, theme, tStyle, isLight, onSelectMonth }) => {
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
                fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
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
                  fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
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
