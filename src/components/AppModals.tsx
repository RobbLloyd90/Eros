import React from 'react';
import { EntryModal } from './EntryModal';
import { FoodModal } from './FoodModal';
import { AddChartModal } from './AddChartModal';
import { DeleteChartModal } from './DeleteChartModal';
import { DeleteGoalModal } from './DeleteGoalModal';

interface AppModalsProps {
  modal: any; setModal: any; foodModal: any; setFoodModal: any; chartModal: any; setChartModal: any; deleteChartModal: any; setDeleteChartModal: any;
  deleteGoalModal: any; setDeleteGoalModal: any;
  theme: any; tStyle: any; isLight: boolean; activeData: any;
  handleModalSave: () => void; handleFoodSave: () => void; handleChartSave: () => void; handleConfirmChartDelete: () => void;
  handleRemoveGoalFromHere: () => void; handleRemoveGoalEverywhere: () => void;
  activeGoals: any[];
}

export const AppModals: React.FC<AppModalsProps> = ({ modal, setModal, foodModal, setFoodModal, chartModal, setChartModal, deleteChartModal, setDeleteChartModal, deleteGoalModal, setDeleteGoalModal, theme, tStyle, isLight, activeData, handleModalSave, handleFoodSave, handleChartSave, handleConfirmChartDelete, handleRemoveGoalFromHere, handleRemoveGoalEverywhere, activeGoals }) => (
  <>
    <EntryModal modal={modal} setModal={setModal} theme={theme} tStyle={tStyle} isLight={isLight} savingsData={activeData.savings || []} handleModalSave={handleModalSave} />
    <FoodModal modal={foodModal} setModal={setFoodModal} theme={theme} tStyle={tStyle} isLight={isLight} handleSave={handleFoodSave} />
    <AddChartModal modal={chartModal} setModal={setChartModal} theme={theme} tStyle={tStyle} isLight={isLight} handleSave={handleChartSave} goals={activeGoals} />
    <DeleteChartModal modal={deleteChartModal} setModal={setDeleteChartModal} theme={theme} tStyle={tStyle} isLight={isLight} handleConfirm={handleConfirmChartDelete} />
    <DeleteGoalModal modal={deleteGoalModal} setModal={setDeleteGoalModal} theme={theme} tStyle={tStyle} isLight={isLight} onRemoveFromHere={handleRemoveGoalFromHere} onRemoveEverywhere={handleRemoveGoalEverywhere} />
  </>
);