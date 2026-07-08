"use client";

import { useState } from "react";
import { lessons, students } from "@/app/lib/placeholder-data";

const START_HOUR = 8;
const END_HOUR = 22;
const HOUR_HEIGHT = 80;

const hours = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, index) => START_HOUR + index
);

const weekDays = [
  { label: "Mon", date: 6, dateISO: "2026-07-06" },
  { label: "Tue", date: 7, dateISO: "2026-07-07" },
  { label: "Wed", date: 8, dateISO: "2026-07-08" },
  { label: "Thu", date: 9, dateISO: "2026-07-09" },
  { label: "Fri", date: 10, dateISO: "2026-07-10" },
  { label: "Sat", date: 11, dateISO: "2026-07-11" },
  { label: "Sun", date: 12, dateISO: "2026-07-12" },
];

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

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#F6E7D8_0%,#D9B08C_50%,#A76F5A_100%)] p-8">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-black">July 2026</h1>

          <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
            Today
          </button>

          <button className="text-2xl text-black">‹</button>
          <button className="text-2xl text-black">›</button>
        </div>

        <div className="flex rounded-2xl border border-white/30 bg-white/20 p-1 shadow-lg backdrop-blur-md">
          {["month", "week", "day"].map((item) => (
            <button
              key={item}
              onClick={() => setView(item as "month" | "week" | "day")}
              className={`rounded-xl px-8 py-2 text-sm font-medium capitalize transition ${
                view === item
                  ? "bg-white/70 text-black shadow-md backdrop-blur-md"
                  : "text-black/60 hover:bg-white/30 hover:text-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col rounded-[28px] p-6">
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

          {weekDays.map((day) => (
            <button
              key={day.date}
              className={`flex items-center justify-center gap-1 rounded-2xl border border-white/30 bg-white/20 p-1 px-4 py-4 text-sm shadow-lg backdrop-blur-md transition ${
                day.dateISO === "2026-07-07"
                  ? "bg-white/70 text-purple-400"
                  : "bg-black text-black delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              }`}
            >
              <span className="text-sm leading-none">{day.label}</span>
              <span className="text-3xl font-bold leading-none">
                {day.date}
              </span>
            </button>
          ))}
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
            <div key={day.date} className="relative border-l border-black/15">
              {/* hour grid cells */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-20 border-t border-black/15"
                />
              ))}

              {/* lesson cards */}
              {lessons
                .filter((lesson) => lesson.date === day.dateISO)
                .map((lesson) => {
                  const student = students.find(
                    (student) => student.id === lesson.studentId
                  );

                  const start = timeStringToHour(lesson.startTime);
                  const end = timeStringToHour(lesson.endTime);

                  return (
                    <div
                      key={lesson.id}
                      className={`absolute left-2 right-2 rounded-xl p-3 text-sm font-medium text-white shadow-md ${lesson.color}`}
                      style={getLessonPosition(start, end)}
                    >
                      <p>
                        {lesson.subject} -{" "}
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