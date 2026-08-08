import React from 'react';
import { Pencil, X } from 'lucide-react';
import type { Entry, ThemeType } from '../types';
import { getLabelFontFamily, isNothingTheme } from '../utils/themeUtils';

interface EntryRowProps {
  bladeId: string;
  entry: Entry;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  onEdit: (bladeId: string, entry: Entry) => void;
  onRemove: (bladeId: string, id: string) => void;
}

export const EntryRow: React.FC<EntryRowProps> = ({ bladeId, entry, theme, tStyle, isLight, onEdit, onRemove }) => {
  const renderMetrics = () => {
    const boxStyle = {
      backgroundColor: tStyle.colors.metricBg,
      padding: '4px 6px',
      borderRadius: '6px',
      boxShadow: isLight ? 'none' : 'inset 0 1px 2px rgba(0,0,0,0.1)'
    };

    if (bladeId === 'savings') {
      const bal = entry.currentBalance || 0;
      const cont = entry.contribution || 0;
      const int = entry.interestEarned || 0;
      const total = bal + cont + int;
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <span style={boxStyle}>BAL: £{bal.toFixed(2)}</span>
          <span style={boxStyle}>CONT: £{cont.toFixed(2)}</span>
          <span style={boxStyle}>INT: £{int.toFixed(2)}</span>
          <span style={{ ...boxStyle, color: tStyle.colors.pos }}>TOT: £{total.toFixed(2)}</span>
          <span style={{ ...boxStyle, opacity: 0.7 }}>RATE: {entry.interestRate || 0}%</span>
        </div>
      );
    }

    if (bladeId === 'debt') {
      const bal = entry.currentBalance || 0;
      const min = entry.minimumPayment || 0;
      const act = entry.actualPayment || 0;
      const accrued = entry.interestAccrued || 0;
      const newBal = bal + accrued - act;
      const extra = act - min;
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <span style={boxStyle}>BAL: £{bal.toFixed(2)}</span>
          <span style={boxStyle}>MIN: £{min.toFixed(2)}</span>
          <span style={{ ...boxStyle, color: tStyle.colors.pos }}>ACT: £{act.toFixed(2)}</span>
          <span style={{ ...boxStyle, color: tStyle.colors.neg }}>ACC: £{accrued.toFixed(2)}</span>
          <span style={{ ...boxStyle, color: extra > 0 ? tStyle.colors.pos : tStyle.colors.secondary }}>
            EXTRA: £{extra.toFixed(2)}
          </span>
          <span style={{ ...boxStyle, color: tStyle.colors.neg }}>NEW: £{newBal.toFixed(2)}</span>
        </div>
      );
    }

    const exp = entry.expected || 0;
    const act = entry.actual || 0;
    const diff = exp - act;
    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        <span style={boxStyle}>EXP: £{exp.toFixed(2)}</span>
        <span style={boxStyle}>ACT: £{act.toFixed(2)}</span>
        <span style={{ ...boxStyle, color: diff < 0 ? tStyle.colors.neg : tStyle.colors.pos }}>
          DIFF: £{Math.abs(diff).toFixed(2)} {diff < 0 ? 'OVER' : 'UNDER'}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{ ...tStyle.row, padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px', color: tStyle.colors.primary }}>
          {entry.name}
        </div>

        {/* NEW: DYNAMIC CATEGORY BADGE INVERSION SUB-ROW */}
        {entry.category && (bladeId === 'inflows' || bladeId === 'outflows') && (
          <div
            style={{
              fontSize: '10px',
              color: bladeId === 'inflows' ? tStyle.colors.pos : tStyle.colors.neg,
              letterSpacing: '1px',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontFamily: getLabelFontFamily(theme)
            }}
          >
            {entry.category.toUpperCase()}
          </div>
        )}

        <div
          style={{
            fontSize: '10px',
            color: tStyle.colors.secondary,
            fontFamily: isNothingTheme(theme)
              ? "'DotGothic16', sans-serif"
              : theme === 'aero_g3'
                ? 'inherit'
                : "'Share Tech Mono', monospace",
            fontWeight: isLight ? 600 : 'normal'
          }}
        >
          {renderMetrics()}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginLeft: '12px' }}>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => onEdit(bladeId, entry)}
        >
          <Pencil size={15} color={tStyle.colors.secondary} />
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => onRemove(bladeId, entry.id)}>
          <X size={18} color={tStyle.colors.neg} />
        </button>
      </div>
    </div>
  );
};
