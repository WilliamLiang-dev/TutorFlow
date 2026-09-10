"use server"
import { sql } from "./db";

export type StudentCardData = {
  connectionId: string;
  studentId: string;
  displayName: string;
  level: string;
  avatarURL: string | null;
  cardColor: string;
  subjects: string[];
  nextLesson: {
    id: string;
    date: string;
    startTime: string;
  } | null;
};

export async function getStudentCards(): Promise<StudentCardData[]> {
  // Temporary access until authentication is implemented.
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.VERCEL
  ) {
    throw new Error("Teacher authentication is required.");
  }

  const teacherId = process.env.DEV_TEACHER_ID;

  if (!teacherId) {
    throw new Error("DEV_TEACHER_ID is missing.");
  }

  const result = await sql`
    SELECT
      connection.id AS "connectionId",
      student.id AS "studentId",
      student.name AS "displayName",
      COALESCE(student.level, '') AS level,
      NULL AS "avatarURL",
      connection.card_color AS "cardColor",

      ARRAY(
        SELECT DISTINCT assignment.subject
        FROM teaching_assignments AS assignment
        WHERE assignment.connection_id = connection.id
          AND assignment.status = 'active'
        ORDER BY assignment.subject
      ) AS subjects,

      NULL AS "nextLesson"

    FROM teacher_student_connections AS connection

    JOIN students AS student
      ON student.id = connection.student_id

    WHERE connection.teacher_id = ${teacherId}
      AND connection.status = 'active'

    ORDER BY student.name, connection.id
  `;

  return result as StudentCardData[];
}