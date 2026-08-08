# Financial Engine & Data Architecture

## The Ledger State
The app relies on a persistent, zero-based, multi-month ledger architecture structured by keys (e.g., `2026-06`). 

## Rule of Segregated Mathematics
Never use a generic "interest rate" calculator. Financial vectors must use their correct mathematical engines:
1.  **Revolving Credit (Credit Cards, Klarna):** Daily compounding based on average daily balance.
2.  **Amortised Debt (Mortgages, Loans):** Front-loaded interest vs. principal split based on term length.
3.  **Compound Savings (AER/APY):** Tiered threshold limits and monthly/annual compounding.
4.  **Asset Tracking (Stocks, Pensions, ISAs):** Tracked via Unit Quantity * Unit Price + Dividend Yields. (Not interest).

## Engine Behaviours
*   **JIT Auto-Injector:** Do not bloat the database with 50 months of future recurring entries. Recurring entries are injected *Just-In-Time* when a user views a new month.
*   **Savings Rollover:** Savings accounts carry their structural identity (Name, Base Rate) forward, but `actualContribution` and `interestEarned` must reset to 0 in the new month to prevent tracking duplication.
*   **Future Cleanup:** If a recurring flag is disabled in the current month, the engine must iterate through `activeMonthKey > currentMonth` and purge the ghost entries.
*   **Dashboard Sync:** The Dashboard must NEVER calculate its own localized math. It must read strictly from the centralized `useLedgerData` output (e.g., `netMargin` and aggregated `foodTotal`).