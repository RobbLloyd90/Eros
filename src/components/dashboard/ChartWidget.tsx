import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, BarChart2, Layers, X } from 'lucide-react';
import type { ChartConfig, ThemeType } from '../../types';
import { CustomPieChart } from '../charts/CustomPieChart';
import { CustomBarChart } from '../charts/CustomBarChart';
import { CustomLineChart } from '../charts/CustomLineChart';
import { getLineChartData } from '../../utils/chartDataEngine';

interface ChartWidgetProps {
  chart: ChartConfig;
  isEditMode: boolean;
  pieBarData: any;
  lineData: any;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  containerStyle: any;
  onPointerDown: () => void;
  cancelPress: () => void;
  onEdit: (chart: ChartConfig) => void;
  onDelete: (id: string, title: string) => void;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ chart, isEditMode, pieBarData, lineData, theme, tStyle, isLight, containerStyle, onPointerDown, cancelPress, onEdit, onDelete }) => {
  return (
    <motion.div
      animate={isEditMode ? { rotate: [-0.5, 0.5, -0.5, 0.5, 0] } : { rotate: 0 }}
      transition={isEditMode ? { repeat: Infinity, duration: 0.3 } : {}}
      onPointerDown={onPointerDown} onPointerUp={cancelPress} onPointerLeave={cancelPress}
      onContextMenu={(e) => { e.preventDefault(); return false; }}
      onClick={(e) => { if (isEditMode) { e.stopPropagation(); onEdit(chart); } }}
      style={{ ...containerStyle, cursor: isEditMode ? 'pointer' : 'default', position: 'relative', userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {isEditMode && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(chart.id, chart.title); }} style={{ position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: tStyle.colors.neg, color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
          <X size={16} strokeWidth={3} />
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
        {chart.type === 'pie' ? <PieChart size={16} color={tStyle.colors.secondary} /> : chart.type === 'bar' ? <BarChart2 size={16} color={tStyle.colors.secondary} /> : <Layers size={16} color={tStyle.colors.secondary} />}
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: tStyle.colors.primary, fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>
          {chart.title.toUpperCase()}
        </span>
      </div>

      {chart.type === 'pie' && <CustomPieChart data={pieBarData} theme={theme} tStyle={tStyle} isLight={isLight} />}
      {chart.type === 'bar' && <CustomBarChart data={pieBarData} theme={theme} tStyle={tStyle} />}
      {chart.type === 'line' && <CustomLineChart data={getLineChartData(chart, ledger, theme, tStyle, isLight)} theme={theme} tStyle={tStyle} isLight={isLight} />}
    </motion.div>
  );
};