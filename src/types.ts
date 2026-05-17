export type Entry = {
  id: string;
  name: string;
  tag?: 'fixed' | 'fluid';
  category?: string;
  // Flow Fields (In/Out)
  expected?: number;
  actual?: number;
  // Savings Fields
  interestRate?: number;
  contribution?: number;
  currentBalance?: number;
  interestEarned?: number;
  // Debt Fields
  minimumPayment?: number;
  actualPayment?: number;
  interestAccrued?: number;
};

export type Goal = { id: string; name: string; targetAmount: number; targetDate: string; linkedSavings: string[] };

export type FoodEntry = {
  id: string;
  category: string;
  store: string;
  item: string;
  method: 'Debit/Cash' | 'Credit';
  price: number;
  date: string;
};

export type BladeData = Record<string, Entry[]>;
export type MonthlyLedger = { data: BladeData; goals: Goal[]; food: FoodEntry[] };
export type GlobalLedger = Record<string, MonthlyLedger>;

export type ThemeType = 'bondi' | 'cybercore' | 'softtech' | 'aero_g3' | 'nothing_os' | 'nothing_glow';

export type ModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  isGoal: boolean;
  bladeId: string;
  id: string | null;
  name: string;
  tag: 'fixed' | 'fluid';
  targetAmount: string;
  targetDate: string;
  linkedSavings: string[];
  expected: string;
  actual: string;
  interestRate: string;
  contribution: string;
  currentBalance: string;
  interestEarned: string;
  minimumPayment: string;
  actualPayment: string;
  interestAccrued: string;
  category: string;
};

export type UserProfile = {
  id: string;
  name: string;
  pinHash: string;
  theme: ThemeType;
  fidoCredential?: any | null; // Defined loosely to avoid TS compiler issues with WebAuthn API
  charts?: ChartConfig[];
  createdAt: string;
};

export type FoodModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  id: string | null;
  category: string;
  store: string;
  item: string;
  method: 'Debit/Cash' | 'Credit';
  price: string;
  date: string;
};

// --- CHARTS & DASHBOARD TYPES ---
export type ChartType = 'pie' | 'bar' | 'line';
export type ChartSource =
  | 'food'
  | 'outflows'
  | 'inflows'
  | 'netWorth'
  | 'inflows_trend'
  | 'outflows_trend'
  | 'food_trend'
  | 'savings_trend'
  | 'debt_trend'
  | 'goal_trend';

export type ChartConfig = { 
  id: string; 
  title: string; 
  type: ChartType; 
  source: ChartSource; 
  targetIds?: string[] 
};

export type ChartModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  id: string | null; // <--- ADDED: Required for editing
  title: string;
  type: ChartType;
  source: ChartSource;
  targetIds: string[]; // <--- FIXED: Must be a strictly initialized array, not optional
};

export type DeleteChartModalState = { 
  isOpen: boolean; 
  chartId: string; 
  chartTitle: string; 
};

// Visual Payload Types
export type ChartDataPoint = { label: string; value: number; color: string; percentage?: number };

export type LineChartDataset = { 
  label: string; 
  data: number[]; 
  color: string; 
};

export type LineChartData = { 
  labels: string[]; 
  datasets: LineChartDataset[]; 
  targetValue?: number; // <--- ADDED: Tells the UI where to draw the dotted goal line
};