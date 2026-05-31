import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ShoppingCart, Plus, Layers, Eye, EyeOff } from 'lucide-react';
import type { ThemeType, GlobalLedger, ChartConfig, PrivacyMode } from '../types';
import { MONTH_NAMES } from '../config';
import { getChartData } from '../utils/chartDataEngine';
import { ChartWidget } from './dashboard/ChartWidget';

interface DashboardProps {
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  ledger: GlobalLedger;
  currentYear: number;
  currentMonth: number;
  userCharts: ChartConfig[];
  savingsPrivacy: PrivacyMode;
  creditPrivacy: PrivacyMode;
  onNavigateToCurrentMonth: () => void;
  onNavigateToFood: () => void;
  onNavigateToYear: () => void;
  onAddChart: () => void;
  onEditChart: (chart: ChartConfig) => void;
  onDeleteChart: (id: string, title: string) => void;
}

// --- NEW: Internal component to handle the blurring and hold-to-reveal interaction ---
const PrivacyRow = ({ label, value, mode, tStyle, theme }: { label: string, value: number, mode: PrivacyMode, tStyle: any, theme: string }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (mode === 'off') return null;

  const isBlurred = mode === 'blurred' && !isRevealed;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
      <span style={{ fontSize: '11px', color: tStyle.colors.secondary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>
        {label}:
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 'bold', 
          color: tStyle.colors.primary, 
          fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit',
          filter: isBlurred ? 'blur(4px)' : 'none',
          transition: 'filter 0.2s ease',
          userSelect: 'none' // Prevents text highlighting when holding the button
        }}>
          £{value.toFixed(2)}
        </span>
        {mode === 'blurred' && (
          <button
            onPointerDown={() => setIsRevealed(true)}
            onPointerUp={() => setIsRevealed(false)}
            onPointerLeave={() => setIsRevealed(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: tStyle.colors.secondary }}
          >
            {isRevealed ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({
  theme, tStyle, isLight, ledger, currentYear, currentMonth, userCharts, savingsPrivacy, creditPrivacy,
  onNavigateToCurrentMonth, onNavigateToFood, onNavigateToYear, onAddChart, onEditChart, onDeleteChart
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  
  const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const activeMonthData = ledger[currentMonthKey];

  const handlePointerDown = () => {
    pressTimer.current = setTimeout(() => { setIsEditMode(true); if (navigator.vibrate) navigator.vibrate(50); }, 2000);
  };
  const cancelPress = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  let foodTotal = 0;
  let inflowTotal = 0;
  let outflowTotal = 0;
  let savingsTotal = 0;
  let debtTotal = 0;

  if (activeMonthData) {
    foodTotal = (activeMonthData.food || []).reduce((sum, f) => sum + f.price, 0);
    inflowTotal = (activeMonthData.data.inflows || []).reduce((sum, e) => sum + (e.actual || 0), 0);
    outflowTotal = (activeMonthData.data.outflows || []).reduce((sum, e) => sum + (e.actual || 0), 0);
    savingsTotal = (activeMonthData.data.savings || []).reduce((sum, s) => sum + (s.contribution || 0), 0);
    debtTotal = (activeMonthData.data.debt || []).reduce((sum, d) => sum + (d.actualPayment || 0), 0);
  }

  const containerStyle = {
    ...tStyle.bladeContainer({ color: tStyle.colors.pos }),
    display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', padding: '16px',
    backgroundColor: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} onClick={() => { if (isEditMode) setIsEditMode(false); }} style={{ padding: '0 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      
      <div style={{ fontSize: '11px', color: tStyle.colors.secondary, letterSpacing: '2px', fontWeight: 'bold', marginTop: '8px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>
        QUICK ACCESS
      </div>

      <motion.div whileTap={{ scale: 0.98 }} onClick={onNavigateToYear} style={{ ...tStyle.row, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%', backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Layers size={14} color={tStyle.colors.primary} /><span style={{ fontSize: '11px', fontWeight: 'bold', color: tStyle.colors.primary, letterSpacing: '1.5px', fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>View All Months</span></div>
        <span style={{ fontSize: '9px', color: tStyle.colors.secondary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : (isLight ? 'inherit' : "'Share Tech Mono', monospace"), fontWeight: 'bold' }}>VIEW YEAR [{currentYear}] →</span>
      </motion.div>

      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
       <div style={{ ...containerStyle, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Calendar size={24} color={tStyle.colors.pos} style={{ opacity: 0.8 }} />
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: tStyle.colors.primary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>
              {MONTH_NAMES[currentMonth - 1].slice(0,3)} '{String(currentYear).slice(-2)}
            </div>
          </div>
          
          <div style={{ marginTop: '12px', borderTop: isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
            {/* The standard metrics */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: tStyle.colors.secondary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>Incoming:</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: tStyle.colors.primary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>£{inflowTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: tStyle.colors.secondary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>Outgoings:</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: tStyle.colors.primary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>£{outflowTotal.toFixed(2)}</span>
            </div>
            
            {/* The Private Metrics */}
            <PrivacyRow label="Savings" value={savingsTotal} mode={savingsPrivacy} tStyle={tStyle} theme={theme} />
            <PrivacyRow label="Credit" value={debtTotal} mode={creditPrivacy} tStyle={tStyle} theme={theme} />
          </div>
          
          {/* UPDATED: Moved the click event and animations specifically to this button */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateToCurrentMonth}
            style={{ 
              fontSize: '10px', 
              color: tStyle.colors.secondary, 
              fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : (isLight ? 'inherit' : "'Share Tech Mono', monospace"), 
              marginTop: '12px', 
              backgroundColor: tStyle.colors.metricBg, 
              border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
              padding: '6px 6px', 
              borderRadius: '4px', 
              display: 'flex', 
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            VIEW LEDGER →
          </motion.div>
        </div>
        
        <motion.div whileTap={{ scale: 0.96 }} onClick={onNavigateToFood} style={{ ...containerStyle, flex: 1, cursor: 'pointer', ...tStyle.bladeContainer({ color: tStyle.colors.neg }) }}>
          <ShoppingCart size={24} color={tStyle.colors.neg} style={{ opacity: 0.8 }} />
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '10px', color: tStyle.colors.secondary, letterSpacing: '2px', fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>FOOD BUDGET</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: tStyle.colors.primary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>£{foodTotal.toFixed(2)}</div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
        <div style={{ fontSize: '11px', color: tStyle.colors.secondary, letterSpacing: '2px', fontWeight: 'bold', fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>ANALYTICS VISUALIZATION</div>
        {isEditMode ? <button onClick={() => setIsEditMode(false)} style={{ background: tStyle.colors.metricBg, border: `1px solid ${tStyle.colors.pos}`, padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', color: tStyle.colors.pos, fontSize: '9px', fontWeight: 'bold', fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>DONE EDITING</button> : <button onClick={onAddChart} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: tStyle.colors.pos, fontSize: '9px', fontWeight: 'bold', fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}><Plus size={12} strokeWidth={3} /> ADD CHART</button>}
      </div>

      {userCharts.length === 0 ? (
        <div style={{ color: tStyle.colors.secondary, textAlign: 'center', marginTop: '10px', fontSize: '11px', fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>NO CHARTS CONFIGURED.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
          {userCharts.map((chart) => (
            <ChartWidget key={chart.id} chart={chart} isEditMode={isEditMode} theme={theme} tStyle={tStyle} isLight={isLight} containerStyle={containerStyle} onPointerDown={handlePointerDown} cancelPress={cancelPress} onEdit={onEditChart} onDelete={onDeleteChart} pieBarData={getChartData(chart.source, activeMonthData, theme)} lineData={null} />
          ))}
        </div>
      )}
    </motion.div>
  );
};