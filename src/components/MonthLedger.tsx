import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Blade } from './Blade';
import { BLADE_CONFIG, TAB_HEIGHT } from '../config';
import { useAppState } from '../context/AppStateContext';
import { useMonthPagination } from '../hooks/useMonthPagination';

export const MonthLedger: React.FC = () => {
  const {
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
    activeMonthKey,
    activeData,
    activeGoals,
    theme,
    tStyle,
    isLight,
    openEditEntry,
    handleRemoveEntry,
    openEditGoal
  } = useAppState();
  const [activeIndex, setActiveIndex] = useState(0);
  const { swipeDirection, swipeVariants, handleDragEnd } = useMonthPagination(currentMonth, currentYear, setCurrentMonth, setCurrentYear, () => setActiveIndex(0));

  return (
    <motion.div key={activeMonthKey} custom={swipeDirection} variants={swipeVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1} onDragEnd={handleDragEnd} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'pan-y' }}>
      {BLADE_CONFIG.map((config, i) => {
        const isActive = i === activeIndex;
        const topPos = i < activeIndex ? i * TAB_HEIGHT : i === activeIndex ? i * TAB_HEIGHT : `calc(100% - ${(BLADE_CONFIG.length - i) * TAB_HEIGHT}px)`;
        const bHeight = i === activeIndex ? `calc(100% - ${(BLADE_CONFIG.length - 1) * TAB_HEIGHT}px)` : TAB_HEIGHT;
        return (
          <Blade key={config.id} config={config} index={i} isActive={isActive} topPosition={topPos} bladeHeight={bHeight} onToggle={() => setActiveIndex(isActive && i !== 0 ? 0 : i)} data={activeData} goals={activeGoals} theme={theme} tStyle={tStyle} isLight={isLight} openEditEntry={openEditEntry} handleRemoveEntry={handleRemoveEntry} openEditGoal={openEditGoal} />
        );
      })}
    </motion.div>
  );
};