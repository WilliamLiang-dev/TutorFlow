import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.emailVerified) {
    redirect("/login");
  }

  const teachers = await sql`
    SELECT teacher.id
    FROM teachers AS teacher
    JOIN users AS app_user
      ON app_user.id = teacher.user_id
    WHERE app_user.auth_user_id = ${session.user.id}
      AND app_user.role = 'teacher'
    LIMIT 1
  `;

  const teacherId = teachers[0]?.id;

  if (!teacherId) {
    throw new Error("Your tutor profile has not been set up yet.");
  }

  // Keep your existing student query and return below.

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