import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import MiniCalendar from "@/app/ui/dashboard/mini-calendar";
import { getStudentCards } from "@/app/lib/student-data";

const sampleLessons = [
  {
    id: "sample-1",
    weekday: "FRI",
    day: "6",
    subject: "Mathematics",
    student: "Alex",
    syllabus: "IGCSE",
    time: "6:00–7:30 PM",
    duration: "1.5 hours",
    status: "Confirmed",
  },
  {
    id: "sample-2",
    weekday: "SAT",
    day: "7",
    subject: "Physics",
    student: "Jamie",
    syllabus: "HKDSE",
    time: "2:00–3:30 PM",
    duration: "1.5 hours",
    status: "Change pending",
  },
  {
    id: "sample-3",
    weekday: "SUN",
    day: "8",
    subject: "Coding",
    student: "Chris",
    syllabus: "Python",
    time: "11:00 AM–12:30 PM",
    duration: "1.5 hours",
    status: "Confirmed",
  },
];

function StatusBadge({ status }: { status: string }) {
  const pending = status === "Change pending";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
        pending
          ? "bg-amber-50 text-amber-800"
          : "border border-black/10 bg-white text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const students = await getStudentCards();
  const hasStudents = students.length > 0;

  const profiles = await sql`
    SELECT name
    FROM users
    WHERE auth_user_id = ${session.user.id}
    LIMIT 1
  `;

  const name =
    profiles[0]?.name?.trim() ||
    session.user.name?.trim() ||
    "User";

  const now = new Date();
  const timeZone = "Asia/Hong_Kong";

  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const getPart = (type: string) =>
    dateParts.find((part) => part.type === type)?.value ?? "";

  const todayKey = `${getPart("year")}-${getPart("month")}-${getPart("day")}`;

  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(now),
  );

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";

  const nextLesson = sampleLessons[0];

  return (
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <header className="mb-8">
              <p className="text-sm text-gray-500">{dateLabel}</p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {greeting}, {name}
              </h1>

            </header>
            {!hasStudents ? (
              <section className="rounded-2xl border border-dashed border-black/20 px-6 py-12 text-center">
                <div className="mx-auto max-w-sm">
                  <h2 className="text-xl font-semibold">
                    Welcome to TutorFlow
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Add your first student to start organising your lessons.
                    Your upcoming lessons will appear here.
                  </p>

                  <Link
                    href="/dashboard/students"
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Add your first student
                  </Link>
                </div>
              </section>
            ) : (
              <>
            <section aria-labelledby="next-lesson-heading">
              <h2
                id="next-lesson-heading"
                className="mb-3 text-base font-medium"
              >
                Next lesson
              </h2>

              <div className="rounded-2xl border border-black/10 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Friday · {nextLesson.time}
                    </p>

                    <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
                      {nextLesson.subject} · {nextLesson.student}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {nextLesson.syllabus} · {nextLesson.duration}
                    </p>
                  </div>

                  <StatusBadge status={nextLesson.status} />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled
                    title="Available when real lesson data is connected"
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    View lesson
                  </button>

                  <button
                    type="button"
                    disabled
                    title="Available when real lesson data is connected"
                    className="rounded-xl border border-black/15 px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Propose change
                  </button>
                </div>
              </div>
            </section>

            <section
              aria-labelledby="week-lessons-heading"
              className="mt-8"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2
                  id="week-lessons-heading"
                  className="text-base font-medium"
                >
                  This week
                </h2>

                <Link
                  href="/dashboard/schedule"
                  className="text-sm text-gray-500 hover:text-black"
                >
                  View schedule →
                </Link>
              </div>

              <div className="space-y-3">
                {sampleLessons.map((lesson) => (
                  <article
                    key={lesson.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-black/10 p-4 sm:p-5"
                  >
                    <div className="w-10 shrink-0 text-center">
                      <p className="text-xs text-gray-500">
                        {lesson.weekday}
                      </p>
                      <p className="mt-1 text-xl font-semibold">
                        {lesson.day}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium">
                        {lesson.subject} · {lesson.student}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {lesson.time}
                      </p>
                    </div>

                    <StatusBadge status={lesson.status} />
                  </article>
                ))}
              </div>
            </section>
              </>
            )}

          </div>

          <aside className="space-y-6">
            <MiniCalendar todayKey={todayKey} />

            <section
              aria-labelledby="notifications-heading"
              className="rounded-2xl border border-black/10 p-5"
            >
              <h2
                id="notifications-heading"
                className="text-base font-semibold"
              >
                Notifications
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Lesson change requests and confirmations will appear here.
              </p>
            </section>
          </aside>
        </div>
      </div>
  );
}