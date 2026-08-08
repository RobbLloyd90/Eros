// ledgerEffects.ts
import { useEffect } from 'react';
import { db } from '../storage/database';
import { getLastWorkingDayOfMonth, getLastWorkingFridayOfMonth } from '../utils/dataEngine';
import type { GlobalLedger, UserProfile } from '../types';

/**
 * Initializes the ledger data for the current user and handles the rollover 
 * logic if the final paycheck of the month has cleared.
 */
export function useCurrentUserEffect(
  currentUser: UserProfile | null,
  setLedger: React.Dispatch<React.SetStateAction<GlobalLedger>>,
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>,
  setCurrentMonth: React.Dispatch<React.SetStateAction<number>>
) {
  useEffect(() => {
    if (currentUser) {
      const currentData = db.getLedger(currentUser.id);
      setLedger(currentData);

      const today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      const currentMonthKey = `${year}-${String(month).padStart(2, '0')}`;
      const thisMonthData = currentData[currentMonthKey];

      let shouldRollOver = false;

      if (thisMonthData && thisMonthData.data && thisMonthData.data.inflows) {
        const recurringIncome = thisMonthData.data.inflows.find((e: any) => e.isRecurring);
        
        if (recurringIncome && recurringIncome.recurringProfile) {
          const freq = recurringIncome.recurringProfile.frequency;
          let finalPayDate: Date | null = null;

          if (freq === 'monthly_last_day') {
            finalPayDate = getLastWorkingDayOfMonth(year, month);
          } else if (['monthly_last_friday', 'weekly', 'fortnightly'].includes(freq)) {
            finalPayDate = getLastWorkingFridayOfMonth(year, month);
          }

          if (finalPayDate && today.getDate() >= finalPayDate.getDate()) {
            shouldRollOver = true;
          }
        }
      }

      if (shouldRollOver) {
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
        console.log(`[ROLLOVER ENGINE] Final paycheck cleared. Rolling active cycle forward to ${year}-${String(month).padStart(2, '0')}`);
      }

      setCurrentYear(year);
      setCurrentMonth(month);
    }
  }, [currentUser, setLedger, setCurrentYear, setCurrentMonth]);
}

/**
 * Silently tracks totals for savings, debt, net worth, and accrued interests 
 * across the entire ledger for logging and debugging.
 */
export function useTrackingEngineEffect(ledger: GlobalLedger) {
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
}

/**
 * Automatically saves the ledger to the database whenever it changes.
 */
export function useSaveLedgerEffect(
  ledger: GlobalLedger, 
  currentUser: UserProfile | null
) {
  useEffect(() => {
    if (currentUser && Object.keys(ledger).length > 0) {
      db.saveLedger(currentUser.id, ledger);
    }
  }, [ledger, currentUser]);
}

/**
 * Checks the previous month for recurring inflows and automatically 
 * injects them into the current active month if they are missing.
 */
export function useRecurringInjectorEffect(
  currentUser: UserProfile | null,
  ledger: GlobalLedger,
  currentYear: number,
  currentMonth: number,
  activeMonthKey: string,
  setLedger: React.Dispatch<React.SetStateAction<GlobalLedger>>
) {
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
  }, [currentYear, currentMonth, ledger, activeMonthKey, currentUser, setLedger]);
}