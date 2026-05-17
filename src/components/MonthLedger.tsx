import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Blade } from './Blade';
import { BLADE_CONFIG, TAB_HEIGHT } from '../config';
import type { ThemeType, Entry, Goal } from '../types';

interface MonthLedgerProps {
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (m: number) => void;
  setCurrentYear: (y: number) => void;
  activeMonthKey: string;
  activeData: any;
  activeGoals: Goal[];
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  openEditEntry: (bladeId: string, entry: Entry) => void;
  handleRemoveEntry: (bladeId: string, id: string) => void;
  openEditGoal: (goal: Goal) => void;
}

export const MonthLedger: React.FC<MonthLedgerProps> = ({ currentMonth, currentYear, setCurrentMonth, setCurrentYear, activeMonthKey, activeData, activeGoals, theme, tStyle, isLight, openEditEntry, handleRemoveEntry, openEditGoal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(0);

  const paginateMonth = (newDirection: number) => {
    setSwipeDirection(newDirection);
    let nextMonth = currentMonth + newDirection; let nextYear = currentYear;
    if (nextMonth > 12) { nextMonth = 1; nextYear += 1; } else if (nextMonth < 1) { nextMonth = 12; nextYear -= 1; }
    setCurrentMonth(nextMonth); setCurrentYear(nextYear); setActiveIndex(0);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;
  const swipeVariants = { enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }), center: { zIndex: 1, x: 0, opacity: 1 }, exit: (d: number) => ({ zIndex: 0, x: d < 0 ? 300 : -300, opacity: 0 }) };

  return (
    <motion.div key={activeMonthKey} custom={swipeDirection} variants={swipeVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1} onDragEnd={(e, { offset, velocity }) => { const swipe = swipePower(offset.x, velocity.x); if (swipe < -swipeConfidenceThreshold) paginateMonth(1); else if (swipe > swipeConfidenceThreshold) paginateMonth(-1); }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'pan-y' }}>
      {BLADE_CONFIG.map((config, i) => {
        const isActive = i === activeIndex;
        let topPos = i < activeIndex ? i * TAB_HEIGHT : i === activeIndex ? i * TAB_HEIGHT : `calc(100% - ${(BLADE_CONFIG.length - i) * TAB_HEIGHT}px)`;
        let bHeight = i === activeIndex ? `calc(100% - ${(BLADE_CONFIG.length - 1) * TAB_HEIGHT}px)` : TAB_HEIGHT;
        return (
          <Blade key={config.id} config={config} index={i} isActive={isActive} topPosition={topPos} bladeHeight={bHeight} onToggle={() => setActiveIndex(isActive && i !== 0 ? 0 : i)} data={activeData} goals={activeGoals} theme={theme} tStyle={tStyle} isLight={isLight} openEditEntry={openEditEntry} handleRemoveEntry={handleRemoveEntry} openEditGoal={openEditGoal} />
        );
      })}
    </motion.div>
  );
};