import React from 'react';
import type { ThemeType, ChartDataPoint } from '../../types';

interface CustomPieChartProps {
  data: ChartDataPoint[];
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
}

export const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, theme, tStyle, isLight }) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tStyle.colors.secondary,
          fontSize: '11px'
        }}
      >
        NO DATA
      </div>
    );
  }

  let cumulativePercent = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px', width: '100%' }}>
      {/* SVG PIE CHART */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 32 32"
        style={{
          transform: 'rotate(-90deg)',
          borderRadius: '50%',
          filter: isLight ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
          flexShrink: 0
        }}
      >
        {data.map((slice) => {
          const pct = slice.percentage || 0;
          const dashArray = `${pct} ${100 - pct}`;
          const dashOffset = -cumulativePercent;
          cumulativePercent += pct;

          return (
            <circle
              key={slice.label}
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
        {/* Inner donut hole */}
        <circle r="8" cx="16" cy="16" fill={isLight ? 'rgba(255,255,255,0.8)' : tStyle.colors.modalBg} />
      </svg>

      {/* LEGEND */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}
      >
        {data.map((slice) => (
          <div
            key={slice.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: slice.color,
                  flexShrink: 0
                }}
              />
              <span
                style={{
                  color: tStyle.colors.secondary,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {slice.label.toUpperCase()}
              </span>
            </div>
            <span style={{ color: tStyle.colors.primary, fontWeight: 'bold', marginLeft: '8px' }}>
              {slice.percentage?.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
