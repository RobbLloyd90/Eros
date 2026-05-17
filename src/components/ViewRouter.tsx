import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { SettingsView } from './SettingsView';
import { Dashboard } from './Dashboard';
import { YearView } from './YearView';
import { FoodView } from './FoodView';
import { MonthLedger } from './MonthLedger';

interface ViewRouterProps {
  view: string;
  theme: any; tStyle: any; isLight: boolean; handleThemeChange: any;
  ledger: any; currentYear: number; currentMonth: number; setCurrentMonth: any; setCurrentYear: any;
  charts: any; activeMonthKey: string; activeData: any; activeGoals: any; activeFood: any;
  setView: any; setChartModal: any; setDeleteChartModal: any; openEditFood: any; handleRemoveFood: any;
  openEditEntry: any; handleRemoveEntry: any; openEditGoal: any;
}

export const ViewRouter: React.FC<ViewRouterProps> = (props) => {
  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden', marginTop: '4px' }}>
      <AnimatePresence initial={false} mode="wait">
        {props.view === 'settings' && <SettingsView key="settings" theme={props.theme} tStyle={props.tStyle} isLight={props.isLight} onThemeSelect={props.handleThemeChange} />}
        
        {props.view === 'dashboard' && <Dashboard key="dashboard" theme={props.theme} tStyle={props.tStyle} isLight={props.isLight} ledger={props.ledger} currentYear={props.currentYear} currentMonth={props.currentMonth} userCharts={props.charts} onNavigateToCurrentMonth={() => { props.setCurrentYear(2026); props.setCurrentMonth(5); props.setView('month'); }} onNavigateToFood={() => { props.setCurrentYear(2026); props.setCurrentMonth(5); props.setView('food'); }} onNavigateToYear={() => props.setView('year')} onAddChart={() => props.setChartModal({ isOpen: true, mode: 'add', id: null, title: '', type: 'bar', source: 'outflows', targetIds: [] })} onEditChart={(chart) => props.setChartModal({ isOpen: true, mode: 'edit', id: chart.id, title: chart.title, type: chart.type, source: chart.source, targetIds: chart.targetIds || [] })} onDeleteChart={(id, title) => props.setDeleteChartModal({ isOpen: true, chartId: id, chartTitle: title })} />}
        
        {props.view === 'year' && <YearView key="year" currentYear={props.currentYear} ledger={props.ledger} theme={props.theme} tStyle={props.tStyle} isLight={props.isLight} onSelectMonth={(m) => { props.setCurrentMonth(m); props.setView('month'); }} />}
        
        {props.view === 'food' && <FoodView key="food" foodEntries={props.activeFood} theme={props.theme} tStyle={props.tStyle} isLight={props.isLight} onEdit={props.openEditFood} onRemove={props.handleRemoveFood} />}
        
        {props.view === 'month' && <MonthLedger key="month" currentMonth={props.currentMonth} currentYear={props.currentYear} setCurrentMonth={props.setCurrentMonth} setCurrentYear={props.setCurrentYear} activeMonthKey={props.activeMonthKey} activeData={props.activeData} activeGoals={props.activeGoals} theme={props.theme} tStyle={props.tStyle} isLight={props.isLight} openEditEntry={props.openEditEntry} handleRemoveEntry={props.handleRemoveEntry} openEditGoal={props.openEditGoal} />}
      </AnimatePresence>
    </div>
  );
};