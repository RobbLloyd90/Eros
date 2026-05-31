import { MONTH_NAMES } from '../config';
import type { GlobalLedger, ChartDataPoint, LineChartData, ThemeType, ChartConfig } from '../types';

export const getChartData = (source: string, activeMonthData: any, theme: ThemeType): ChartDataPoint[] => {
  if (!activeMonthData) return [];
  const chartColors = ['#10b981', '#0ea5e9', '#a855f7', '#f43f5e', '#f97316', '#eab308', '#8b5cf6'];

  if (source === 'food') {
    const totals: Record<string, number> = {};
    (activeMonthData.food || []).forEach((f: any) => totals[f.category || 'Other'] = (totals[f.category || 'Other'] || 0) + f.price);
    const totalSpend = Object.values(totals).reduce((a, b) => a + b, 0);

    return Object.keys(totals).map((cat, i) => ({
      label: cat, value: totals[cat], percentage: totalSpend ? (totals[cat] / totalSpend) * 100 : 0,
      color: theme === 'nothing_glow' && i === 0 ? '#CEFF00' : theme === 'nothing_os' ? (i % 2 === 0 ? '#fff' : '#555') : chartColors[i % chartColors.length]
    })).sort((a, b) => b.value - a.value);
  }

  if (source === 'outflows' || source === 'inflows') {
    const dataArr = activeMonthData.data[source] || [];
    const totalSpend = dataArr.reduce((sum: number, e: any) => sum + e.actual, 0);
    return dataArr.map((e: any, i: number) => ({
      label: e.name, value: e.actual, percentage: totalSpend ? (e.actual / totalSpend) * 100 : 0,
      color: theme === 'nothing_glow' && i === 0 ? '#CEFF00' : theme === 'nothing_os' ? (i % 2 === 0 ? '#fff' : '#555') : chartColors[i % chartColors.length]
    })).sort((a, b) => b.value - a.value);
  }
  return [];
};

export const getLineChartData = (chart: ChartConfig, ledger: GlobalLedger, theme: ThemeType, tStyle: any, isLight: boolean): LineChartData | null => {
  const validLineSources = ['netWorth', 'inflows_trend', 'outflows_trend', 'food_trend', 'savings_trend', 'debt_trend', 'goal_trend'];
  if (!validLineSources.includes(chart.source)) return null;

  let monthKeys = Object.keys(ledger).sort();
  if (monthKeys.length === 0) return null;

  let targetValue: number | undefined = undefined;
  let combinedLinkedSavings = new Set<string>();

  // // --- BULLETPROOF GOAL PROGRESS ENGINE ---
  // if (chart.source === 'goal_trend') {
  //   let combinedTarget = 0;
  //   let earliestMonthIndex = monthKeys.length;
    
  //   // SAFETY: Fallback to empty array if undefined
  //   const targets = chart.targetIds || [];

  //   targets.forEach(goalId => {
  //     monthKeys.forEach((key, index) => {
  //       // SAFETY: Fallback for goals array
  //       if ((ledger[key].goals || []).some(g => g.id === goalId)) {
  //         if (index < earliestMonthIndex) earliestMonthIndex = index;
  //       }
  //     });
  //     for (let i = monthKeys.length - 1; i >= 0; i--) {
  //       const g = (ledger[monthKeys[i]].goals || []).find(x => x.id === goalId);
  //       if (g) {
  //         combinedTarget += Number(g.targetAmount || 0);
  //         // CRITICAL SAFETY: linkedSavings might be undefined on old goals
  //         (g.linkedSavings || []).forEach(s => combinedLinkedSavings.add(s));
  //         break;
  //       }
  //     }
  //   });
    
  //   targetValue = combinedTarget;
    
  //   // Truncate timeline to only show from when the earliest goal was created
  //   if (earliestMonthIndex < monthKeys.length) {
  //     monthKeys = monthKeys.slice(earliestMonthIndex);
  //   } else {
  //     // If no valid history was found, return an empty timeline
  //     monthKeys = [];
  //   }
  // }

  const labels: string[] = [];
  const data1: number[] = []; const data2: number[] = []; const data3: number[] = [];

  monthKeys.forEach(key => {
    const [y, m] = key.split('-');
    labels.push(`${MONTH_NAMES[parseInt(m) - 1]} '${y.slice(2)}`);
    const monthLedger = ledger[key];

    if (chart.source === 'netWorth' || chart.source === 'savings_trend' || chart.source === 'debt_trend') {
      let totalSav = 0; let totalDbt = 0;
      (monthLedger.data?.savings || []).forEach(s => totalSav += (s.currentBalance || 0) + (s.contribution || 0) + (s.interestEarned || 0));
      (monthLedger.data?.debt || []).forEach(d => {
        const accrued = d.interestAccrued !== undefined ? d.interestAccrued : ((d.currentBalance || 0) * ((d.interestRate || 0)/100) / 12);
        totalDbt += (d.currentBalance || 0) + accrued - (d.actualPayment || 0);
      });
      if (chart.source === 'netWorth') { data1.push(totalSav); data2.push(totalDbt); data3.push(totalSav - totalDbt); } 
      else if (chart.source === 'savings_trend') data1.push(totalSav);
      else if (chart.source === 'debt_trend') data1.push(totalDbt);
    } 
    else if (chart.source === 'inflows_trend') data1.push((monthLedger.data?.inflows || []).reduce((acc, curr) => acc + curr.actual, 0));
    else if (chart.source === 'outflows_trend') data1.push((monthLedger.data?.outflows || []).reduce((acc, curr) => acc + curr.actual, 0));
    else if (chart.source === 'food_trend') data1.push((monthLedger.food || []).reduce((acc, curr) => acc + curr.price, 0));
    
    // Calculate linked savings strictly for this specific goal
    else if (chart.source === 'goal_trend') {
      let saved = 0;
      (monthLedger.data?.savings || []).forEach(s => {
        if (combinedLinkedSavings.has(s.id)) {
          saved += (s.currentBalance || 0) + (s.contribution || 0) + (s.interestEarned || 0);
        }
      });
      data1.push(saved);
    }
  });

  if (chart.source === 'netWorth') return { labels, datasets: [{ label: "Total Savings", data: data1, color: tStyle.colors.pos }, { label: "Total Debt", data: data2, color: tStyle.colors.neg }, { label: "Net Worth", data: data3, color: theme === 'nothing_glow' ? '#CEFF00' : (isLight ? '#0f172a' : '#ffffff') }] };

  let label = "Trend"; let color = tStyle.colors.pos;
  if (chart.source === 'inflows_trend') { label = "Incoming Trend"; color = tStyle.colors.pos; }
  if (chart.source === 'outflows_trend') { label = "Outgoings Trend"; color = tStyle.colors.neg; }
  if (chart.source === 'food_trend') { label = "Food Budget Trend"; color = tStyle.colors.neg; }
  if (chart.source === 'savings_trend') { label = "Savings Growth"; color = tStyle.colors.pos; }
  if (chart.source === 'debt_trend') { label = "Debt Levels"; color = tStyle.colors.neg; }
  if (chart.source === 'goal_trend') { label = "Goal Progress"; color = tStyle.colors.pos; }

  return { labels, datasets: [{ label, data: data1, color }], targetValue };
};