import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ThemeType } from '../types';

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
    <AnimatePresence>
      {modal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <motion.div
            initial={{ y: 30, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.98 }}
            style={{
              background: tStyle.colors.modalBg,
              backdropFilter: 'blur(24px)',
              width: '100%',
              maxWidth: '320px',
              borderRadius: '20px',
              border: isLight ? `1px solid rgba(255,255,255,0.9)` : `1px solid rgba(255,255,255,0.15)`,
              boxShadow: isLight
                ? 'inset 0 1px 1px rgba(255,255,255,1), 0 20px 40px rgba(0,0,0,0.15)'
                : 'inset 0 1px 1px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              color: tStyle.colors.primary,
              padding: '24px',
              textAlign: 'center'
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0 0 12px 0',
                fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
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
                fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
              }}
            >
              Are you sure you want to remove <strong>"{modal.chartTitle.toUpperCase()}"</strong> from your dashboard?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              {/* BACK BUTTON: Normal frosted styling */}
              <button
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
                  fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
                }}
              >
                BACK
              </button>

              {/* REMOVE BUTTON: Solid non-transparent styling */}
              <button
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
                  fontFamily: theme.includes('nothing') ? "'DotGothic16', sans-serif" : 'inherit'
                }}
              >
                REMOVE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
