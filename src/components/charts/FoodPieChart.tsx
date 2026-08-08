import React from 'react';
import type { ThemeType, FoodEntry } from '../../types';
import { getLabelFontFamily } from '../../utils/themeUtils';

interface FoodPieChartProps {
  foodEntries: FoodEntry[];
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
}

export const FoodPieChart: React.FC<FoodPieChartProps> = ({ foodEntries, theme, tStyle, isLight }) => {
  if (!foodEntries || foodEntries.length === 0) {
    return (
      <div
        style={{
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tStyle.colors.secondary,
          fontSize: '11px',
          fontFamily: getLabelFontFamily(theme)
        }}
      >
        NO DATA TO VISUALIZE
      </div>
    );
  }

  // 1. Calculate totals per category
  const totalSpend = foodEntries.reduce((sum, item) => sum + item.price, 0);
  const categoryTotals: Record<string, number> = {};

  foodEntries.forEach((entry) => {
    const cat = entry.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + entry.price;
  });

  // 2. Convert to percentages and assign colors
  // A set of vibrant/pastel colors that work well on both dark and light modes
  const chartColors = ['#10b981', '#0ea5e9', '#a855f7', '#f43f5e', '#f97316', '#eab308', '#8b5cf6'];

  const chartData = Object.keys(categoryTotals)
    .map((cat, index) => {
      const amount = categoryTotals[cat];
      const percentage = (amount / totalSpend) * 100;
      return {
        category: cat,
        amount,
        percentage,
        color:
          theme === 'nothing_glow' && index === 0
            ? '#CEFF00'
            : theme === 'nothing_os'
              ? index % 2 === 0
                ? '#fff'
                : '#555'
              : chartColors[index % chartColors.length]
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // 3. SVG Pie Chart Math (Using stroke-dasharray trick)
  let cumulativePercent = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px' }}>
      {/* THE PIE CHART (SVG) */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 32 32"
        style={{
          transform: 'rotate(-90deg)',
          borderRadius: '50%',
          filter: isLight ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
        }}
      >
        {chartData.map((slice, index) => {
          // Circumference of a circle with r=15.91549430918954 is exactly 100.
          const dashArray = `${slice.percentage} ${100 - slice.percentage}`;
          const dashOffset = -cumulativePercent;
          cumulativePercent += slice.percentage;

          return (
            <circle
              key={slice.category}
              r="15.91549430918954"
              cx="16"
              cy="16"
              fill="transparent"
              stroke={slice.color}
              strokeWidth="32"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
            />
          );
        })}
        {/* Inner cutout to make it a donut chart (optional, but looks cleaner) */}
        <circle r="8" cx="16" cy="16" fill={isLight ? 'rgba(255,255,255,0.8)' : tStyle.colors.modalBg} />
      </svg>

      {/* THE LEGEND */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}
      >
        {chartData.map((slice) => (
          <div
            key={slice.category}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              fontFamily: getLabelFontFamily(theme)
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: slice.color }} />
              <span style={{ color: tStyle.colors.secondary, fontWeight: 600 }}>{slice.category.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: tStyle.colors.primary, fontWeight: 'bold' }}>{slice.percentage.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
