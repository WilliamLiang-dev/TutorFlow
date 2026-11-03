"use client";

import { useState } from "react";

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function MiniCalendar({
  todayKey,
}: {
  todayKey: string;
}) {
  const [year, month, day] = todayKey.split("-").map(Number);
  const today = new Date(year, month - 1, day);

  const [displayMonth, setDisplayMonth] = useState(
    () => new Date(year, month - 1, 1),
  );
  const [selectedDate, setSelectedDate] = useState(
    () => new Date(year, month - 1, day),
  );

  const firstWeekday = new Date(
    displayMonth.getFullYear(),
    displayMonth.getMonth(),
    1,
  ).getDay();

  const dates = Array.from({ length: 42 }, (_, index) => {
    return new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth(),
      index - firstWeekday + 1,
    );
  });

  function changeMonth(offset: number) {
    setDisplayMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + offset,
          1,
        ),
    );
  }

  return (
    <section
      aria-label="Mini calendar"
      className="rounded-2xl border border-black/10 bg-white p-5"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {displayMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl hover:bg-gray-100"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl hover:bg-gray-100"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
        {weekdays.map((weekday, index) => (
          <span key={index} className="pb-2 text-gray-500">
            {weekday}
          </span>
        ))}

        {dates.map((date) => {
          const selected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const inMonth = date.getMonth() === displayMonth.getMonth();

          return (
            <button
              key={date.getTime()}
              type="button"
              aria-label={date.toLocaleDateString("en-US", {
                dateStyle: "full",
              })}
              aria-pressed={selected}
              aria-current={isToday ? "date" : undefined}
              onClick={() => setSelectedDate(date)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                selected
                  ? "bg-blue-600 font-semibold text-white"
                  : isToday
                    ? "bg-blue-50 font-semibold text-blue-700 hover:bg-blue-100"
                    : inMonth
                      ? "text-gray-900 hover:bg-gray-100"
                      : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
        <button
          type="button"
          onClick={() => {
            setDisplayMonth(new Date(year, month - 1, 1));
            setSelectedDate(new Date(year, month - 1, day));
          }}
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          Today
        </button>

        <a
          href={`/dashboard/schedule?date=${selectedDate.getFullYear()}-${String(
            selectedDate.getMonth() + 1,
          ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View schedule →
        </a>
      </div>
    </section>
  );
}