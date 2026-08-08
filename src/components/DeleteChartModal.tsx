import React from 'react';
import type { ThemeType } from '../types';
import { ModalBackdrop } from './ModalBackdrop';
import { getLabelFontFamily } from '../utils/themeUtils';

interface DeleteChartModalProps {
  modal: { isOpen: boolean; chartId: string; chartTitle: string };
  setModal: React.Dispatch<React.SetStateAction<{ isOpen: boolean; chartId: string; chartTitle: string }>>;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  handleConfirm: () => void;
}

export const DeleteChartModal: React.FC<DeleteChartModalProps> = ({
  modal,
  setModal,
  theme,
  tStyle,
  isLight,
  handleConfirm
}) => {
  return (
    <ModalBackdrop
      isOpen={modal.isOpen}
      isLight={isLight}
      tStyle={tStyle}
      zIndex={200}
      maxWidth="320px"
      panelStyle={{ padding: '24px', textAlign: 'center' }}
    >
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '0 0 12px 0',
          fontFamily: getLabelFontFamily(theme)
        }}
      >
        DELETE CHART?
      </h3>

      <p
        style={{
          fontSize: '12px',
          color: tStyle.colors.secondary,
          margin: '0 0 24px 0',
          lineHeight: '1.5',
          fontFamily: getLabelFontFamily(theme)
        }}
      >
        Are you sure you want to remove <strong>"{modal.chartTitle.toUpperCase()}"</strong> from your dashboard?
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        {/* BACK BUTTON: Normal frosted styling */}
        <button
          type="button"
          onClick={() => setModal({ isOpen: false, chartId: '', chartTitle: '' })}
          style={{
            flex: 1,
            backgroundColor: tStyle.colors.metricBg,
            color: tStyle.colors.primary,
            border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: getLabelFontFamily(theme)
          }}
        >
          BACK
        </button>

        {/* REMOVE BUTTON: Solid non-transparent styling */}
        <button
          type="button"
          onClick={handleConfirm}
          style={{
            flex: 1,
            backgroundColor: tStyle.colors.neg,
            color: '#fff',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)',
            fontFamily: getLabelFontFamily(theme)
          }}
        >
          REMOVE
        </button>
      </div>
    </ModalBackdrop>
  );
};

