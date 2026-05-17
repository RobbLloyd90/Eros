import React from 'react';
import { Pencil, Calendar, Target, Check, TrendingUp } from 'lucide-react';
import type { Goal, Entry, ThemeType } from '../types';

interface GoalCardProps {
  goal: Goal;
  config: any;
  savingsData: Entry[];
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  onEdit: (goal: Goal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, config, savingsData, theme, tStyle, isLight, onEdit }) => {
  const currentlySaved = goal.linkedSavings.reduce((sum, sId) => {
    const s = savingsData.find((s) => s.id === sId);
    if (!s) return sum;
    return sum + (s.currentBalance || 0) + (s.contribution || 0) + (s.interestEarned || 0);
  }, 0);

  const amountLeft = Math.max(0, goal.targetAmount - currentlySaved);
  const percent = Math.min(100, (currentlySaved / goal.targetAmount) * 100) || 0;
  const activeColor = isLight ? config.color : theme === 'nothing_glow' ? tStyle.colors.pos : config.color;

  return (
    <div
      style={{
        ...tStyle.row,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderLeft: theme.includes('nothing') ? `2px dotted ${activeColor}` : `4px solid ${activeColor}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: tStyle.colors.primary }}>{goal.name}</div>
          <div
            style={{
              fontSize: '11px',
              color: tStyle.colors.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '4px',
              fontWeight: isLight ? 600 : 'normal',
              fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
            }}
          >
            <Calendar size={12} /> Target: {goal.targetDate}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => onEdit(goal)}>
            <Pencil size={16} color={tStyle.colors.secondary} />
          </button>
        </div>
      </div>
      <div
        style={{
          height: '6px',
          backgroundColor: tStyle.colors.metricBg,
          borderRadius: '3px',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '3px',
            backgroundColor: activeColor,
            width: `${percent}%`,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)'
          }}
        ></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
        <div
          style={{
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: tStyle.colors.secondary,
            fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : isLight ? 'inherit' : 'monospace',
            fontWeight: isLight ? 600 : 'normal'
          }}
        >
          <Target size={12} /> Target: £{goal.targetAmount}
        </div>
        <div
          style={{
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: tStyle.colors.secondary,
            fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : isLight ? 'inherit' : 'monospace',
            fontWeight: isLight ? 600 : 'normal'
          }}
        >
          <Check size={12} color={tStyle.colors.pos} /> Saved: {percent.toFixed(0)}%
        </div>
        <div
          style={{
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: tStyle.colors.secondary,
            fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : isLight ? 'inherit' : 'monospace',
            fontWeight: isLight ? 600 : 'normal'
          }}
        >
          <TrendingUp size={12} color={tStyle.colors.neg} /> Left: £{amountLeft.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
