import React from 'react';
import { motion } from 'framer-motion';
import type { ThemeType, Entry, Goal, BladeData } from '../types';
import { TAB_HEIGHT } from '../config';
import { EntryRow } from './EntryRow';
import { GoalCard } from './GoalCard';

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
  openEditEntry: (bladeId: string, entry: Entry) => void;
  handleRemoveEntry: (bladeId: string, id: string) => void;
  openEditGoal: (goal: Goal) => void;
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
  openEditGoal
}) => {
  const bladeEntries = data[config.id] || [];

  const totalActual = bladeEntries.reduce((sum, e) => {
    if (config.id === 'savings') return sum + (e.currentBalance || 0) + (e.contribution || 0) + (e.interestEarned || 0);
    if (config.id === 'debt') {
      const accrued = ((e.currentBalance || 0) * ((e.interestRate || 0) / 100)) / 12;
      return sum + ((e.currentBalance || 0) + accrued - (e.actualPayment || 0));
    }
    return sum + (e.actual || 0);
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
              color: theme.includes('nothing') ? tStyle.colors.secondary : '#fff',
              textShadow: theme.includes('nothing') ? 'none' : '0 1px 3px rgba(0,0,0,0.6)',
              fontFamily: theme.includes('nothing')
                ? "'DotGothic16', sans-serif"
                : isLight
                  ? 'inherit'
                  : "'Share Tech Mono', monospace",
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
                        fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
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
                  data[config.id]?.map((e) => (
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
