import React, { useState, useEffect } from 'react';
import type { ThemeType, ModalState, FoodModalState, ChartModalState, ChartConfig, Entry, Goal, FoodEntry } from './types';
import { getThemeStyles } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useLedgerData } from './hooks/useLedgerData';

import { GlobalStyles } from './components/GlobalStyles';
import { LiquidBackground } from './components/LiquidBackground';
import { Header } from './components/Header';
import { ViewRouter } from './components/ViewRouter';
import { AppModals } from './components/AppModals';
import { LockScreen } from './components/LockScreen';

const MainApp = () => {
  const { currentUser, updateTheme, updateCharts } = useAuth();
  const { ledger, currentYear, setCurrentYear, currentMonth, setCurrentMonth, activeMonthKey, activeGoals, activeFood, activeData, handleModalSave, handleFoodSave, handleRemoveEntry, handleRemoveFood } = useLedgerData(currentUser);

  const [theme, setTheme] = useState<ThemeType>(currentUser?.theme || 'aero_g3');
  const [view, setView] = useState<'dashboard' | 'year' | 'month' | 'food' | 'settings'>('dashboard');
  const [charts, setCharts] = useState<ChartConfig[]>([]);

  // Modal States
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'add', isGoal: false, bladeId: 'outflows', id: null, name: '', expected: '', actual: '', tag: 'fixed', targetAmount: '', targetDate: '', linkedSavings: [], interestRate: '', contribution: '', currentBalance: '', interestEarned: '', minimumPayment: '', actualPayment: '', interestAccrued: '', category: '' });
  const [foodModal, setFoodModal] = useState<FoodModalState>({ isOpen: false, mode: 'add', id: null, category: '', store: '', item: '', method: 'Debit/Cash', price: '', date: new Date().toISOString().split('T')[0] });
  const [chartModal, setChartModal] = useState<ChartModalState>({ isOpen: false, mode: 'add', id: null, title: '', type: 'pie', source: 'outflows', targetIds: [] });
  const [deleteChartModal, setDeleteChartModal] = useState<{ isOpen: boolean; chartId: string; chartTitle: string }>({ isOpen: false, chartId: '', chartTitle: '' });

  useEffect(() => {
    if (currentUser) {
      setTheme(currentUser.theme);
      setCharts(currentUser.charts || [{ id: 'c1', title: 'Food Spend By Category', type: 'pie', source: 'food' }]);
    }
  }, [currentUser]);

  const handleThemeChange = (newTheme: ThemeType) => { setTheme(newTheme); updateTheme(newTheme); };

  const handleOpenAddModal = () => {
    if (view === 'food') { setFoodModal(prev => ({ ...prev, isOpen: true, mode: 'add', id: null, category: '', store: '', item: '', method: 'Debit/Cash', price: '', date: new Date().toISOString().split('T')[0] })); } 
    else { setModal(prev => ({ ...prev, isOpen: true, mode: 'add', id: null, name: '', expected: '', actual: '', targetAmount: '', targetDate: '', linkedSavings: [], interestRate: '', contribution: '', currentBalance: '', interestEarned: '', minimumPayment: '', actualPayment: '', interestAccrued: '', category: '' })); }
  };

  const openEditEntry = (bladeId: string, entry: Entry) => setModal(prev => ({ ...prev, isOpen: true, mode: 'edit', isGoal: false, bladeId, id: entry.id, name: entry.name, expected: entry.expected?.toString() || '', actual: entry.actual?.toString() || '', tag: entry.tag || 'fixed', interestRate: entry.interestRate?.toString() || '', contribution: entry.contribution?.toString() || '', currentBalance: entry.currentBalance?.toString() || '', interestEarned: entry.interestEarned?.toString() || '', minimumPayment: entry.minimumPayment?.toString() || '', actualPayment: entry.actualPayment?.toString() || '', interestAccrued: entry.interestAccrued?.toString() || '', category: entry.category || '' }));
  const openEditGoal = (goal: Goal) => setModal(prev => ({ ...prev, isOpen: true, mode: 'edit', isGoal: true, bladeId: 'goals', id: goal.id, name: goal.name, targetAmount: goal.targetAmount.toString(), targetDate: goal.targetDate, linkedSavings: goal.linkedSavings }));
  const openEditFood = (food: FoodEntry) => setFoodModal({ isOpen: true, mode: 'edit', id: food.id, category: food.category, store: food.store, item: food.item, method: food.method, price: food.price.toString(), date: food.date });

  const handleChartSave = () => {
    if (!chartModal.title) return;
    
    // UPDATED: Now includes targetIds so the specific goal selections are saved securely to the database
    const chartData: ChartConfig = { 
      id: chartModal.mode === 'add' ? Date.now().toString() : chartModal.id!, 
      title: chartModal.title, 
      type: chartModal.type, 
      source: chartModal.source,
      targetIds: chartModal.targetIds 
    };
    
    const newChartsArray = chartModal.mode === 'add' ? [...charts, chartData] : charts.map(c => c.id === chartModal.id ? chartData : c);
    setCharts(newChartsArray); 
    updateCharts(newChartsArray); 
    setChartModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirmChartDelete = () => {
    const newChartsArray = charts.filter(c => c.id !== deleteChartModal.chartId);
    setCharts(newChartsArray); updateCharts(newChartsArray); setDeleteChartModal({ isOpen: false, chartId: '', chartTitle: '' });
  };

  const tStyle = getThemeStyles(theme);
  const isLight = theme === 'aero_g3';

  return (
    <>
      <GlobalStyles />
      <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', ...tStyle.screen }}>
        <LiquidBackground theme={theme} />
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <Header theme={theme} setTheme={handleThemeChange} isLight={isLight} tStyle={tStyle} currentView={view as any} currentYear={currentYear} currentMonth={currentMonth} onBackToDashboard={() => setView('dashboard')} onBackToYear={() => setView('year')} onNavigateToSettings={() => setView('settings')} openAddModal={handleOpenAddModal} />

          <ViewRouter view={view} setView={setView} theme={theme} tStyle={tStyle} isLight={isLight} handleThemeChange={handleThemeChange} ledger={ledger} currentYear={currentYear} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} setCurrentYear={setCurrentYear} charts={charts} activeMonthKey={activeMonthKey} activeData={activeData} activeGoals={activeGoals} activeFood={activeFood} setChartModal={setChartModal} setDeleteChartModal={setDeleteChartModal} openEditFood={openEditFood} handleRemoveFood={handleRemoveFood} openEditEntry={openEditEntry} handleRemoveEntry={handleRemoveEntry} openEditGoal={openEditGoal} />
        </div>

        {/* UPDATED: Passed activeGoals into the AppModals so the Chart Modal can render the checklist */}
        <AppModals modal={modal} setModal={setModal} foodModal={foodModal} setFoodModal={setFoodModal} chartModal={chartModal} setChartModal={setChartModal} deleteChartModal={deleteChartModal} setDeleteChartModal={setDeleteChartModal} theme={theme} tStyle={tStyle} isLight={isLight} activeData={activeData} activeGoals={activeGoals} handleModalSave={() => handleModalSave(modal)} handleFoodSave={() => handleFoodSave(foodModal)} handleChartSave={handleChartSave} handleConfirmChartDelete={handleConfirmChartDelete} />
      </div>
    </>
  );
};

export default function App() { return ( <AuthProvider><AuthWrapper /></AuthProvider> ); }
const AuthWrapper = () => { const { isAuthenticated } = useAuth(); return isAuthenticated ? <MainApp /> : <LockScreen />; };