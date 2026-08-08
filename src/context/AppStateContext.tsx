import React, { createContext, useContext } from 'react';
import type {
  ThemeType,
  GlobalLedger,
  ChartConfig,
  BladeData,
  Goal,
  FoodEntry,
  PrivacySettings,
  Entry,
  SavingsEntry,
  DebtEntry,
  ModalState,
  ChartModalState,
  DeleteChartModalState
} from '../types';

export type AppView = 'dashboard' | 'year' | 'month' | 'food' | 'settings';

export interface AppStateValue {
  view: AppView;
  setView: (view: AppView) => void;
  theme: ThemeType;
  tStyle: any;
  isLight: boolean;
  handleThemeChange: (theme: ThemeType) => void;
  ledger: GlobalLedger;
  currentYear: number;
  currentMonth: number;
  setCurrentYear: (y: number) => void;
  setCurrentMonth: (m: number) => void;
  charts: ChartConfig[];
  activeMonthKey: string;
  activeData: BladeData;
  activeGoals: Goal[];
  activeFood: FoodEntry[];
  setChartModal: React.Dispatch<React.SetStateAction<ChartModalState>>;
  setDeleteChartModal: React.Dispatch<React.SetStateAction<DeleteChartModalState>>;
  openEditFood: (food: FoodEntry) => void;
  handleRemoveFood: (id: string) => void;
  openEditEntry: (bladeId: ModalState['bladeId'], entry: Entry | SavingsEntry | DebtEntry) => void;
  handleRemoveEntry: (bladeId: 'inflows' | 'outflows' | 'savings' | 'debt', id: string) => void;
  openEditGoal: (goal: Goal) => void;
  openDeleteGoal: (goal: Goal) => void;
  privacySettings: PrivacySettings;
  setPrivacySettings: (p: PrivacySettings) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

/** Provides the shared dashboard/ledger/UI state so routed views don't need it prop-drilled through ViewRouter. */
export const AppStateProvider: React.FC<{ value: AppStateValue; children: React.ReactNode }> = ({ value, children }) => (
  <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
);

export const useAppState = (): AppStateValue => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
};
