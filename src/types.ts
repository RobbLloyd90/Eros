export type RecurringFrequency = 'weekly' | 'fortnightly' | 'monthly_last_friday' | 'monthly_last_day';

export type RecurringProfile = {
  frequency: RecurringFrequency;
  fortnightStartWeek?: 1 | 2; // Which week does their fortnightly cycle begin?
};

export type ExpenseTag = 'fixed' | 'fluid';
export type PaymentMethod = 'Debit/Cash' | 'Credit';
// Presets shown in the food-category picker; the UI also allows a free-typed custom category.
export type SavingsCategory = 'Stocks/Shares' | 'Lifetime ISA' | 'Digital Regular Saver' | 'Savings Account' | 'Pension';

// Inflow/outflow entries only. Savings and debt have their own dedicated shapes below.
export type Entry = {
  id: string;
  name: string;
  tag?: ExpenseTag;
  category?: string;

  // --- Recurring Engine Fields ---
  isRecurring?: boolean;
  recurringProfile?: RecurringProfile;

  expected?: number;
  actual?: number;
};

export type SavingsEntry = {
  id: string;
  name: string;
  category?: SavingsCategory;
  currentBalance?: number;
  contribution?: number;
  interestRate?: number;
  interestEarned?: number;
  // Carries the same contribution amount forward into next month when true (see savings carryover engine).
  isRecurringContribution?: boolean;
  // When true, `interestEarned` is auto-calculated from currentBalance * interestRate instead of being manually entered.
  isFixedInterestRate?: boolean;
};

export type DebtEntry = {
  id: string;
  name: string;
  currentBalance?: number;
  interestRate?: number;
  minimumPayment?: number;
  actualPayment?: number;
  interestAccrued?: number;
  // Date of the most recently recorded payment; the gap to the next payment date drives the daily interest calc.
  // Debt interest is always calculated from the fixed APR (no manual-entry toggle, unlike savings).
  paymentDate?: string;
};

// A goal can pull from multiple savings accounts (e.g. a house deposit fed by a LISA + a regular savings account);
// the saved amount is computed on demand from `linkedSavings`, not cached on the goal itself.
export type Goal = { id: string; name: string; targetAmount: number; targetDate: string; linkedSavings: string[] };

export type FoodEntry = {
  id: string;
  category: string;
  store: string;
  item: string;
  method: PaymentMethod;
  price: number;
  date: string;
};

export type BladeData = { inflows: Entry[]; outflows: Entry[]; savings: SavingsEntry[]; debt: DebtEntry[] };
export type MonthlyLedger = {
  data: BladeData;
  goals: Goal[];
  food: FoodEntry[];
  // Ids explicitly removed as of this month; carryover effects must never re-inject these,
  // even though an earlier month may still have them (kept there for historical record).
  removedIds?: string[];
};
export type GlobalLedger = Record<string, MonthlyLedger>;

export type ThemeType = 'bondi' | 'cybercore' | 'softtech' | 'aero_g3' | 'nothing_os' | 'nothing_glow';

export type ModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  isGoal: boolean;
  bladeId: 'inflows' | 'outflows' | 'savings' | 'debt' | 'goals';
  id: string | null;
  name: string;
  tag: ExpenseTag;
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
  
  // --- NEW: Safe Modal States for UI toggles ---
  isRecurring?: boolean;
  recurringFreq?: string;
  fortnightStartWeek?: number;

  // --- Savings-specific toggles ---
  isRecurringContribution?: boolean;
  isFixedInterestRate?: boolean;

  // --- Debt-specific fields ---
  paymentDate?: string;
  // Snapshot of the entry's paymentDate as it was when the modal opened; used to compute days elapsed once the user picks a new paymentDate. Not persisted.
  previousPaymentDate?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  pinHash: string;
  theme: ThemeType;
  fidoCredential?: any | null; 
  charts?: ChartConfig[];
  createdAt: string;
};

// Full backup/restore payload for a single user profile, downloadable as JSON from Settings.
// pinHash is exported (not the raw PIN, which is never stored), so the same PIN works after restore.
export type ExportedUserData = {
  version: 1;
  exportedAt: string;
  profile: UserProfile;
  ledger: GlobalLedger;
};

export type FoodModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  id: string | null;
  category: string;
  store: string;
  item: string;
  method: PaymentMethod;
  price: string;
  date: string;
};


export type ChartType = 'pie' | 'bar' | 'line';
export type ChartSource = 'food' | 'outflows' | 'inflows' | 'netWorth' | 'inflows_trend' | 'outflows_trend' | 'food_trend' | 'savings_trend' | 'debt_trend' | 'goal_trend';

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
  id: string | null; 
  title: string;
  type: ChartType;
  source: ChartSource;
  targetIds: string[]; 
};

export type DeleteChartModalState = { 
  isOpen: boolean; 
  chartId: string; 
  chartTitle: string; 
};

export type DeleteGoalModalState = {
  isOpen: boolean;
  goalId: string;
  goalName: string;
};

export type ChartDataPoint = { label: string; value: number; color: string; percentage?: number };
export type LineChartDataset = { label: string; data: number[]; color: string; };
export type LineChartData = { labels: string[]; datasets: LineChartDataset[]; targetValue?: number; };

export type PrivacyMode = 'off' | 'on' | 'blurred';
export type PrivacySettings = { savings: PrivacyMode; credit: PrivacyMode; };