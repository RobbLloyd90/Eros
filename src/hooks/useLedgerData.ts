import { useState, useEffect } from 'react';
import { db } from '../storage/database';
import type { GlobalLedger, UserProfile, ModalState, FoodModalState, Goal, Entry, FoodEntry } from '../types';
import { getLastWorkingDayOfMonth, getLastWorkingFridayOfMonth } from '../utils/dataEngine'; 

export const useLedgerData = (currentUser: UserProfile | null) => {
  const [ledger, setLedger] = useState<GlobalLedger>({});
  
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);

  // --- PHASE 4: THE CYCLE ROLLOVER ENGINE ---
  useEffect(() => {
    if (currentUser) {
      const currentData = db.getLedger(currentUser.id);
      setLedger(currentData);

      const today = new Date();
      let y = today.getFullYear();
      let m = today.getMonth() + 1;
      const currentMonthKey = `${y}-${String(m).padStart(2, '0')}`;
      const thisMonthData = currentData[currentMonthKey];

      let shouldRollOver = false;

      if (thisMonthData && thisMonthData.data && thisMonthData.data.inflows) {
        const recurringIncome = thisMonthData.data.inflows.find((e: any) => e.isRecurring);
        
        if (recurringIncome && recurringIncome.recurringProfile) {
          const freq = recurringIncome.recurringProfile.frequency;
          let finalPayDate: Date | null = null;

          if (freq === 'monthly_last_day') {
            finalPayDate = getLastWorkingDayOfMonth(y, m);
          } else if (['monthly_last_friday', 'weekly', 'fortnightly'].includes(freq)) {
            finalPayDate = getLastWorkingFridayOfMonth(y, m);
          }

          if (finalPayDate && today.getDate() >= finalPayDate.getDate()) {
            shouldRollOver = true;
          }
        }
      }

      if (shouldRollOver) {
        m += 1;
        if (m > 12) {
          m = 1;
          y += 1;
        }
        console.log(`[ROLLOVER ENGINE] Final paycheck cleared. Rolling active cycle forward to ${y}-${String(m).padStart(2, '0')}`);
      }

      setCurrentYear(y);
      setCurrentMonth(m);
    }
  }, [currentUser]);

  // --- SILENT LONG-TERM TRACKING ENGINE ---
  useEffect(() => {
    let totalSav = 0; let totalDbt = 0; let totalIntGained = 0; let totalCont = 0; let monthlyIntAccrued = 0;
    Object.values(ledger).forEach((month) => {
      (month.data.savings || []).forEach((s) => {
        totalSav += (s.currentBalance || 0) + (s.contribution || 0) + (s.interestEarned || 0);
        totalIntGained += s.interestEarned || 0; totalCont += s.contribution || 0;
      });
      (month.data.debt || []).forEach((d) => {
        const accrued = d.interestAccrued !== undefined ? d.interestAccrued : ((d.currentBalance || 0) * ((d.interestRate || 0) / 100)) / 12;
        monthlyIntAccrued += accrued;
        totalDbt += (d.currentBalance || 0) + accrued - (d.actualPayment || 0);
      });
    });
    console.log('[SILENT TRACKING ENGINE] Updated:', { totalSavings: totalSav, totalDebt: totalDbt, netWorth: totalSav - totalDbt, totalInterestGained: totalIntGained, totalContributions: totalCont, monthlyInterestAccrued: monthlyIntAccrued });
  }, [ledger]);

  useEffect(() => {
    if (currentUser && Object.keys(ledger).length > 0) {
      db.saveLedger(currentUser.id, ledger);
    }
  }, [ledger, currentUser]);

  const activeMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  
  // --- PHASE 3: THE RECURRING INJECTOR ENGINE (UPGRADED) ---
  useEffect(() => {
    if (!currentUser || Object.keys(ledger).length === 0) return;

    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    const prevMonthKey = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

    if (ledger[prevMonthKey]) {
      const prevInflows = ledger[prevMonthKey].data.inflows || [];
      const recurringInflows = prevInflows.filter(entry => entry.isRecurring);

      if (recurringInflows.length > 0) {
        const currentMonthData = ledger[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
        const currentInflows = currentMonthData.data.inflows || [];

        // Check if the recurring items from last month are MISSING in the current month
        const missingRecurring = recurringInflows.filter(prevEntry => 
          !currentInflows.some(currEntry => currEntry.name === prevEntry.name && currEntry.isRecurring)
        );

        if (missingRecurring.length > 0) {
          console.log(`[INJECTOR] Found ${missingRecurring.length} missing recurring inflows. Injecting into ${activeMonthKey}...`);
          
          const clonedInflows = missingRecurring.map(entry => ({
            ...entry,
            id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }));

          setLedger(prev => ({
            ...prev,
            [activeMonthKey]: {
              ...currentMonthData,
              data: { 
                ...currentMonthData.data, 
                inflows: [...currentInflows, ...clonedInflows] 
              }
            }
          }));
        }
      }
    }
  }, [currentYear, currentMonth, ledger, activeMonthKey, currentUser]);

  const rawMonthData = ledger[activeMonthKey]?.data || { inflows: [], outflows: [], savings: [], debt: [] };
  const activeGoals = ledger[activeMonthKey]?.goals || [];
  const activeFood = ledger[activeMonthKey]?.food || [];
  const totalFoodActual = activeFood.reduce((sum, f) => sum + f.price, 0);

  let processedOutflows = [...(rawMonthData.outflows || [])];
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
        id: modal.mode === 'add' ? Date.now().toString() : modal.id!, 
        name: modal.name, 
        expected: parseFloat(modal.expected) || 0, 
        actual: parseFloat(modal.actual) || 0,
        interestRate: parseFloat(modal.interestRate) || 0, 
        contribution: parseFloat(modal.contribution) || 0, 
        currentBalance: parseFloat(modal.currentBalance) || 0, 
        interestEarned: parseFloat(modal.interestEarned) || 0, 
        minimumPayment: parseFloat(modal.minimumPayment) || 0, 
        actualPayment: parseFloat(modal.actualPayment) || 0, 
        interestAccrued: parseFloat(modal.interestAccrued) || 0, 
        category: modal.category || undefined, 
        ...(modal.bladeId === 'outflows' && { tag: modal.tag }),
        ...(modal.bladeId === 'inflows' && {
          isRecurring: modal.isRecurring || false,
          recurringProfile: modal.isRecurring ? {
            frequency: modal.recurringFreq as any || 'monthly_last_day',
            fortnightStartWeek: modal.fortnightStartWeek as any || 1
          } : undefined
        })
      };

      setLedger((prev) => {
        const originalEntry = prev[activeMonthKey]?.data[modal.bladeId]?.find((e) => e.id === modal.id);
        const targetName = originalEntry ? originalEntry.name : entryToSave.name;

        const monthData = prev[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
        const updatedBlade = modal.mode === 'add' ? [...(monthData.data[modal.bladeId] || []), entryToSave] : (monthData.data[modal.bladeId] || []).map((e) => (e.id === modal.id ? entryToSave : e));
        
        let nextLedger = { ...prev, [activeMonthKey]: { ...monthData, data: { ...monthData.data, [modal.bladeId]: updatedBlade } } };

        // --- FUTURE CLEANUP ENGINE ---
        if (modal.mode === 'edit' && modal.bladeId === 'inflows' && !entryToSave.isRecurring && originalEntry?.isRecurring) {
          console.log(`[CLEANUP ENGINE] Recurring disabled for '${targetName}'. Removing from all future months...`);
          
          Object.keys(nextLedger).forEach((mKey) => {
            if (mKey > activeMonthKey) {
              const futureMonth = nextLedger[mKey];
              if (futureMonth && futureMonth.data && futureMonth.data.inflows) {
                nextLedger[mKey] = {
                  ...futureMonth,
                  data: {
                    ...futureMonth.data,
                    inflows: futureMonth.data.inflows.filter((e) => !(e.name === targetName && e.isRecurring))
                  }
                };
              }
            }
          });
        }

        return nextLedger;
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