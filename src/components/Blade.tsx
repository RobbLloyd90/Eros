import React from 'react';
import { motion } from 'framer-motion';
import type { ThemeType, Entry, SavingsEntry, DebtEntry, Goal, BladeData } from '../types';
import { TAB_HEIGHT } from '../config';
import { EntryRow } from './EntryRow';
import { GoalCard } from './GoalCard';
import { isNothingTheme, getMonoFontFamily, getLabelFontFamily } from '../utils/themeUtils';

interface BladeProps {
  config: any;
  index: number;
  isActive: boolean;
  topPosition: number | string;
  bladeHeight: number | string;
  onToggle: () => void;
  data: BladeData;
  goals: Goal[];
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  openEditEntry: (bladeId: 'inflows' | 'outflows' | 'savings' | 'debt' | 'goals', entry: Entry | SavingsEntry | DebtEntry) => void;
  handleRemoveEntry: (bladeId: 'inflows' | 'outflows' | 'savings' | 'debt', id: string) => void;
  openEditGoal: (goal: Goal) => void;
  openDeleteGoal: (goal: Goal) => void;
}

export const Blade: React.FC<BladeProps> = ({
  config,
  index,
  isActive,
  topPosition,
  bladeHeight,
  onToggle,
  data,
  goals,
  theme,
  tStyle,
  isLight,
  openEditEntry,
  handleRemoveEntry,
  openEditGoal,
  openDeleteGoal
}) => {
  const getBladeEntries = (bladeId: string): (Entry | SavingsEntry | DebtEntry)[] => {
    switch (bladeId) {
      case 'inflows': return data.inflows;
      case 'outflows': return data.outflows;
      case 'savings': return data.savings;
      case 'debt': return data.debt;
      default: return [];
    }
  };
  const bladeEntries = getBladeEntries(config.id);

  const totalActual = bladeEntries.reduce((sum, e) => {
    if (config.id === 'savings') {
      const s = e as SavingsEntry;
      return sum + (s.currentBalance || 0) + (s.contribution || 0) + (s.interestEarned || 0);
    }
    if (config.id === 'debt') {
      const d = e as DebtEntry;
      const accrued = ((d.currentBalance || 0) * ((d.interestRate || 0) / 100)) / 12;
      return sum + ((d.currentBalance || 0) + accrued - (d.actualPayment || 0));
    }
    return sum + ((e as Entry).actual || 0);
  }, 0);

  return (
    <motion.div
      initial={false}
      animate={{ top: topPosition, height: bladeHeight }}
      transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }}
      style={{
        position: 'absolute',
        left: '6px',
        right: '6px',
        overflow: 'hidden',
        ...tStyle.bladeContainer(config),
        zIndex: isActive ? 10 : index
      }}
    >
      <div
        style={{
          height: `${TAB_HEIGHT}px`,
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: isActive && index === 0 ? 'default' : 'pointer',
          ...tStyle.tabHandle(config)
        }}
        onClick={onToggle}
      >
        <span style={{ fontSize: '13px', letterSpacing: '1px', ...tStyle.tabTitle(config) }}>
          {config.title}{' '}
          {theme.includes('bondi') && (
            <span style={{ fontSize: '9px', opacity: 0.6, fontWeight: 'normal' }}>[{config.flavor}]</span>
          )}
        </span>
        {!isActive && (
          <span
            style={{
              fontSize: '14px',
              color: isNothingTheme(theme) ? tStyle.colors.secondary : '#fff',
              textShadow: isNothingTheme(theme) ? 'none' : '0 1px 3px rgba(0,0,0,0.6)',
              fontFamily: getMonoFontFamily(theme, isLight),
              fontWeight: 700
            }}
          >
          </span>
        )}
        £{totalActual.toFixed(2)}
      </div>

      <motion.div
        style={{
          height: `calc(100% - ${TAB_HEIGHT}px)`,
          overflowY: 'auto',
          padding: '0 16px 16px 16px',
          ...tStyle.bladeContent(config)
        }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isActive && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px' }}>
            {config.id !== 'goals' ? (
              <>
                {config.id === 'outflows' ? (
                  <>
                    {data.outflows
                      .filter((e) => e.tag !== 'fluid')
                      .map((e) => (
                        <EntryRow
                          key={e.id}
                          bladeId={config.id}
                          entry={e}
                          theme={theme}
                          tStyle={tStyle}
                          isLight={isLight}
                          onEdit={openEditEntry}
                          onRemove={handleRemoveEntry}
                        />
                      ))}
                    <div
                      style={{
                        fontSize: '10px',
                        color: isLight ? 'rgba(0,0,0,0.5)' : tStyle.colors.secondary,
                        letterSpacing: '2px',
                        fontWeight: 'bold',
                        marginTop: '12px',
                        borderBottom: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                        paddingBottom: '6px',
                        fontFamily: getLabelFontFamily(theme)
                      }}
                    >
                      FLUID OUTGOINGS
                    </div>
                    {data.outflows
                      .filter((e) => e.tag === 'fluid')
                      .map((e) => (
                        <EntryRow
                          key={e.id}
                          bladeId={config.id}
                          entry={e}
                          theme={theme}
                          tStyle={tStyle}
                          isLight={isLight}
                          onEdit={openEditEntry}
                          onRemove={handleRemoveEntry}
                        />
                      ))}
                  </>
                ) : (
                  getBladeEntries(config.id).map((e) => (
                    <EntryRow
                      key={e.id}
                      bladeId={config.id}
                      entry={e}
                      theme={theme}
                      tStyle={tStyle}
                      isLight={isLight}
                      onEdit={openEditEntry}
                      onRemove={handleRemoveEntry}
                    />
                  ))
                )}
              </>
            ) : (
              <>
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    config={config}
                    savingsData={data.savings}
                    theme={theme}
                    tStyle={tStyle}
                    isLight={isLight}
                    onEdit={openEditGoal}
                    onRemove={openDeleteGoal}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
