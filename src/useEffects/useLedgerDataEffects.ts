// ledgerEffects.ts
import { useEffect } from 'react';
import { db } from '../storage/database';
import { getLastWorkingDayOfMonth, getLastWorkingFridayOfMonth, calculateMonthlySavingsInterest, calculateDailyDebtInterest, getDaysBetweenDates, addOneMonthPreservingCadence, FALLBACK_DEBT_ACCRUAL_DAYS } from '../utils/dataEngine';
import type { GlobalLedger, UserProfile, SavingsEntry, DebtEntry, Goal } from '../types';

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
        const removedIds = new Set([...(currentMonthData.removedIds || []), ...(ledger[prevMonthKey].removedIds || [])]);

        // Check if the recurring items from last month are MISSING in the current month (same id = same identity)
        // and haven't been explicitly removed (tombstoned) as of this month.
        const missingRecurring = recurringInflows.filter(prevEntry => 
          !currentInflows.some(currEntry => currEntry.id === prevEntry.id) && !removedIds.has(prevEntry.id)
        );

        if (missingRecurring.length > 0) {
          console.log(`[INJECTOR] Found ${missingRecurring.length} missing recurring inflows. Injecting into ${activeMonthKey}...`);

          const clonedInflows = missingRecurring.map(entry => ({ ...entry }));

          setLedger(prev => ({
            ...prev,
            [activeMonthKey]: {
              ...currentMonthData,
              data: { 
                ...currentMonthData.data, 
                inflows: [...currentInflows, ...clonedInflows] 
              },
              removedIds: Array.from(removedIds)
            }
          }));
        }
      }
    }
  }, [currentYear, currentMonth, ledger, activeMonthKey, currentUser, setLedger]);
}

/**
 * Rolls each savings account's ending balance forward into the next month it's viewed
 * (identity + id are preserved so Goal.linkedSavings keeps pointing at the same account).
 * Contribution only carries forward if the account has "recurring contribution" enabled;
 * interest earned resets to 0 unless "fixed interest rate" is enabled, in which case it's
 * recalculated from the new starting balance.
 */
export function useSavingsCarryoverEffect(
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

    const prevSavings = ledger[prevMonthKey]?.data.savings || [];
    if (prevSavings.length === 0) return;

    const currentMonthData = ledger[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
    const currentSavings = currentMonthData.data.savings || [];
    const removedIds = new Set([...(currentMonthData.removedIds || []), ...(ledger[prevMonthKey]?.removedIds || [])]);

    // Only roll forward accounts that haven't already been carried into this month or been tombstoned
    const missing = prevSavings.filter(prevEntry => !currentSavings.some(cur => cur.id === prevEntry.id) && !removedIds.has(prevEntry.id));

    if (missing.length > 0) {
      console.log(`[SAVINGS CARRYOVER] Rolling ${missing.length} savings account(s) forward into ${activeMonthKey}...`);

      const rolledOver: SavingsEntry[] = missing.map(prevEntry => {
        const endingBalance = (prevEntry.currentBalance || 0) + (prevEntry.contribution || 0) + (prevEntry.interestEarned || 0);
        const nextContribution = prevEntry.isRecurringContribution ? (prevEntry.contribution || 0) : 0;
        const nextInterestEarned = prevEntry.isFixedInterestRate
          ? calculateMonthlySavingsInterest(endingBalance, prevEntry.interestRate || 0)
          : 0;

        return {
          ...prevEntry,
          currentBalance: endingBalance,
          contribution: nextContribution,
          interestEarned: nextInterestEarned
        };
      });

      setLedger(prev => ({
        ...prev,
        [activeMonthKey]: {
          ...currentMonthData,
          data: {
            ...currentMonthData.data,
            savings: [...currentSavings, ...rolledOver]
          },
          removedIds: Array.from(removedIds)
        }
      }));
    }
  }, [currentYear, currentMonth, ledger, activeMonthKey, currentUser, setLedger]);
}

/**
 * Goals carry forward automatically (no opt-in checkbox): once created, a goal keeps
 * appearing in every future month until it's removed. Removing it from a given month
 * (via `handleRemoveGoal`) simply stops it being found here on the next month, so it
 * naturally stops propagating forward from that point while past months are untouched.
 */
export function useGoalCarryoverEffect(
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

    const prevGoals = ledger[prevMonthKey]?.goals || [];
    if (prevGoals.length === 0) return;

    const currentMonthData = ledger[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
    const currentGoals = currentMonthData.goals || [];
    const removedIds = new Set([...(currentMonthData.removedIds || []), ...(ledger[prevMonthKey]?.removedIds || [])]);

    const missing = prevGoals.filter(prevGoal => !currentGoals.some(g => g.id === prevGoal.id) && !removedIds.has(prevGoal.id));

    if (missing.length > 0) {
      console.log(`[GOAL CARRYOVER] Rolling ${missing.length} goal(s) forward into ${activeMonthKey}...`);

      const rolledOver: Goal[] = missing.map(prevGoal => ({ ...prevGoal }));

      setLedger(prev => ({
        ...prev,
        [activeMonthKey]: {
          ...currentMonthData,
          goals: [...currentGoals, ...rolledOver],
          removedIds: Array.from(removedIds)
        }
      }));
    }
  }, [currentYear, currentMonth, ledger, activeMonthKey, currentUser, setLedger]);
}

/**
 * Rolls each debt's remaining balance forward into the next month it's viewed (identity + id
 * preserved). The ending balance (currentBalance + interestAccrued - actualPayment) becomes
 * next month's starting "remaining loan value". actualPayment carries forward unchanged so the
 * user doesn't have to re-enter their regular repayment. paymentDate automatically advances by
 * one month (preserving end-of-month cadence, e.g. 31 Aug -> 30 Sep -> 31 Oct), and
 * interestAccrued is recalculated immediately from the new balance and the days between the
 * old and new payment dates, so no manual re-entry is needed each month.
 */
export function useDebtCarryoverEffect(
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

    const prevDebt = ledger[prevMonthKey]?.data.debt || [];
    if (prevDebt.length === 0) return;

    const currentMonthData = ledger[activeMonthKey] || { data: { inflows: [], outflows: [], savings: [], debt: [] }, goals: [], food: [] };
    const currentDebt = currentMonthData.data.debt || [];
    const removedIds = new Set([...(currentMonthData.removedIds || []), ...(ledger[prevMonthKey]?.removedIds || [])]);

    const missing = prevDebt.filter(prevEntry => !currentDebt.some(cur => cur.id === prevEntry.id) && !removedIds.has(prevEntry.id));

    if (missing.length > 0) {
      console.log(`[DEBT CARRYOVER] Rolling ${missing.length} debt(s) forward into ${activeMonthKey}...`);

      const rolledOver: DebtEntry[] = missing.map(prevEntry => {
        const endingBalance = (prevEntry.currentBalance || 0) + (prevEntry.interestAccrued || 0) - (prevEntry.actualPayment || 0);
        const nextPaymentDate = prevEntry.paymentDate ? addOneMonthPreservingCadence(prevEntry.paymentDate) : undefined;
        const days = prevEntry.paymentDate && nextPaymentDate ? getDaysBetweenDates(prevEntry.paymentDate, nextPaymentDate) : FALLBACK_DEBT_ACCRUAL_DAYS;

        return {
          ...prevEntry,
          currentBalance: endingBalance,
          paymentDate: nextPaymentDate,
          interestAccrued: calculateDailyDebtInterest(endingBalance, prevEntry.interestRate || 0, days)
        };
      });

      setLedger(prev => ({
        ...prev,
        [activeMonthKey]: {
          ...currentMonthData,
          data: {
            ...currentMonthData.data,
            debt: [...currentDebt, ...rolledOver]
          },
          removedIds: Array.from(removedIds)
        }
      }));
    }
  }, [currentYear, currentMonth, ledger, activeMonthKey, currentUser, setLedger]);
}