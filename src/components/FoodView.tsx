import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, X, MapPin, CreditCard, Banknote } from 'lucide-react';
import type { ThemeType, FoodEntry } from '../types';

interface FoodViewProps {
  foodEntries: FoodEntry[];
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  onEdit: (entry: FoodEntry) => void;
  onRemove: (id: string) => void;
}

export const FoodView: React.FC<FoodViewProps> = ({ foodEntries, theme, tStyle, isLight, onEdit, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        padding: '0 16px 20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      {foodEntries.length === 0 ? (
        <div
          style={{
            color: tStyle.colors.secondary,
            textAlign: 'center',
            marginTop: '30px',
            fontSize: '11px',
            letterSpacing: '1px',
            fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
          }}
        >
          NO FOOD ENTRIES THIS MONTH.
        </div>
      ) : (
        foodEntries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((entry) => (
            <div
              key={entry.id}
              style={{
                ...tStyle.row,
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: `3px solid ${tStyle.colors.neg}`
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}
                >
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 'bold',
                      color: tStyle.colors.primary,
                      fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
                    }}
                  >
                    {entry.item}
                  </div>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 'bold',
                      color: tStyle.colors.primary,
                      fontFamily: theme.includes('nothing')
                        ? "'DotGothic16', sans-serif"
                        : isLight
                          ? 'inherit'
                          : "'Share Tech Mono', monospace"
                    }}
                  >
                    £{entry.price.toFixed(2)}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '10px',
                    color: tStyle.colors.pos,
                    letterSpacing: '1px',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
                  }}
                >
                  {entry.category.toUpperCase()}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '10px',
                    color: tStyle.colors.secondary,
                    fontFamily: theme.includes('nothing')
                      ? "'DotGothic16', sans-serif"
                      : isLight
                        ? 'inherit'
                        : "'Share Tech Mono', monospace",
                    fontWeight: isLight ? 600 : 'normal'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={10} /> {entry.store}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {entry.method === 'Credit' ? <CreditCard size={10} /> : <Banknote size={10} />} {entry.method}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: tStyle.colors.metricBg,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {entry.date}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginLeft: '12px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => onEdit(entry)}>
                  <Pencil size={15} color={tStyle.colors.secondary} />
                </button>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => onRemove(entry.id)}
                >
                  <X size={18} color={tStyle.colors.neg} />
                </button>
              </div>
            </div>
          ))
      )}
    </motion.div>
  );
};
