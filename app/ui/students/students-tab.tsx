"use client"

import {
  lessons,
  teachingAssignments,
  teacherStudentConnections,
  students,
} from "@/app/lib/placeholder-data";

import Search from "./search";
import { UserPlusIcon } from "@heroicons/react/24/outline";

const teacherID = "user_teacher_11"
export default function StudentTab(){
  const studentOfTeacher = teacherStudentConnections.filter(
    (teacher) => teacher.teacherId === teacherID
  );
  console.log(studentOfTeacher);


  return (
  <div className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        {/* Search bar and add button*/}
        <div className="min-w-0 flex-1">
          <Search />
        </div>

        <button
          type="button"
          aria-label="Add student"
          title="Add student"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xl font-semibold text-white transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
        >
         <span className="-translate-y-[1px]"> + </span> 
        </button>
        {/* Student Preview */}
        {studentOfTeacher.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            {/* Text and arrow pointing toward + button */}
            <div className="absolute right-18 top-25 flex items-end gap-2">
              <div className="pb-3 text-right">
                <p className="text-sm font-medium text-black/70">
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
                  d="
                      M0 80
                      C35 75, 60 65, 55 45
                      C50 25, 25 25, 30 43
                      C35 62, 72 48, 88 8
                    "
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
          <div>{/* Student cards */}</div>
        )}
      </div>
    </div>

)}