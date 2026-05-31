// Helper to get the last literal day of a given month
export const getLastDayOfMonth = (year: number, month: number): Date => {
  return new Date(year, month, 0); // Day 0 of the next month is the last day of this month
};

// Calculates the "Last Working Day" (shifts backward if the last day is a weekend)
export const getLastWorkingDayOfMonth = (year: number, month: number): Date => {
  const lastDay = getLastDayOfMonth(year, month);
  const dayOfWeek = lastDay.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  
  if (dayOfWeek === 6) { // It's Saturday
    lastDay.setDate(lastDay.getDate() - 1); // Move back to Friday
  } else if (dayOfWeek === 0) { // It's Sunday
    lastDay.setDate(lastDay.getDate() - 2); // Move back to Friday
  }
  return lastDay;
};

// Calculates the "Last Working Friday" of a month
export const getLastWorkingFridayOfMonth = (year: number, month: number): Date => {
  const lastDay = getLastDayOfMonth(year, month);
  while (lastDay.getDay() !== 5) { // Keep stepping back until it's Friday (5)
    lastDay.setDate(lastDay.getDate() - 1);
  }
  return lastDay;
};

// Grabs an array of every single Friday in a given month (for Weekly checks)
export const getFridaysOfMonth = (year: number, month: number): Date[] => {
  const fridays: Date[] = [];
  const date = new Date(year, month - 1, 1);
  
  while (date.getDay() !== 5) {
    date.setDate(date.getDate() + 1);
  }
  
  while (date.getMonth() === month - 1) {
    fridays.push(new Date(date));
    date.setDate(date.getDate() + 7);
  }
  return fridays;
};

// Filters the Fridays for Fortnightly pay depending on their chosen start week
export const getFortnightlyFridays = (year: number, month: number, startWeek: number): Date[] => {
  const allFridays = getFridaysOfMonth(year, month);
  // If startWeek is 1, take index 0, 2, 4. If startWeek is 2, take index 1, 3.
  return allFridays.filter((_, index) => (index % 2) === (startWeek === 1 ? 0 : 1));
};