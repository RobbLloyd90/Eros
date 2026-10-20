import {getLastDayOfMonth} from "../../src/utils/dataEngine";
// Test plan for src/utils/dataEngine.ts
// Pure date/math functions -- no mocking needed, highest-value unit test target in the app.

// getLastDayOfMonth(year, month)
// - returns 31 for a 31-day month (e.g. Aug), 30 for a 30-day month (e.g. Apr)
// - returns 28 for February in a non-leap year, 29 in a leap year (e.g. 2028)


describe("getLastDayOfMonth returns the day before the last day of the month by 1 hour", () => {

    it("returns the day before the last day of the month", () => {
        const lastDayOfAugust = getLastDayOfMonth(1990, 8)
        const dateToMatch = new Date(1990, 8, 0)
        expect(lastDayOfAugust).toEqual(dateToMatch)
    })

    it("returns the 29th of Feburary during a leap year", () => {
        const leapYearDate = getLastDayOfMonth(1992, 2)
        const dateToMatch = new Date(1992, 2, 0)
        expect(leapYearDate).toEqual(dateToMatch)
    })

    it("doest not return the 29th of Febuary during a non leap year", () =>{
        const nonLeapYearDate = getLastDayOfMonth(1992, 2)
        const dateToMatch = new Date(1990, 2, 0)
        expect(nonLeapYearDate).not.toEqual(dateToMatch)
    })
})


// calculateMonthlySavingsInterest(currentBalance, interestRatePercent)
// - standard case: balance * (rate/100) / 12
// - work out interest over a period a month in days this could be 28 to 35 days
// - Does the user need to input how many days till the next?
// - Do we calculate based off their next pay check if they have a reoccuring salary
// - Do  
// - zero balance returns 0
// - zero interest rate returns 0

describe("calcuateMpnthlySavingsInterest", () => {

    it("",() => {

    })
})

// getDaysBetweenDates(startDate, endDate)
// - returns 0 when startDate or endDate is an empty string
// - returns correct whole-day count between two valid YYYY-MM-DD dates
// - returns a negative number when endDate is before startDate (confirm this is intended, since
//   calculateDailyDebtInterest() consumes this value directly)

// FALLBACK_DEBT_ACCRUAL_DAYS
// - sanity check the exported constant equals 30

// addOneMonthPreservingCadence(dateStr)
// - a normal mid-month date (e.g. 2026-05-15) advances to the same day next month
// - the last day of a 31-day month (e.g. 2026-08-31) advances to the last day of the next
//   30-day month (2026-09-30), NOT clamped to the 31st
// - last day of Feb in a non-leap year (2026-02-28) advances to 2026-03-31, not day 28
// - Feb 29th in a leap year (2028-02-29) advances correctly to 2028-03-29 or last-day logic

// calculateDailyDebtInterest(remainingBalance, interestRatePercent, days)
// - standard case: balance * (rate/100/365) * days
// - zero days returns 0
// - zero balance returns 0

// getLastWorkingDayOfMonth(year, month)
// - month ending on a weekday returns that day unchanged
// - month ending on a Saturday rolls back one day to Friday
// - month ending on a Sunday rolls back two days to Friday

// getLastWorkingFridayOfMonth(year, month)
// - steps backward from the last day of the month until it lands on a Friday
// - returns the last day itself if the last day of the month already IS a Friday

// getFridaysOfMonth(year, month)
// - returns every Friday in the given month in ascending order
// - correctly includes a Friday that falls on the 1st or last day of the month

// getFortnightlyFridays(year, month, startWeek)
// - startWeek === 1 returns Fridays at index 0, 2, 4 (1st, 3rd, 5th Friday)
// - startWeek === 2 returns Fridays at index 1, 3 (2nd, 4th Friday)
// - a month with only 4 Fridays still returns the correct subset for both start weeks
