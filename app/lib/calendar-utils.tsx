export const START_HOUR = 8;
export const END_HOUR = 22;
export const HOUR_HEIGHT = 80;

export const hours = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, index) => START_HOUR + index
);

export type WeekDay = {
  label: string;
  date: number;
  dateISO: string;
};

export function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);

  return newDate;
}

export function getStartOfWeek(date: Date) {
  const newDate = new Date(date);
  const day = newDate.getDay();

  // JavaScript:
  // Sunday = 0
  // Monday = 1
  // Tuesday = 2
  const difference = day === 0 ? -6 : 1 - day;

  newDate.setDate(newDate.getDate() + difference);
  newDate.setHours(0, 0, 0, 0);

  return newDate;
}

export function formatDateISO(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMonthTitle(date: Date) {
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function createWeekDays(weekStartDate: Date): WeekDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStartDate, index);

    return {
      label: date.toLocaleString("en-US", {
        weekday: "short",
      }),
      date: date.getDate(),
      dateISO: formatDateISO(date),
    };
  });
}

export function formatHour(hour: number) {
  if (hour === 0) return "12:00 AM";

  if (hour < 12) {
    return `${hour}:00 AM`;
  }

  if (hour === 12) {
    return "12:00 PM";
  }

  return `${hour - 12}:00 PM`;
}

export function timeStringToHour(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  return hour + minute / 60;
}

export function getLessonPosition(start: number, end: number) {
  const top = (start - START_HOUR) * HOUR_HEIGHT;
  const height = (end - start) * HOUR_HEIGHT;

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
}