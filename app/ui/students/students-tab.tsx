"use client";

import { useEffect, useRef, useState } from "react";
import type { StudentCardData } from "@/app/lib/student-data";
import { useRouter } from "next/navigation";
import { addStudent } from "@/app/lib/actions/add-student";
import AddStudentForm from "./add-student-form";
import InvitationIndicator from "./invitation-indicator";

import {
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type ViewMode = "grid" | "row";

const VIEW_STORAGE_KEY = "tutorflow:students:view";

const avatarColours = [
  "bg-violet-100 text-violet-800",
  "bg-emerald-100 text-emerald-800",
  "bg-orange-100 text-orange-800",
  "bg-sky-100 text-sky-800",
  "bg-rose-100 text-rose-800",
];

function getAvatarColour(id: string) {
  const hash = Array.from(id).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );

  return avatarColours[hash % avatarColours.length];
}

function formatTime(time: string) {
  const [hourString, minute = "00"] = time.split(":");
  const hour = Number(hourString);

  if (!Number.isFinite(hour)) return time;

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute} ${period}`;
}

function formatDate(date: string) {
  const lessonDate = new Date(`${date}T00:00:00+08:00`);

  if (Number.isNaN(lessonDate.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Hong_Kong",
  }).format(lessonDate);
}

export default function StudentTab({
  studentCards,
}: {
  studentCards: StudentCardData[];
}) {
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const router = useRouter();

  const [addStudentNotice, setAddStudentNotice] = useState<{
    message: string;
    warning: boolean;
  } | null>(null);

  // Load the saved preference after hydration.
  useEffect(() => {
    try {
      const savedView = window.localStorage.getItem(VIEW_STORAGE_KEY);

      if (savedView === "grid" || savedView === "row") {
        setView(savedView);
      }
    } catch {
      // Grid remains available if browser storage is blocked.
    }
  }, []);

  function changeView(nextView: ViewMode) {
    setView(nextView);
    setOpenMenuId(null);

    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, nextView);
    } catch {
      // Switching views still works without persistence.
    }
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && openMenuId !== null) {
        menuButtonRef.current?.focus();
        setOpenMenuId(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuId]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (showAddStudentForm && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!showAddStudentForm && dialog?.open) {
      dialog.close();
    }
  }, [showAddStudentForm]);

  const searchTerm = query.trim().toLowerCase();

  const filteredStudents = studentCards.filter((student) =>
    [
      student.displayName,
      student.level,
      ...student.subjects,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm),
  );

  const isGrid = view === "grid";

  function openAddStudent() {
    setOpenMenuId(null);
    setShowAddStudentForm(true);
  }

  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Heading */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900">
              Students
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Your students, all in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddStudent}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            <PlusIcon aria-hidden="true" className="h-4 w-4" />
            Add student
          </button>
        </header>

        {addStudentNotice && (
          <div
            role="status"
            className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
              addStudentNotice.warning
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {addStudentNotice.message}
          </div>
        )}

        {/* Search and view toggle */}
        <div className="mb-10 mt-10 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="search"
              aria-label="Search students"
              placeholder="Search students..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpenMenuId(null);
              }}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
            />
          </div>

          <div
            role="group"
            aria-label="Student view"
            className="ml-auto flex shrink-0 gap-1 rounded-xl border border-zinc-200 p-1"
          >
            <button
              type="button"
              title="Grid view"
              aria-label="Grid view"
              aria-pressed={isGrid}
              onClick={() => changeView("grid")}
              className={`rounded-lg p-2 transition-colors ${
                isGrid
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700"
              }`}
            >
              <Squares2X2Icon aria-hidden="true" className="h-5 w-5" />
            </button>

            <button
              type="button"
              title="Row view"
              aria-label="Row view"
              aria-pressed={!isGrid}
              onClick={() => changeView("row")}
              className={`rounded-lg p-2 transition-colors ${
                !isGrid
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700"
              }`}
            >
              <ListBulletIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Empty states */}
        {studentCards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 px-6 py-20 text-center">
            <h2 className="text-lg font-medium text-zinc-800">
              Meet your first student
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Add a student to start organising your lessons.
            </p>

            <button
              type="button"
              onClick={openAddStudent}
              className="mt-5 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Add your first student
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="font-medium text-zinc-800">
              No matching students
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Try another name, level, or subject.
            </p>

            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 text-sm underline underline-offset-4"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div
            className={
              isGrid
                ? "grid grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-6"
                : "flex flex-col gap-3"
            }
          >
            {filteredStudents.map((card) => {
              const menuOpen = openMenuId === card.connectionId;

              return (
                <article
                  key={card.connectionId}
                  className={`relative rounded-3xl border ${
                    card.invitationState === "accepted" 
                    ? "border-solid border-zinc-200" 
                    : "border-dashed border-zinc-300"} 
                    bg-white transition-colors hover:border-zinc-300 ${
                    menuOpen ? "z-20" : "z-0"
                  } ${
                    isGrid
                      ? "flex min-h-[260px] flex-col p-6"
                      : "flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6"
                  }`}
                >
                  <div
                    className={
                      isGrid
                        ? ""
                        : "flex min-w-0 flex-1 items-center gap-4 pr-10 md:pr-0"
                    }
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-medium ${getAvatarColour(
                        card.connectionId,
                      )}`}
                    >
                      {card.displayName.trim().charAt(0).toUpperCase() || "?"}
                    </div>

                    <div className={`min-w-0 ${isGrid ? "mt-4" : ""}`}>
                      <h2 className="break-words text-xl font-medium tracking-tight text-zinc-900">
                        {card.displayName}
                      </h2>

                      {card.level && (
                        <p className="mt-1 text-sm text-zinc-500">
                          {card.level}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex flex-wrap gap-2 ${
                      isGrid
                        ? "mb-6 mt-4"
                        : "md:w-[25%] md:shrink-0"
                    }`}
                  >
                    {card.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`flex items-center gap-2.5 text-sm text-zinc-500 ${
                      isGrid
                        ? "mt-auto border-t border-zinc-100 pt-4"
                        : "border-t border-zinc-100 pt-3 md:w-[30%] md:shrink-0 md:border-0 md:pt-0"
                    }`}
                  >
                    <CalendarDaysIcon
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                    />

                    {card.nextLesson ? (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>{formatDate(card.nextLesson.date)}</span>
                        <span className="text-zinc-700">
                          {formatTime(card.nextLesson.startTime)}
                        </span>
                      </div>
                    ) : (
                      <span>No lesson scheduled</span>
                    )}
                  </div>

                  {/* Button and dropdown share the outside-click boundary. */}
                    <div
                      ref={menuOpen ? menuRef : null}
                      className={
                        isGrid
                          ? "absolute right-4 top-4"
                          : "absolute right-4 top-4 md:relative md:right-auto md:top-auto md:ml-auto"
                      }
                    > 
                    <div className="flex items-center gap-2">
                      <InvitationIndicator state={card.invitationState} />
                        <button
                          ref={menuOpen ? menuButtonRef : null}
                          type="button"
                          aria-label={`Actions for ${card.displayName}`}
                          aria-expanded={menuOpen}
                          onClick={() =>
                            setOpenMenuId(menuOpen ? null : card.connectionId)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"
                        >
                          <EllipsisHorizontalIcon
                            aria-hidden="true"
                            className="h-5 w-5"
                          />
                        </button>
                    </div>
                      {menuOpen && (
                        <div className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
                          <p className="px-3 py-2 text-xs text-zinc-400">
                            Actions coming soon
                          </p>

                          {["Rename", "Settings", "Remove student"].map(
                            (action) => (
                              <button
                                key={action}
                                type="button"
                                disabled
                                className="block w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-zinc-400"
                              >
                                {action}
                              </button>
                            ),
                          )}
                        </div>
                      )}
                    </div>

                </article>
              );
            })}

            {/* Extra add card appears only in unfiltered grid view. */}
            {isGrid && !searchTerm && (
              <button
                type="button"
                onClick={openAddStudent}
                className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 p-6 text-center transition-colors hover:border-zinc-400 hover:bg-zinc-50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-500">
                  <PlusIcon aria-hidden="true" className="h-5 w-5" />
                </span>

                <span className="mt-4 text-lg font-medium text-zinc-800">
                  Add a student
                </span>

                <span className="mt-2 text-sm text-zinc-400">
                  Start a new learning journey
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Native dialog handles focus trapping and Escape. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="add-student-title"
        onClose={() => setShowAddStudentForm(false)}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-xl backdrop:bg-black/20"
      >
        {showAddStudentForm && (
          <>
            <div className="flex items-center justify-between px-6 pt-5">
              <h2 id="add-student-title" className="text-lg font-medium">
                Add student
              </h2>

              <button
                type="button"
                aria-label="Close add student form"
                onClick={() => setShowAddStudentForm(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <XMarkIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center">
              <AddStudentForm
                onCancel={() => setShowAddStudentForm(false)}
                onSave={async (data) => {
                  const result = await addStudent(data);

                  if (!result.success) {
                    throw new Error(result.error);
                  }

                  router.refresh();
                }}
              />
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}