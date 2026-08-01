"use client"

import {
  lessons,
  teachingAssignments,
  teacherStudentConnections,
  students,
} from "@/app/lib/placeholder-data";

import Search from "./search";

const teacherID = "user_teacher_11"

type StudentCardData = {
  connectionId: string;
  studentId: string;
  name: string;
  level: string;
  cardColor: string;
  assignments: {
    id: string;
    subject: string;
    defaultHourlyRate: number;
  }[];
};

export default function StudentTab(){
  const studentCards: StudentCardData[] = 
    teacherStudentConnections.filter(
      (connection) => connection.teacherId === teacherID && connection.status === "active"
    ).flatMap((connection) => {
      const student = students.find(
        (student) => student.id === connection.studentId
      );
      if (!student) {
        return [];
      }
      const studentAssignment = teachingAssignments.filter(
        (assignment) => assignment.connectionId === connection.id && assignment.status === "active"
      ).map(
        (assignment) => ({
          id: assignment.id,
          subject: assignment.subject,
          defaultHourlyRate: assignment.defaultHourlyRate
        })
      );
      return [
        {
          connectionId: connection.id,
          studentId: student.id,
          name: student.name,
          level: student.level,
          cardColor: connection.cardColor,
          assignments: studentAssignment,

        }
      ]}

    )
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
          className="flex border transition-colors duration-150 ease-in-out border-black h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xl font-semibold text-white transition-colors hover:bg-transparent hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
        >
         <span className="-translate-y-[1px]"> + </span> 
        </button>
        {/* Student Preview */}
        {studentCards.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            {/* Text and arrow pointing toward + button */}
            <div className="absolute right-18 top-25 flex items-end gap-2">
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
          <div>{/* Student cards */}</div>
        )}
      </div>
    </div>

)}