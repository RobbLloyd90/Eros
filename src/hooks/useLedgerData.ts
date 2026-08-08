import { useState } from 'react';
import type { GlobalLedger, UserProfile, ModalState, FoodModalState, Goal, Entry, SavingsEntry, DebtEntry, FoodEntry } from '../types';
import { calculateMonthlySavingsInterest, calculateDailyDebtInterest, getDaysBetweenDates, FALLBACK_DEBT_ACCRUAL_DAYS } from '../utils/dataEngine';
import { 
  useCurrentUserEffect, 
  useTrackingEngineEffect, 
  useSaveLedgerEffect, 
  useRecurringInjectorEffect,
  useSavingsCarryoverEffect,
  useGoalCarryoverEffect,
  useDebtCarryoverEffect
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
  useSavingsCarryoverEffect(currentUser, ledger, currentYear, currentMonth, activeMonthKey, setLedger);
  useGoalCarryoverEffect(currentUser, ledger, currentYear, currentMonth, activeMonthKey, setLedger);
  useDebtCarryoverEffect(currentUser, ledger, currentYear, currentMonth, activeMonthKey, setLedger);

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
    } else if (modal.bladeId === 'savings') {
      const isFixedInterestRate = !!modal.isFixedInterestRate;
      const currentBalance = parseFloat(modal.currentBalance) || 0;
      const interestRate = parseFloat(modal.interestRate) || 0;
      const entryToSave: SavingsEntry = {
        id: modal.mode === 'add' ? Date.now().toString() : modal.id!, name: modal.name,
        currentBalance, contribution: parseFloat(modal.contribution) || 0,
        interestRate, interestEarned: isFixedInterestRate ? calculateMonthlySavingsInterest(currentBalance, interestRate) : (parseFloat(modal.interestEarned) || 0),
        isRecurringContribution: !!modal.isRecurringContribution,
        isFixedInterestRate
      };
      setLedger((prev) => {
        const monthData = prev[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
        const updated = modal.mode === 'add' ? [...monthData.data.savings, entryToSave] : monthData.data.savings.map((e) => (e.id === modal.id ? entryToSave : e));
        return { ...prev, [activeMonthKey]: { ...monthData, data: { ...monthData.data, savings: updated } } };
      });
    } else if (modal.bladeId === 'debt') {
      const currentBalance = parseFloat(modal.currentBalance) || 0;
      const interestRate = parseFloat(modal.interestRate) || 0;
      const days = modal.previousPaymentDate ? getDaysBetweenDates(modal.previousPaymentDate, modal.paymentDate || '') : FALLBACK_DEBT_ACCRUAL_DAYS;
      const entryToSave: DebtEntry = {
        id: modal.mode === 'add' ? Date.now().toString() : modal.id!, name: modal.name,
        currentBalance, interestRate,
        minimumPayment: parseFloat(modal.minimumPayment) || 0, actualPayment: parseFloat(modal.actualPayment) || 0,
        interestAccrued: calculateDailyDebtInterest(currentBalance, interestRate, days),
        paymentDate: modal.paymentDate || undefined
      };
      setLedger((prev) => {
        const monthData = prev[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
        const updated = modal.mode === 'add' ? [...monthData.data.debt, entryToSave] : monthData.data.debt.map((e) => (e.id === modal.id ? entryToSave : e));
        return { ...prev, [activeMonthKey]: { ...monthData, data: { ...monthData.data, debt: updated } } };
      });
    } else {
      const bladeId = modal.bladeId as 'inflows' | 'outflows';
      const entryToSave: Entry = {
        id: modal.mode === 'add' ? Date.now().toString() : modal.id!, name: modal.name, expected: parseFloat(modal.expected) || 0, actual: parseFloat(modal.actual) || 0,
        category: modal.category || undefined, ...(bladeId === 'outflows' && { tag: modal.tag })
      };
      setLedger((prev) => {
        const monthData = prev[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
        const updated = modal.mode === 'add' ? [...monthData.data[bladeId], entryToSave] : monthData.data[bladeId].map((e) => (e.id === modal.id ? entryToSave : e));
        return { ...prev, [activeMonthKey]: { ...monthData, data: { ...monthData.data, [bladeId]: updated } } };
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

  const handleRemoveEntry = (bladeId: 'inflows' | 'outflows' | 'savings' | 'debt', id: string) => {
    setLedger((prev) => {
      if (!prev[activeMonthKey]) return prev;
      const updated = (prev[activeMonthKey].data[bladeId] as Array<{ id: string }>).filter((e) => e.id !== id);
      return { ...prev, [activeMonthKey]: { ...prev[activeMonthKey], data: { ...prev[activeMonthKey].data, [bladeId]: updated } } };
    });
  };

  const handleRemoveFood = (id: string) => {
    setLedger((prev) => {
      if (!prev[activeMonthKey]) return prev;
      return { ...prev, [activeMonthKey]: { ...prev[activeMonthKey], food: prev[activeMonthKey].food.filter((f) => f.id !== id) } };
    });
  };

  // Removes the goal from this month onward only; past months keep their historical record.
  const handleRemoveGoal = (id: string) => {
    setLedger((prev) => {
      if (!prev[activeMonthKey]) return prev;
      return { ...prev, [activeMonthKey]: { ...prev[activeMonthKey], goals: prev[activeMonthKey].goals.filter((g) => g.id !== id) } };
    });
  };

  // Strips the goal from every month in the ledger, past and future.
  const handleRemoveGoalEverywhere = (id: string) => {
    setLedger((prev) => {
      const updated: GlobalLedger = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = { ...prev[key], goals: prev[key].goals.filter((g) => g.id !== id) };
      });
      return updated;
    });
  };

  return { ledger, currentYear, setCurrentYear, currentMonth, setCurrentMonth, activeMonthKey, activeGoals, activeFood, activeData, handleModalSave, handleFoodSave, handleRemoveEntry, handleRemoveFood, handleRemoveGoal, handleRemoveGoalEverywhere };
};