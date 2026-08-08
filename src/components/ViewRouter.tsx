import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { SettingsView } from './SettingsView';
import { Dashboard } from './Dashboard';
import { YearView } from './YearView';
import { FoodView } from './FoodView';
import { MonthLedger } from './MonthLedger';
import { useAppState } from '../context/AppStateContext';

export const ViewRouter: React.FC = () => {
  const { view } = useAppState();

  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden', marginTop: '4px' }}>
      <AnimatePresence initial={false} mode="wait">
        {view === 'settings' && <SettingsView key="settings" />}
        {view === 'dashboard' && <Dashboard key="dashboard" />}
        {view === 'year' && <YearView key="year" />}
        {view === 'food' && <FoodView key="food" />}
        {view === 'month' && <MonthLedger key="month" />}
      </AnimatePresence>
    </div>
  );
};
