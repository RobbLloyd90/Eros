import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart, BarChart2, Layers } from 'lucide-react';
import type { ChartConfig, GlobalLedger, ThemeType } from '../../types';
import { getLabelFontFamily } from '../../utils/themeUtils';
import { CustomPieChart } from '../charts/CustomPieChart';
import { CustomBarChart } from '../charts/CustomBarChart';
import { CustomLineChart } from '../charts/CustomLineChart';
import { getLineChartData } from '../../utils/chartDataEngine';

const LONG_PRESS_MS = 2000;

interface ChartWidgetProps {
  chart: ChartConfig;
  pieBarData: any;
  ledger: GlobalLedger;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  containerStyle: any;
  onEdit: (chart: ChartConfig) => void;
  onDelete: (id: string, title: string) => void;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ chart, pieBarData, ledger, theme, tStyle, isLight, containerStyle, onEdit, onDelete }) => {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const handlePointerDown = () => {
    longPressTriggered.current = false;
    pressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      if (navigator.vibrate) navigator.vibrate(50);
      onDelete(chart.id, chart.title);
    }, LONG_PRESS_MS);
  };

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleClick = () => {
    if (longPressTriggered.current) return;
    onEdit(chart);
  };

  return (
    <motion.div
      onPointerDown={handlePointerDown} onPointerUp={cancelPress} onPointerLeave={cancelPress}
      onContextMenu={(e) => { e.preventDefault(); return false; }}
      onClick={handleClick}
      style={{ ...containerStyle, cursor: 'pointer', position: 'relative', userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
        {chart.type === 'pie' ? <PieChart size={16} color={tStyle.colors.secondary} /> : chart.type === 'bar' ? <BarChart2 size={16} color={tStyle.colors.secondary} /> : <Layers size={16} color={tStyle.colors.secondary} />}
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: tStyle.colors.primary, fontFamily: getLabelFontFamily(theme) }}>
          {chart.title.toUpperCase()}
        </span>
      </div>

      {chart.type === 'pie' && <CustomPieChart data={pieBarData} theme={theme} tStyle={tStyle} isLight={isLight} />}
      {chart.type === 'bar' && <CustomBarChart data={pieBarData} theme={theme} tStyle={tStyle} />}
      {chart.type === 'line' && <CustomLineChart data={getLineChartData(chart, ledger, theme, tStyle, isLight)} theme={theme} tStyle={tStyle} isLight={isLight} />}
    </motion.div>
  );
};