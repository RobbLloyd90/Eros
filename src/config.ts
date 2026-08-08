import type { GlobalLedger } from './types';

export const TAB_HEIGHT = 65;

export const BLADE_CONFIG = [
  {
    id: 'inflows',
    title: 'INCOMING',
    flavor: 'Lime',
    color: '#10b981',
    aeroSolid: '#10b981',
    aeroFrosted: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'outflows',
    title: 'OUTGOINGS',
    flavor: 'Strawberry',
    color: '#FF4D6D',
    aeroSolid: '#f43f5e',
    aeroFrosted: 'rgba(244, 63, 94, 0.15)'
  },
  {
    id: 'savings',
    title: 'SAVINGS',
    flavor: 'Bondi',
    color: '#00D2D3',
    aeroSolid: '#0ea5e9',
    aeroFrosted: 'rgba(14, 165, 233, 0.15)'
  },
  {
    id: 'goals',
    title: 'GOALS',
    flavor: 'Grape',
    color: '#9D4EDD',
    aeroSolid: '#a855f7',
    aeroFrosted: 'rgba(168, 85, 247, 0.15)'
  },
  {
    id: 'debt',
    title: 'CREDIT / DEBT',
    flavor: 'Tangerine',
    color: '#FF8833',
    aeroSolid: '#f97316',
    aeroFrosted: 'rgba(249, 115, 22, 0.15)'
  }
];

export const INITIAL_LEDGER: GlobalLedger = {
  '2026-05': {
    data: {
      inflows: [{ id: '1', name: 'Salary (Answer Digital)', expected: 1964.28, actual: 1861.7 }],
      outflows: [
        { id: '2', name: 'Housing Infrastructure (Rent)', expected: 287.5, actual: 287.5, tag: 'fixed' },
        { id: '3', name: 'Groceries & Supplies', expected: 200.0, actual: 261.03, tag: 'fluid' },
        { id: 'fluid-food', name: 'Food Budget', expected: 200.0, actual: 14.5, tag: 'fluid' }
      ],
      savings: [
        {
          id: 's1',
          name: 'Lifetime ISA (Tembo)',
          interestRate: 4.3,
          contribution: 100,
          currentBalance: 5102.37,
          interestEarned: 18.28
        },
        {
          id: 's2',
          name: 'Chase Liquid',
          interestRate: 4.1,
          contribution: 360,
          currentBalance: 1015.0,
          interestEarned: 3.46
        }
      ],
      debt: [
        {
          id: 'd1',
          name: 'Credit Card (Amex)',
          interestRate: 22.4,
          currentBalance: 1250.0,
          minimumPayment: 45.0,
          actualPayment: 150.0
        }
      ]
    },
    goals: [{ id: 'g1', name: 'House Deposit', targetAmount: 25000, targetDate: '2028-05', linkedSavings: ['s1'] }],
    food: [
      {
        id: 'f1',
        category: 'Coffee',
        store: 'Coffee Shop',
        item: 'Coffee Beans',
        method: 'Debit/Cash',
        price: 14.5,
        date: '2026-05-16'
      }
    ]
  }
};

export const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
