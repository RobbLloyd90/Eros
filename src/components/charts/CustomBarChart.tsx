import React from 'react';
import type { ThemeType, ChartDataPoint } from '../../types';
import { getLabelFontFamily } from '../../utils/themeUtils';

interface CustomBarChartProps {
  data: ChartDataPoint[];
  theme: ThemeType;
  tStyle: any;
}

export const CustomBarChart: React.FC<CustomBarChartProps> = ({ data, theme, tStyle }) => {
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

  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '12px',
        width: '100%',
        height: '150px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          flex: 1,
          borderBottom: `1px solid ${tStyle.colors.metricBg}`,
          paddingBottom: '4px'
        }}
      >
        {data.map((bar) => {
          const heightPct = maxVal === 0 ? 0 : (bar.value / maxVal) * 100;
          return (
            <div
              key={bar.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
                gap: '4px'
              }}
            >
              <span
                style={{
                  fontSize: '9px',
                  color: tStyle.colors.primary,
                  fontWeight: 'bold',
                  fontFamily: getLabelFontFamily(theme)
                }}
              >
                £{bar.value.toFixed(0)}
              </span>
              <div
                style={{
                  width: '100%',
                  backgroundColor: bar.color,
                  height: `${heightPct}%`,
                  borderRadius: '4px 4px 0 0',
                  minHeight: '2px',
                  opacity: 0.9
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {data.map((bar) => (
          <div
            key={`label-${bar.label}`}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '9px',
              color: tStyle.colors.secondary,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: getLabelFontFamily(theme)
            }}
          >
            {bar.label.substring(0, 5).toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};
