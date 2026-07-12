"use client";

import { useState } from "react";
import { lessons, students, teachingAssignments } from "@/app/lib/placeholder-data";
import LiquidGlass from "../liquid-glass";

const START_HOUR = 8;
const END_HOUR = 22;
const HOUR_HEIGHT = 80;

const hours = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, index) => START_HOUR + index
);

function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function getStartOfWeek(date: Date) {
  const newDate = new Date(date);
  const day = newDate.getDay();

  // JS: Sunday = 0, Monday = 1, Tuesday = 2...
  const diff = day === 0 ? -6 : 1 - day;

  newDate.setDate(newDate.getDate() + diff);
  newDate.setHours(0, 0, 0, 0);

  return newDate;
}

function formatDateISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthTitle(date: Date) {
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatHour(hour: number) {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}

function timeStringToHour(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour + minute / 60;
}

function getLessonPosition(start: number, end: number) {
  const top = (start - START_HOUR) * HOUR_HEIGHT;
  const height = (end - start) * HOUR_HEIGHT;

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
}

export default function Calendar() {
  const [view, setView] = useState<"month" | "week" | "day">("week");

  const [weekStartDate, setWeekStartDate] = useState(
    getStartOfWeek(new Date())
  );

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStartDate, index);

    return {
      label: date.toLocaleString("en-US", { weekday: "short" }),
      date: date.getDate(),
      dateISO: formatDateISO(date),
    };
  });

  const todayISO = formatDateISO(new Date());

  return (
  <section className="flex h-full flex-col overflow-hidden rounded-[32px] border border-black/20 bg-white/30 p-8 shadow-none backdrop-blur-none">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-black">
            {getMonthTitle(weekStartDate)}
          </h1>

          <button
            onClick={() => setWeekStartDate(getStartOfWeek(new Date()))}
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Today
          </button>

          <button
            onClick={() =>
              setWeekStartDate((current) => addDays(current, -7))
            }
            className="text-2xl text-black"
          >
            ‹
          </button>

          <button
            onClick={() =>
              setWeekStartDate((current) => addDays(current, 7))
            }
            className="text-2xl text-black"
          >
            ›
          </button>
        </div>

        <LiquidGlass
          className="rounded-2xl"
          strength={12}
        >
          <div className="flex p-1">
            {(["month", "week", "day"] as const).map((item) => {
              const isActive = view === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setView(item)}
                  className={`rounded-xl border px-8 py-2 text-sm capitalize
                    focus:outline-none
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-white/80
                    transition-[background-color,border-color,color,box-shadow]
                    duration-150
                    ${
                      isActive
                        ? "border-white/90 bg-white/65 text-black"
                        : "border-transparent bg-transparent text-black/50 hover:bg-white/10 hover:text-black"
                    }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </LiquidGlass>
      </header>

        <div className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-black/10 bg-white/25 p-6 shadow-lg backdrop-blur-md">
        {/* Top date row */}
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: "72px repeat(7, minmax(0, 1fr))",
          }}
        >
          <div className="flex items-center text-sm text-black/60">
            GMT +8
          </div>

          {weekDays.map((day) => {
            const isToday = day.dateISO === todayISO;

            return (
              <LiquidGlass
                key={day.dateISO}
                className="w-full rounded-2xl"
                strength={12}
                interactive
              >
                <button
                  type="button"
                  className={`flex w-full items-center justify-center gap-1 rounded-2xl px-4 py-4 ${
                    isToday
                      ? "bg-white/15 text-[#7F00FF]"
                      : "bg-transparent text-black"
                  }`}
                >
                  <span className="text-sm leading-none">
                    {day.label}
                  </span>

                  <span className="text-3xl font-bold leading-none">
                    {day.date}
                  </span>
                </button>
              </LiquidGlass>
            );
          })}
        </div>

        {/* Lower time grid */}
        <div
          className="mt-4 grid min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2"
          style={{
            gridTemplateColumns: "72px repeat(7, minmax(0, 1fr))",
          }}
        >
          {/* Left time labels */}
          <div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-20 border-t border-black/15 pt-2 text-sm text-black/60"
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Seven day columns */}
          {weekDays.map((day) => (
            <div key={day.dateISO} className="relative border-l border-black/15">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-20 border-t border-black/15"
                />
              ))}

              {lessons
                .filter((lesson) => lesson.date === day.dateISO)
                .map((lesson) => {
                  const assignment = teachingAssignments.find(
                    (assignment) => assignment.id === lesson.assignmentId
                  );

                  const student = students.find(
                    (student) => student.id === assignment?.studentId
                  );

                  const start = timeStringToHour(lesson.startTime);
                  const end = timeStringToHour(lesson.endTime);

                  return (
                    <div
                      key={lesson.id}
                      className={`absolute left-2 right-2 rounded-xl p-3 text-sm font-medium text-white shadow-none ${lesson.color}`}
                      style={getLessonPosition(start, end)}
                    >
                      <p>
                        {assignment?.subject ?? "Unknown subject"} - {" "}
                        {student?.name ?? "Unknown student"}
                      </p>

                      <p className="mt-1 text-xs opacity-80">
                        {lesson.startTime} - {lesson.endTime}
                      </p>

                      <p className="mt-1 text-xs opacity-80">
                        {lesson.studentVerified
                          ? "Confirmed"
                          : "Pending confirmation"}
                      </p>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}