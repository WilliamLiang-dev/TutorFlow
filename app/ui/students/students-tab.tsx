"use client";

import { useState } from "react";
import {
  students,
  teachers,
  teacherStudents,
  lessons,
} from "@/app/lib/placeholder-data";

function getLessonStatusLabel(teacherVerified: boolean, studentVerified: boolean) {
  if (teacherVerified && studentVerified) return "Confirmed";
  if (teacherVerified && !studentVerified) return "Waiting for student";
  if (!teacherVerified && studentVerified) return "Waiting for teacher";
  return "Not verified";
}

export default function StudentsTabs() {
  const [activeStudentId, setActiveStudentId] = useState(students[0].id);

  const activeStudent = students.find(
    (student) => student.id === activeStudentId
  );

  if (!activeStudent) return null;

  const activeStudentLessons = lessons.filter(
    (lesson) => lesson.studentId === activeStudent.id
  );

  const activeTeacherIds = teacherStudents
    .filter((relation) => relation.studentId === activeStudent.id)
    .map((relation) => relation.teacherId);

  const activeTeachers = teachers.filter((teacher) =>
    activeTeacherIds.includes(teacher.id)
  );

  const confirmedLessons = activeStudentLessons.filter(
    (lesson) => lesson.teacherVerified && lesson.studentVerified
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Folder tabs */}
      <div className="flex shrink-0 items-end gap-2 overflow-x-auto">
        {students.map((student) => {
          const isActive = student.id === activeStudentId;

          return (
            <button
              key={student.id}
              onClick={() => setActiveStudentId(student.id)}
              className={`relative min-w-40 rounded-t-[26px] border px-7 py-4 text-sm font-bold ${
                isActive
                ? "z-20 -mb-[2px] border-white/50 border-b-0 bg-white/45 text-black shadow-lg backdrop-blur-md"
                : "z-20 -mb-[2px] border-white/50 border-b-0 bg-[#ead7c6] text-black shadow-lg hover:bg-white/35 hover:text-black"
            }`}
            >
              {student.name}
            </button>
          );
        })}
      </div>

      {/* Glass folder body */}
      <main className="relative z-10 min-h-0 flex-1 overflow-y-auto border border-white/40 bg-white/35 p-6 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Student profile card */}
          <aside className="rounded-[26px] border border-white/45 bg-white/45 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl font-bold text-white shadow-md">
                {activeStudent.name.charAt(0)}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-black">
                  {activeStudent.name}
                </h2>
                <p className="text-sm font-medium text-black/55">
                  {activeStudent.level}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {activeStudent.subjects.map((subject) => (
                <span
                  key={subject}
                  className="rounded-full bg-black px-3 py-1 text-sm font-semibold text-white"
                >
                  {subject}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-white/45 p-4 text-sm text-black/70">
              <p>
                <span className="font-bold text-black">Email:</span>{" "}
                {activeStudent.email}
              </p>

              <p>
                <span className="font-bold text-black">Rate:</span> $
                {activeStudent.defaultHourlyRate}/hr
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/45 p-4 shadow-sm">
                <p className="text-2xl font-bold text-black">
                  {activeStudentLessons.length}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase text-black/50">
                  Lessons
                </p>
              </div>

              <div className="rounded-2xl bg-white/45 p-4 shadow-sm">
                <p className="text-2xl font-bold text-black">
                  {confirmedLessons.length}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase text-black/50">
                  Confirmed
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-black/50">
                Connected teachers
              </h3>

              <div className="mt-3 space-y-2">
                {activeTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="rounded-2xl border border-white/40 bg-white/45 px-4 py-3 text-sm text-black shadow-sm"
                  >
                    <p className="font-bold">{teacher.name}</p>
                    <p className="text-black/55">{teacher.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Lesson log card */}
          <section className="rounded-[26px] border border-white/45 bg-white/45 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/45">
                  Learning history
                </p>

                <h2 className="mt-1 text-3xl font-bold text-black">
                  Lesson Log
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {activeStudentLessons.map((lesson) => (
                <article
                  key={lesson.id}
                  className="rounded-[22px] border border-black/10 bg-white/60 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white/75 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-black">
                        {lesson.subject}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-black/55">
                        {lesson.date} · {lesson.startTime} - {lesson.endTime}
                      </p>
                    </div>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black shadow-sm">
                      {getLessonStatusLabel(
                        lesson.teacherVerified,
                        lesson.studentVerified
                      )}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-white/55 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-black/45">
                        Teacher comment
                      </p>
                      <p className="mt-2 text-sm leading-6 text-black/75">
                        {lesson.teacherComment || "No comment yet."}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/55 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-black/45">
                        Homework
                      </p>
                      <p className="mt-2 text-sm leading-6 text-black/75">
                        {lesson.homework || "No homework assigned."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        lesson.teacherVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-white/70 text-black/50"
                      }`}
                    >
                      Teacher verified
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        lesson.studentVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-white/70 text-black/50"
                      }`}
                    >
                      Student verified
                    </span>

                  </div>
                </article>
              ))}

              {activeStudentLessons.length === 0 && (
                <div className="rounded-[22px] bg-white/55 p-10 text-center text-black/50">
                  No lessons yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}