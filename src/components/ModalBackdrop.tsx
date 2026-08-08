import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

interface ModalBackdropProps {
  isOpen: boolean;
  isLight: boolean;
  tStyle: any;
  zIndex?: number;
  maxWidth?: string;
  panelStyle?: CSSProperties;
  children: ReactNode;
}

/** Shared frosted-glass overlay + panel shell used by every modal in the app. */
export const ModalBackdrop: React.FC<ModalBackdropProps> = ({
  isOpen,
  isLight,
  tStyle,
  zIndex = 100,
  maxWidth = '380px',
  panelStyle,
  children
}) => (
  <AnimatePresence>
    {isOpen && (
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
          zIndex,
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
            maxWidth,
            borderRadius: '20px',
            border: isLight ? `1px solid rgba(255,255,255,0.9)` : `1px solid rgba(255,255,255,0.15)`,
            boxShadow: isLight
              ? 'inset 0 1px 1px rgba(255,255,255,1), 0 20px 40px rgba(0,0,0,0.15)'
              : 'inset 0 1px 1px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            color: tStyle.colors.primary,
            ...panelStyle
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
