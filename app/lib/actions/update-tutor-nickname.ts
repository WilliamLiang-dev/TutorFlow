"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";

type Result =
  | { success: true; nickname: string | null }
  | { success: false; error: string };

export async function updateTutorNickname(
  connectionId: string,
  value: string,
): Promise<Result> {
  if (
    typeof connectionId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      connectionId,
    )
  ) {
    return { success: false, error: "Invalid tutor connection." };
  }

  if (typeof value !== "string" || value.trim().length > 100) {
    return {
      success: false,
      error: "Use a nickname of 100 characters or fewer.",
    };
  }

  const nickname = value.trim() || null;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user.emailVerified) {
      return {
        success: false,
        error: "Please sign in with your verified student account.",
      };
    }

    const updated = await sql`
      UPDATE teacher_student_connections AS connection
      SET student_tutor_nickname = ${nickname}

      FROM students AS student, users AS app_user

      WHERE connection.id = ${connectionId}::uuid
        AND connection.student_id = student.id
        AND student.user_id = app_user.id
        AND app_user.auth_user_id = ${session.user.id}
        AND app_user.role = 'student'
        AND connection.status = 'active'
        AND EXISTS (
          SELECT 1
          FROM invitations AS invitation
          WHERE invitation.connection_id = connection.id
            AND invitation.status = 'accepted'
        )

      RETURNING connection.id
    `;

    if (updated.length === 0) {
      return {
        success: false,
        error: "This tutor connection is unavailable.",
      };
    }
  } catch {
    return {
      success: false,
      error: "Could not save the nickname. Please try again.",
    };
  }

  revalidatePath("/dashboard/tutors");
  revalidatePath("/dashboard");

  return { success: true, nickname };
}