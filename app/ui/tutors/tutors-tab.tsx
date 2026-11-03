"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { TutorCardData } from "@/app/lib/tutor-data";
import { updateTutorNickname } from "@/app/lib/actions/update-tutor-nickname";

type ViewMode = "grid" | "row";

const VIEW_STORAGE_KEY = "tutorflow:tutors:view";

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

  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatDate(date: string) {
  const value = new Date(`${date}T00:00:00+08:00`);

  if (Number.isNaN(value.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Hong_Kong",
  }).format(value);
}

export default function TutorsTab({
  tutorCards,
}: {
  tutorCards: TutorCardData[];
}) {
  const router = useRouter();

  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [editingTutor, setEditingTutor] =
    useState<TutorCardData | null>(null);
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY);

      if (saved === "grid" || saved === "row") {
        setView(saved);
      }
    } catch {
      // Grid is the default when storage is unavailable.
    }
  }, []);

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

    if (editingTutor && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!editingTutor && dialog?.open) {
      dialog.close();
    }
  }, [editingTutor]);

  function changeView(nextView: ViewMode) {
    setView(nextView);
    setOpenMenuId(null);

    try {
      localStorage.setItem(VIEW_STORAGE_KEY, nextView);
    } catch {
      // View switching still works without storage.
    }
  }

  function editNickname(tutor: TutorCardData) {
    setNickname(tutor.nickname ?? "");
    setError("");
    setOpenMenuId(null);
    setEditingTutor(tutor);
  }

  function closeEditor() {
    if (savingRef.current) return;
    setEditingTutor(null);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingTutor || savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    setError("");

    try {
      const result = await updateTutorNickname(
        editingTutor.connectionId,
        nickname,
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setEditingTutor(null);
      router.refresh();
    } catch {
      setError("Could not save the nickname. Please try again.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  const searchTerm = query.trim().toLowerCase();
  const isGrid = view === "grid";

  const filteredTutors = tutorCards.filter((tutor) =>
    [
      tutor.displayName,
      tutor.nickname ?? "",
      ...tutor.subjects,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm),
  );

  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="mx-auto max-w-[1440px]">
        <header>
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900">
            Tutors
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Your tutors, all in one place.
          </p>
        </header>

        <div className="mb-10 mt-10 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="search"
              aria-label="Search tutors"
              placeholder="Search tutors..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpenMenuId(null);
              }}
              className="h-11 w-full rounded-xl border border-zinc-200
                bg-white pl-11 pr-4 text-sm outline-none
                placeholder:text-zinc-400 focus:border-zinc-400"
            />
          </div>

          <div
            role="group"
            aria-label="Tutor view"
            className="ml-auto flex shrink-0 gap-1 rounded-xl border border-zinc-200 p-1"
          >
            {(["grid", "row"] as const).map((mode) => {
              const Icon =
                mode === "grid" ? Squares2X2Icon : ListBulletIcon;

              return (
                <button
                  key={mode}
                  type="button"
                  title={`${mode === "grid" ? "Grid" : "Row"} view`}
                  aria-label={`${mode === "grid" ? "Grid" : "Row"} view`}
                  aria-pressed={view === mode}
                  onClick={() => changeView(mode)}
                  className={`rounded-lg p-2 transition-colors
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-zinc-400 ${
                      view === mode
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700"
                    }`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </div>

        {tutorCards.length === 0 ? (
          <section className="rounded-3xl border border-zinc-200 px-6 py-20 text-center">
            <h2 className="text-lg font-medium text-zinc-800">
              Your tutors will appear here
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Accept your tutor’s invitation using your TutorFlow
              account to connect with them.
            </p>
          </section>
        ) : filteredTutors.length === 0 ? (
          <section className="py-20 text-center">
            <h2 className="font-medium text-zinc-800">
              No matching tutors
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Try another name, nickname, or subject.
            </p>

            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 text-sm underline underline-offset-4"
            >
              Clear search
            </button>
          </section>
        ) : (
          <div
            className={
              isGrid
                ? "grid grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-6"
                : "flex flex-col gap-3"
            }
          >
            {filteredTutors.map((card) => {
              const menuOpen = openMenuId === card.connectionId;
              const title = card.nickname || card.displayName;

              return (
                <article
                  key={card.connectionId}
                  className={`relative rounded-3xl border border-zinc-200
                    bg-white transition-colors hover:border-zinc-300
                    ${menuOpen ? "z-20" : "z-0"}
                    ${
                      isGrid
                        ? "flex min-h-[260px] flex-col p-6"
                        : "flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6"
                    }`}
                >
                  <div
                    className={
                      isGrid
                        ? "pr-8"
                        : "flex min-w-0 flex-1 items-center gap-4 pr-10 md:pr-0"
                    }
                  >
                    <div
                      aria-hidden="true"
                      className={`flex h-12 w-12 shrink-0 items-center
                        justify-center rounded-full text-xl font-medium
                        ${getAvatarColour(card.teacherId)}`}
                    >
                      {card.displayName.trim().charAt(0).toUpperCase() ||
                        "T"}
                    </div>

                    <div className={`min-w-0 ${isGrid ? "mt-4" : ""}`}>
                      <h2 className="break-words text-xl font-medium tracking-tight text-zinc-900">
                        {title}
                      </h2>

                      <p className="mt-1 break-words text-sm text-zinc-500">
                        {card.nickname ? card.displayName : "Tutor"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex flex-wrap gap-2 ${
                      isGrid ? "mb-6 mt-4" : "md:w-[25%] md:shrink-0"
                    }`}
                  >
                    {card.subjects.length > 0 ? (
                      card.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="max-w-full break-words rounded-full
                            bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                        >
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-zinc-400">
                        No subjects added yet
                      </span>
                    )}
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
                      <span>
                        {card.nextLesson === null
                          ? "No lesson scheduled"
                          : "Lesson schedule unavailable"}
                      </span>
                    )}
                  </div>

                  <div
                    ref={menuOpen ? menuRef : null}
                    className={
                      isGrid
                        ? "absolute right-4 top-4"
                        : "absolute right-4 top-4 md:relative md:right-auto md:top-auto md:ml-auto"
                    }
                  >
                    <button
                      ref={menuOpen ? menuButtonRef : null}
                      type="button"
                      aria-label={`Actions for ${title}`}
                      aria-expanded={menuOpen}
                      onClick={() =>
                        setOpenMenuId(menuOpen ? null : card.connectionId)
                      }
                      className="flex h-8 w-8 items-center justify-center
                        rounded-lg text-zinc-400 hover:bg-zinc-100
                        hover:text-zinc-800 focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-zinc-400"
                    >
                      <EllipsisHorizontalIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
                        <button
                          type="button"
                          onClick={() => editNickname(card)}
                          className="block w-full rounded-lg px-3 py-2
                            text-left text-sm text-zinc-700 hover:bg-zinc-100"
                        >
                          {card.nickname ? "Edit nickname" : "Set nickname"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="nickname-title"
        onCancel={(event) => {
          if (savingRef.current) event.preventDefault();
        }}
        onClose={() => setEditingTutor(null)}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)]
          max-w-md overflow-y-auto rounded-2xl border border-zinc-200
          bg-white p-6 text-zinc-900 shadow-xl backdrop:bg-black/20"
      >
        {editingTutor && (
          <>
            <div className="flex items-center justify-between gap-4">
              <h2 id="nickname-title" className="text-lg font-medium">
                Tutor nickname
              </h2>

              <button
                type="button"
                aria-label="Close nickname editor"
                disabled={saving}
                onClick={closeEditor}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100
                  disabled:opacity-50"
              >
                <XMarkIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Only you will see this nickname.
            </p>

            <form onSubmit={handleSave} className="mt-6">
              <fieldset disabled={saving}>

                <input
                  id="tutor-nickname"
                  type="text"
                  autoFocus
                  maxLength={100}
                  value={nickname}
                  placeholder={editingTutor.displayName}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error ? "nickname-help nickname-error" : "nickname-help"
                  }
                  className="mt-2 h-12 w-full rounded-xl border
                    border-zinc-200 px-4 text-sm outline-none
                    focus:border-zinc-400"
                />


                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNickname("");
                      setError("");
                    }}
                    className="text-sm text-zinc-500 underline underline-offset-4"
                  >
                    Reset name
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-zinc-900 px-5 py-2.5
                      text-sm font-medium text-white hover:bg-zinc-700
                      disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </fieldset>

              {error && (
                <p
                  id="nickname-error"
                  role="alert"
                  className="mt-4 text-sm text-red-600"
                >
                  {error}
                </p>
              )}
            </form>
          </>
        )}
      </dialog>
    </div>
  );
}