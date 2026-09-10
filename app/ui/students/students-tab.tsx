"use client"

import type { StudentCardData } from "@/app/lib/student-data";
import { getStudentCards } from "@/app/lib/student-data";

import Search from "./search";
import LiquidGlass from "../liquid-glass";
import AddStudentForm from "./add-student-form";
import { useState, useRef, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";


function formatTime(time: string) {
  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);
  const period = hour >= 12 ? "p.m." : "a.m.";
  const hour12 = hour % 12 || 12;
  return minute === "00"
    ? `${hour12} ${period}`
    : `${hour12}:${minute} ${period}`
}

function formatDate(date: string) {
  const lessonDate = new Date(`${date}T00:00:00+08:00`);

  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    timeZone: "Asia/Hong_Kong",
  }).format(lessonDate);

  const dayMonth = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Hong_Kong",
  }).format(lessonDate);

  return `${weekday}, ${dayMonth}`;
}


export default function StudentTab({
  studentCards,
}: {
  studentCards: StudentCardData[];
}) {

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-3">
        {/* Search bar and add button*/}
        <div className="min-w-0 flex-1">
          <Search />
        </div>

        <button
          type="button"
          aria-label="Add student"
          title="Add student"
          className="flex border transition-colors duration-150 ease-in-out border-black h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xl font-semibold text-white transition-colors hover:bg-transparent hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          onClick={() => setShowAddStudentForm(true)}
        >
          <span className="-translate-y-[1px]"> + </span>
        </button>
      </div>
      {/* Student Preview */}
      {studentCards.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          {/* Text and arrow pointing toward + button */}
          <div className="absolute right-15 top-28 flex items-end gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-black/40">
                Add your first student
              </p>
            </div>

            <svg
              viewBox="0 0 100 100"
              className="h-20 w-24"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="3"
                  orient="auto"
                >
                  <path
                    d="M0,0 L0,6 L7,3 Z"
                    fill="currentColor"
                  />
                </marker>
              </defs>

              <path
                d="M10 90 C45 80, 75 55, 88 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="5 5"
                markerEnd="url(#arrowhead)"
                className="text-black/40"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {studentCards.map((card) => (
            <div
              key={card.connectionId}
              className={`relative ${openMenuId === card.connectionId ? "z-50" : "z-0"
                }`}>
              <LiquidGlass className="rounded-2xl items-center overflow-visible"
                key={card.connectionId}>
                <article className="flex items-center w-full h-20 p-3 gap-3 group">
                  <div className="flex rounded-full bg-white h-10 w-10 justify-center items-center"
                    style={{
                      color: card.cardColor
                    }}>
                    {card.displayName[0]}
                  </div>
                  <div>
                    <p className="text-base">
                      {card.displayName}
                    </p>
                    <p className="text-xs">
                      {card.level}  {card.subjects}
                    </p>
                  </div>
                  {card.nextLesson === null ? (
                    <p className="text-red-400 p-5">
                      No upcoming lesson
                    </p>
                  ) : (
                    <div className="flex items-center justify-center p-5">
                      Next lesson: {formatTime(card.nextLesson.startTime)}{" · "}{formatDate(card.nextLesson.date)}
                    </div>
                  )}
                  <div className="ml-auto flex items-center gap-5">
                    <div
                      className="
                      flex items-center gap-3
                      text-ml
                      opacity-0
                      pointer-events-none
                      transition-opacity duration-150
                      group-hover:opacity-100
                      group-hover:pointer-events-auto
                      group-focus-within:opacity-100
                      group-focus-within:pointer-events-auto
                    "
                    >
                      <button className="text-black/80 opacity-0 group-hover:opacity-100">
                        Prepare
                      </button>
                      <span className="text-black/30 opacity-0 group-hover:opacity-100"> / </span>
                      <button className="text-black/80 opacity-0 group-hover:opacity-100">
                        Logs
                      </button>
                    </div>
                    <div
                      ref={
                        openMenuId === card.connectionId
                          ? menuRef
                          : null
                      }
                      className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === card.connectionId
                              ? null
                              : card.connectionId
                          )
                        }
                        className="cursor-pointer flex items-center justify-center">
                        <EllipsisVerticalIcon className="h-7 w-7" />
                      </button>
                    </div>
                    {openMenuId === card.connectionId && (
                      <div className="absolute right-10 -top-3 z-20 w-40 p-1 rounded-xl bg-white">
                        <button className="w-full whitespace-nowrap rounded-lg px-5 py-2 text-left text-sm hover:bg-black/5">
                          Rename
                        </button>
                        <button className="w-full whitespace-nowrap rounded-lg px-5 py-2 text-left text-sm hover:bg-black/5">
                          Setting
                        </button>
                        <button className="w-full whitespace-nowrap rounded-lg px-5 py-2 text-red-400 text-left text-sm hover:bg-black/5">
                          Remove student
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              </LiquidGlass>
            </div>
          ))}

        </div>
      )}
      {showAddStudentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AddStudentForm
            onCancel={() => setShowAddStudentForm(false)}
          />
        </div>
      )}
    </div>
  )
}