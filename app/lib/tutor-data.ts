import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";

export type TutorCardData = {
  connectionId: string;
  teacherId: string;
  displayName: string;
  subjects: string[];
};

export async function getTutorCards(): Promise<TutorCardData[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.emailVerified) {
    redirect("/login");
  }

  const profiles = await sql`
    SELECT id, role
    FROM users
    WHERE auth_user_id = ${session.user.id}
    LIMIT 1
  `;

  const profile = profiles[0];

  if (!profile || profile.role !== "student") {
    redirect("/dashboard");
  }

  const result = await sql`
    SELECT
      connection.id AS "connectionId",
      teacher.id AS "teacherId",
      COALESCE(
        NULLIF(btrim(teacher.name), ''),
        'Tutor'
      ) AS "displayName",

      ARRAY(
        SELECT DISTINCT assignment.subject
        FROM teaching_assignments AS assignment
        WHERE assignment.connection_id = connection.id
          AND assignment.status = 'active'
        ORDER BY assignment.subject
      ) AS subjects

    FROM teacher_student_connections AS connection

    JOIN students AS student
      ON student.id = connection.student_id

    JOIN teachers AS teacher
      ON teacher.id = connection.teacher_id

    WHERE student.user_id = ${profile.id}
      AND connection.status = 'active'
      AND EXISTS (
        SELECT 1
        FROM invitations AS invitation
        WHERE invitation.connection_id = connection.id
          AND invitation.status = 'accepted'
      )

    ORDER BY teacher.name, connection.id
  `;

  return result as TutorCardData[];
}