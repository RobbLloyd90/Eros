import React from 'react';
import type { ThemeType, DeleteGoalModalState } from '../types';
import { ModalBackdrop } from './ModalBackdrop';
import { getLabelFontFamily } from '../utils/themeUtils';

interface DeleteGoalModalProps {
  modal: DeleteGoalModalState;
  setModal: React.Dispatch<React.SetStateAction<DeleteGoalModalState>>;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  onRemoveFromHere: () => void;
  onRemoveEverywhere: () => void;
}

export const DeleteGoalModal: React.FC<DeleteGoalModalProps> = ({
  modal,
  setModal,
  theme,
  tStyle,
  isLight,
  onRemoveFromHere,
  onRemoveEverywhere
}) => {
  const close = () => setModal({ isOpen: false, goalId: '', goalName: '' });

  return (
    <ModalBackdrop
      isOpen={modal.isOpen}
      isLight={isLight}
      tStyle={tStyle}
      zIndex={200}
      maxWidth="340px"
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
        REMOVE GOAL?
      </h3>

      <p
        style={{
          fontSize: '12px',
          color: tStyle.colors.secondary,
          margin: '0 0 20px 0',
          lineHeight: '1.5',
          fontFamily: getLabelFontFamily(theme)
        }}
      >
        How would you like to remove <strong>"{modal.goalName.toUpperCase()}"</strong>?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          type="button"
          onClick={() => { onRemoveFromHere(); close(); }}
          style={{
            backgroundColor: tStyle.colors.metricBg,
            color: tStyle.colors.primary,
            border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: getLabelFontFamily(theme)
          }}
        >
          STOP FROM THIS MONTH ONWARD
          <div style={{ fontSize: '9px', fontWeight: 'normal', opacity: 0.7, marginTop: '4px' }}>
            Keeps it in past months; won't appear from here forward.
          </div>
        </button>

        <button
          type="button"
          onClick={() => { onRemoveEverywhere(); close(); }}
          style={{
            backgroundColor: tStyle.colors.neg,
            color: '#fff',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)',
            fontFamily: getLabelFontFamily(theme)
          }}
        >
          DELETE PERMANENTLY
          <div style={{ fontSize: '9px', fontWeight: 'normal', opacity: 0.85, marginTop: '4px' }}>
            Removes this goal from every month, past and future.
          </div>
        </button>

        <button
          type="button"
          onClick={close}
          style={{
            background: 'none',
            border: 'none',
            color: tStyle.colors.secondary,
            padding: '8px',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: getLabelFontFamily(theme)
          }}
        >
          CANCEL
        </button>
      </div>
    </ModalBackdrop>
  );
};
