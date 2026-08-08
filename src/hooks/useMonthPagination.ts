import { useState } from 'react';
import type { PanInfo } from 'framer-motion';

const SWIPE_CONFIDENCE_THRESHOLD = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

export const swipeVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 300 : -300, opacity: 0 })
};

/** Shared month-to-month swipe/pagination behaviour used by MonthLedger and FoodView. */
export function useMonthPagination(
  currentMonth: number,
  currentYear: number,
  setCurrentMonth: (m: number) => void,
  setCurrentYear: (y: number) => void,
  onPaginate?: () => void
) {
  const [swipeDirection, setSwipeDirection] = useState(0);

  const paginateMonth = (newDirection: number) => {
    setSwipeDirection(newDirection);
    let nextMonth = currentMonth + newDirection;
    let nextYear = currentYear;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    } else if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    }
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
    onPaginate?.();
  };

  const handleDragEnd = (_e: unknown, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) paginateMonth(1);
    else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) paginateMonth(-1);
  };

  return { swipeDirection, swipeVariants, paginateMonth, handleDragEnd };
}
