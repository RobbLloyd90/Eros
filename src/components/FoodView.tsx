import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, X, MapPin, CreditCard, Banknote } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { useMonthPagination } from '../hooks/useMonthPagination';
import { getLabelFontFamily, getMonoFontFamily } from '../utils/themeUtils';

export const FoodView: React.FC = () => {
  const {
    activeFood: foodEntries,
    theme,
    tStyle,
    isLight,
    openEditFood: onEdit,
    handleRemoveFood: onRemove,
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
    activeMonthKey
  } = useAppState();
  const { swipeDirection, swipeVariants, handleDragEnd } = useMonthPagination(currentMonth, currentYear, setCurrentMonth, setCurrentYear);

  return (
    <motion.div
      key={activeMonthKey}
      custom={swipeDirection}
      variants={swipeVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      style={{
        padding: '0 16px 20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        overflowY: 'auto',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        touchAction: 'pan-y' // Crucial: Prevents vertical scrolling from triggering horizontal swipes
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
            fontFamily: getLabelFontFamily(theme)
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
                      fontFamily: getLabelFontFamily(theme)
                    }}
                  >
                    {entry.item}
                  </div>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 'bold',
                      color: tStyle.colors.primary,
                      fontFamily: getMonoFontFamily(theme, isLight)
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
                    fontFamily: getLabelFontFamily(theme)
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
                    fontFamily: getMonoFontFamily(theme, isLight),
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
                <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => onEdit(entry)}>
                  <Pencil size={15} color={tStyle.colors.secondary} />
                </button>
                <button
                  type="button"
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