import { useState } from 'react';
import type { GlobalLedger, UserProfile, ModalState, FoodModalState, Goal, Entry, FoodEntry } from '../types';
import { 
  useCurrentUserEffect, 
  useTrackingEngineEffect, 
  useSaveLedgerEffect, 
  useRecurringInjectorEffect 
} from '../useEffects/useLedgerDataEffects';

export const useLedgerData = (currentUser: UserProfile | null) => {
  const [ledger, setLedger] = useState<GlobalLedger>({});
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);

  const activeMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  // Custom Named Effects
  useCurrentUserEffect(currentUser, setLedger, setCurrentYear, setCurrentMonth);
  useTrackingEngineEffect(ledger);
  useSaveLedgerEffect(ledger, currentUser);
  useRecurringInjectorEffect(currentUser, ledger, currentYear, currentMonth, activeMonthKey, setLedger);

  const rawMonthData = ledger[activeMonthKey]?.data || { inflows: [], outflows: [], savings: [], debt: [] };
  const activeGoals = ledger[activeMonthKey]?.goals || [];
  const activeFood = ledger[activeMonthKey]?.food || [];
  const totalFoodActual = activeFood.reduce((sum, f) => sum + f.price, 0);

  const processedOutflows = [...(rawMonthData.outflows || [])];
  const foodEntryIndex = processedOutflows.findIndex((e) => e.id === 'fluid-food');
  if (foodEntryIndex >= 0) {
    processedOutflows[foodEntryIndex] = { ...processedOutflows[foodEntryIndex], actual: totalFoodActual };
  } else if (activeFood.length > 0) {
    processedOutflows.push({ id: 'fluid-food', name: 'Food Budget', expected: 200, actual: totalFoodActual, tag: 'fluid', category: 'Food' });
  }
  const activeData = { ...rawMonthData, outflows: processedOutflows };

  const handleModalSave = (modal: ModalState) => {
    if (!modal.name) return;
    if (modal.isGoal || modal.bladeId === 'goals') {
      const goalToSave: Goal = { id: modal.mode === 'add' ? Date.now().toString() : modal.id!, name: modal.name, targetAmount: parseFloat(modal.targetAmount) || 0, targetDate: modal.targetDate || new Date().toISOString().slice(0, 7), linkedSavings: modal.linkedSavings };
      setLedger((prev) => {
        const monthData = prev[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
        return { ...prev, [activeMonthKey]: { ...monthData, goals: modal.mode === 'add' ? [...monthData.goals, goalToSave] : monthData.goals.map((g) => (g.id === modal.id ? goalToSave : g)) } };
      });
    } else {
      const entryToSave: Entry = {
        id: modal.mode === 'add' ? Date.now().toString() : modal.id!, name: modal.name, expected: parseFloat(modal.expected) || 0, actual: parseFloat(modal.actual) || 0,
        interestRate: parseFloat(modal.interestRate) || 0, contribution: parseFloat(modal.contribution) || 0, currentBalance: parseFloat(modal.currentBalance) || 0, interestEarned: parseFloat(modal.interestEarned) || 0, minimumPayment: parseFloat(modal.minimumPayment) || 0, actualPayment: parseFloat(modal.actualPayment) || 0, interestAccrued: parseFloat(modal.interestAccrued) || 0, category: modal.category || undefined, ...(modal.bladeId === 'outflows' && { tag: modal.tag })
      };
      setLedger((prev) => {
        const monthData = prev[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
        const updatedBlade = modal.mode === 'add' ? [...(monthData.data[modal.bladeId] || []), entryToSave] : (monthData.data[modal.bladeId] || []).map((e) => (e.id === modal.id ? entryToSave : e));
        return { ...prev, [activeMonthKey]: { ...monthData, data: { ...monthData.data, [modal.bladeId]: updatedBlade } } };
      });
    }
  };

  const handleFoodSave = (foodModal: FoodModalState) => {
    if (!foodModal.item || !foodModal.price) return;
    const entryToSave: FoodEntry = { id: foodModal.mode === 'add' ? Date.now().toString() : foodModal.id!, category: foodModal.category || 'General', store: foodModal.store, item: foodModal.item, method: foodModal.method, price: parseFloat(foodModal.price) || 0, date: foodModal.date };
    setLedger((prev) => {
      const monthData = prev[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
      return { ...prev, [activeMonthKey]: { ...monthData, food: foodModal.mode === 'add' ? [...(monthData.food || []), entryToSave] : (monthData.food || []).map((f) => (f.id === foodModal.id ? entryToSave : f)) } };
    });
  };

  const handleRemoveEntry = (bladeId: string, id: string) => {
    setLedger((prev) => {
      if (!prev[activeMonthKey]) return prev;
      return { ...prev, [activeMonthKey]: { ...prev[activeMonthKey], data: { ...prev[activeMonthKey].data, [bladeId]: prev[activeMonthKey].data[bladeId].filter((e) => e.id !== id) } } };
    });
  };

  const handleRemoveFood = (id: string) => {
    setLedger((prev) => {
      if (!prev[activeMonthKey]) return prev;
      return { ...prev, [activeMonthKey]: { ...prev[activeMonthKey], food: prev[activeMonthKey].food.filter((f) => f.id !== id) } };
    });
  };

  return { ledger, currentYear, setCurrentYear, currentMonth, setCurrentMonth, activeMonthKey, activeGoals, activeFood, activeData, handleModalSave, handleFoodSave, handleRemoveEntry, handleRemoveFood };
};