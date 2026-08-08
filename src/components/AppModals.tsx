import React from 'react';
import { EntryModal } from './EntryModal';
import { FoodModal } from './FoodModal';
import { AddChartModal } from './AddChartModal';
import { DeleteChartModal } from './DeleteChartModal';

interface AppModalsProps {
  modal: any; setModal: any; foodModal: any; setFoodModal: any; chartModal: any; setChartModal: any; deleteChartModal: any; setDeleteChartModal: any;
  theme: any; tStyle: any; isLight: boolean; activeData: any;
  handleModalSave: () => void; handleFoodSave: () => void; handleChartSave: () => void; handleConfirmChartDelete: () => void;
  activeGoals: any[];
}

export const AppModals: React.FC<AppModalsProps> = ({ modal, setModal, foodModal, setFoodModal, chartModal, setChartModal, deleteChartModal, setDeleteChartModal, theme, tStyle, isLight, activeData, handleModalSave, handleFoodSave, handleChartSave, handleConfirmChartDelete, activeGoals }) => (
  <>
    <EntryModal modal={modal} setModal={setModal} theme={theme} tStyle={tStyle} isLight={isLight} savingsData={activeData.savings || []} handleModalSave={handleModalSave} />
    <FoodModal modal={foodModal} setModal={setFoodModal} theme={theme} tStyle={tStyle} isLight={isLight} handleSave={handleFoodSave} />
    <AddChartModal modal={chartModal} setModal={setChartModal} theme={theme} tStyle={tStyle} isLight={isLight} handleSave={handleChartSave} goals={activeGoals} />
    <DeleteChartModal modal={deleteChartModal} setModal={setDeleteChartModal} theme={theme} tStyle={tStyle} isLight={isLight} handleConfirm={handleConfirmChartDelete} />
  </>
);