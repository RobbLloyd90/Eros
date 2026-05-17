import React from 'react';
import type { ThemeType, LineChartData } from '../../types';

interface CustomLineChartProps {
  data: LineChartData | null;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
}

export const CustomLineChart: React.FC<CustomLineChartProps> = ({ data, theme, tStyle, isLight }) => {
  // CRITICAL SAFETY: If labels are empty OR datasets are completely empty, abort render gracefully
  if (!data || data.labels.length === 0 || data.datasets.length === 0) {
    return <div style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center", color: tStyle.colors.secondary, fontSize: "11px", fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>INSUFFICIENT HISTORICAL DATA</div>;
  }

  const allValues = data.datasets.flatMap(ds => ds.data);
  
  // CRITICAL SAFETY: If there are literally no values inside the datasets, abort to prevent NaN crashes
  if (allValues.length === 0) {
    return <div style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center", color: tStyle.colors.secondary, fontSize: "11px", fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>NO DATA AVAILABLE</div>;
  }

  // Safely determine target value, falling back to 0 if undefined
  const validTarget = typeof data.targetValue === 'number' && !isNaN(data.targetValue) ? data.targetValue : 0;

  // Find min and max values to scale Y-Axis dynamically
  const maxVal = Math.max(...allValues, validTarget, 0);
  const minVal = Math.min(...allValues, 0); 
  const range = (maxVal - minVal) || 1; // Prevent division by zero

  const chartHeight = 100;
  const chartWidth = 280;

  const getY = (val: number) => chartHeight - (((val - minVal) / range) * chartHeight);
  const getX = (index: number) => (index / (Math.max(data.labels.length - 1, 1))) * chartWidth;

  const zeroY = getY(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px", width: "100%" }}>
      
      <div style={{ width: "100%", height: "120px", position: "relative" }}>
        <svg viewBox={`0 -10 ${chartWidth} ${chartHeight + 20}`} style={{ width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none">
          
          {minVal < 0 && (
            <line x1="0" y1={zeroY} x2={chartWidth} y2={zeroY} stroke={tStyle.colors.secondary} strokeWidth="1" strokeDasharray="4 4" opacity={0.5} />
          )}

          {/* Target Dotted Line */}
          {data.targetValue !== undefined && data.targetValue > 0 && (
            <g>
              <line x1="0" y1={getY(data.targetValue)} x2={chartWidth} y2={getY(data.targetValue)} stroke={tStyle.colors.pos} strokeWidth="1.5" strokeDasharray="4 4" opacity={0.8} />
              <text x={chartWidth - 2} y={getY(data.targetValue) - 4} fontSize="8" fill={tStyle.colors.pos} textAnchor="end" fontWeight="bold" fontFamily={theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'}>
                TARGET: £{data.targetValue.toFixed(2)}
              </text>
            </g>
          )}

          {/* Lines */}
          {data.datasets.map((dataset, i) => {
            const points = dataset.data.map((val, index) => `${getX(index)},${getY(val)}`).join(' ');
            return (
              <g key={dataset.label}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={dataset.color}
                  strokeWidth={theme.includes('nothing') ? "2" : "3"}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ filter: isLight ? `drop-shadow(0 4px 4px ${dataset.color}33)` : `drop-shadow(0 4px 6px ${dataset.color}66)` }}
                />
                {dataset.data.map((val, index) => (
                  <circle key={index} cx={getX(index)} cy={getY(val)} r="3" fill={tStyle.colors.modalBg} stroke={dataset.color} strokeWidth="2" />
                ))}
              </g>
            );
          })}
        </svg>

        {/* X-Axis Labels */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "absolute", bottom: "-15px", left: 0, right: 0 }}>
          {data.labels.map((label, i) => (
            <span key={i} style={{ fontSize: "8px", color: tStyle.colors.secondary, fontWeight: "bold", fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* LEGEND */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "16px", justifyContent: "center" }}>
        {data.datasets.map((dataset) => (
          <div key={dataset.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "9px", color: tStyle.colors.secondary, fontWeight: "bold", fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit' }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: dataset.color }} />
            {dataset.label.toUpperCase()}
          </div>
        ))}
      </div>

    </div>
  );
};