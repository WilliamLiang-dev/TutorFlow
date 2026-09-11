"use client";

import type { CalendarLesson } from "@/app/lib/calendar";

import {
  formatHour,
  getLessonPosition,
  getMonthTitle,
  hours,
  timeStringToHour,
} from "@/app/lib/calendar-utils";

import LiquidGlass from "../liquid-glass";
import { useCalendar } from "./use-calendar";
import { useState } from "react";

export default function Calendar({
  lessons,
}: {
  lessons: CalendarLesson[];
}) {
    const calendar = useCalendar();

    const {
    view,
    setView,
    weekStartDate,
    weekDays,
    todayISO,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
    } = calendar;

  return (
    <div className="flex h-full flex-col">
      {/* Calendar header */}
      <header className="mb-6 flex shrink-0 items-center justify-between">
        {/* Month title and navigation */}
        <div className="flex items-center gap-7">
          <h1 className="text-3xl font-bold text-black">
            {getMonthTitle(weekStartDate)}
          </h1>

          <button
            type="button"
            onClick={goToToday}
            className="rounded-full transition-color duration-100 ease-in-out border border-black bg-black px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 hover:bg-transparent hover:text-black"
          >
            Today
          </button>
        </div>

        {/* Month / Week / Day control */}
        <LiquidGlass className="rounded-2xl" strength={12}>
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
                        ? "border-white/90 bg-white/60 text-black font-regular"
                        : "border-transparent bg-transparent text-black/50 hover:bg-white/45 hover:text-black font-regular"
                    }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </LiquidGlass>
      </header>
      {/* Main calendar body */}
    <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="flex min-h-0 flex-1 cursor-grab select-none touch-pan-y flex-col rounded-[28px] border border-black/10 bg-white/25 p-6 shadow-lg backdrop-blur-md active:cursor-grabbing"
    >
      <button
        type="button"
        onClick={goToPreviousWeek}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label="Previous week"
        className="absolute -left-9 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-4xl text-black transition-transform duration-150 ease-in-out hover:scale-150 "
      >
        ‹
      </button>

      <button
        type="button"
        onClick={goToNextWeek}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label="Next week"
        className="absolute -right-9 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-4xl text-black transition-transform duration-150 ease-in-out hover:scale-150"
      >
        ›
      </button>
        <div
          className="grid pr-2"
          style={{
            gridTemplateColumns:
              "72px repeat(7, minmax(0, 1fr))",
          }}
        >
          <div className="flex items-center text-sm text-black/60">
            GMT +8
          </div>

          {weekDays.map((day) => {
            const isToday = day.dateISO === todayISO;

            return (
            <div key={day.dateISO} className="px-1">
              <LiquidGlass
                key={day.dateISO}
                className="w-full rounded-2xl"
                strength={12}
                interactive
              >
                <button
                  type="button"
                  className={`flex w-full items-center justify-center gap-1 rounded-2xl px-4 py-4
                    focus:outline-none
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-white/80
                    ${
                      isToday
                        ? "bg-white/20 text-[#7F00FF]"
                        : "bg-transparent text-black"
                    }`}
                >
                  <span className="text-sm leading-none">
                    {day.label}
                  </span>

                  <span className="text-3xl font-semibold leading-none">
                    {day.date}
                  </span>
                </button>
              </LiquidGlass>
            </div>
            );
          })}
        </div>

        {/* Scrollable time grid */}
        <div
          className="mt-4 grid min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2"
          style={{
            gridTemplateColumns:
              "72px repeat(7, minmax(0, 1fr))",
          }}
        >
          {/* Time labels */}
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

          {/* Seven weekday columns */}
          {weekDays.map((day) => {
            const lessonsForDay = lessons.filter(
              (lesson) => lesson.date === day.dateISO
            );

            return (
              <div
                key={day.dateISO}
                className="relative border-l border-black/15"
              >
                {/* Horizontal hour lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-20 border-t border-black/15"
                  />
                ))}

                {/* Lesson cards */}
                {lessonsForDay.map((lesson) => {
                  const start = timeStringToHour(lesson.startTime);
                  const end = timeStringToHour(lesson.endTime);

                  const isConfirmed =
                    lesson.teacherVerified && lesson.studentVerified;

                  return (
                    <article
                      key={lesson.id}
                      className="absolute left-2 right-2 overflow-hidden rounded-xl p-3 text-sm font-medium text-white"
                      style={{
                        ...getLessonPosition(start, end),
                        backgroundColor: lesson.cardColor,
                      }}
                    >
                      <p className="font-semibold">
                        {lesson.subject} – {lesson.studentName}
                      </p>

                      <p className="mt-1 text-xs opacity-80">
                        {lesson.startTime} – {lesson.endTime}
                      </p>

                      <p className="mt-1 text-xs opacity-80">
                        {isConfirmed ? "Confirmed" : "Pending confirmation"}
                      </p>
                    </article>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}