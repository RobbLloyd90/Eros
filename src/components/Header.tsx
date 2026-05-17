import React from 'react';
import { Settings, Plus, ChevronLeft, Home, ChevronUp, LucideChevronUpCircle, LucideAArrowUp } from 'lucide-react';
import type { ThemeType } from '../types';

interface HeaderProps {
  theme: ThemeType;
  isLight: boolean;
  tStyle: any;
  currentView: 'dashboard' | 'year' | 'month' | 'food' | 'settings';
  currentYear: number;
  currentMonth: number;
  onBackToDashboard: () => void;
  onBackToYear: () => void;
  onNavigateToSettings: () => void;
  openAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  isLight,
  tStyle,
  currentView,
  currentYear,
  currentMonth,
  onBackToDashboard,
  onBackToYear,
  onNavigateToSettings,
  openAddModal
}) => {
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  let displayTitle = 'Eros Budget Tracking';
  if (currentView === 'year') displayTitle = `CALENDAR YEAR [${currentYear}]`;
  if (currentView === 'month') displayTitle = `MONTH [${monthNames[currentMonth - 1]} ${currentYear}]`;
  if (currentView === 'food') displayTitle = `FOOD BUDGET [${monthNames[currentMonth - 1]} ${currentYear}]`;
  if (currentView === 'settings') displayTitle = 'SYSTEM SETTINGS';

  return (
    <div style={{ padding: '24px 16px 16px 16px', flexShrink: 0, ...tStyle.header }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        {/* Navigation & Telemetry Layout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentView !== 'dashboard' && (
            <button
              onClick={onBackToDashboard}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
            >
              <Home size={36} color={tStyle.colors.primary} />
            </button>
          )}
          {currentView === 'month' && (
            <button
              onClick={onBackToYear}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
            >
              <LucideChevronUpCircle size={36} color={tStyle.colors.primary} />
            </button>
          )}
          <span
            style={{
              color: tStyle.colors.secondary,
              letterSpacing: '2px',
              fontWeight: 'bold',
              fontSize: '11px',
              fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
            }}
          >
            {displayTitle}
          </span>
        </div>

        {/* Actions Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {currentView !== 'settings' && (
            <button
              onClick={onNavigateToSettings}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
            >
              <Settings size={18} color={tStyle.colors.secondary} />
            </button>
          )}

          {(currentView === 'month' || currentView === 'food') && (
            <button
              style={{
                background: isLight
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)'
                  : tStyle.colors.metricBg,
                border: isLight ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(128,128,128,0.2)',
                boxShadow: isLight
                  ? 'inset 0 1px 1px rgba(255,255,255,1), 0 2px 4px rgba(0,0,0,0.05)'
                  : 'inset 0 1px 1px rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tStyle.colors.primary,
                cursor: 'pointer'
              }}
              onClick={openAddModal}
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Structural Telemetry */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div
            style={{
              fontSize: '9px',
              color: tStyle.colors.secondary,
              letterSpacing: '1px',
              marginBottom: '4px',
              fontWeight: isLight ? 700 : 'normal',
              fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
            }}
          >
            OPERATIONAL MARGIN
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              ...tStyle.value,
              color: isLight ? tStyle.colors.neg : tStyle.value.color
            }}
          >
            -£109.10
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '9px',
              color: tStyle.colors.secondary,
              letterSpacing: '1px',
              marginBottom: '4px',
              fontWeight: isLight ? 700 : 'normal',
              fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
            }}
          >
            LIQUID POOL
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              ...tStyle.value,
              color: isLight ? tStyle.colors.neg : tStyle.value.color
            }}
          >
            -£59.57
          </div>
        </div>
      </div>
    </div>
  );
};
