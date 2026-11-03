"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { createHash, randomBytes } from "node:crypto";
import { Resend } from "resend";

type AssignmentInput = {
  syllabus: string;
  subject: string;
};

type StudentInput = {
  name: string;
  email: string;
  level: string;
  assignments: AssignmentInput[];
};

type AddStudentResult =
  | {
      success: true;
      emailStatus: "sent" | "unconfirmed";
      message: string;
    }
  | {
      success: false;
      error: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readText(
  value: unknown,
  label: string,
  maxLength: number,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Please enter ${label}.`);
  }

  const text = value.trim();

  if (text.length > maxLength) {
    throw new Error(
      `${label} must be ${maxLength} characters or fewer.`,
    );
  }

  return text;
}

function validateInput(input: unknown): StudentInput {
  if (!isRecord(input)) {
    throw new Error("Invalid student details.");
  }

  const name = readText(input.name, "the student's name", 100);
  const email = readText(input.email, "the student's email", 254)
    .toLowerCase();
  const level = readText(input.level, "the student's school level / year", 100,);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  if (
    !Array.isArray(input.assignments) ||
    input.assignments.length === 0
  ) {
    throw new Error("Please add at least one subject.");
  }

  if (input.assignments.length > 50) {
    throw new Error("Please add no more than 50 subjects at a time.");
  }

  const seen = new Set<string>();

  const assignments = input.assignments.map((value, index) => {
    if (!isRecord(value)) {
      throw new Error(`Subject ${index + 1} is invalid.`);
    }

    const assignment = {
    syllabus: readText(
        value.syllabus,
        `the syllabus for subject ${index + 1}`,
        100,
    ),
    subject: readText(
        value.subject,
        `the name of subject ${index + 1}`,
        100,
    ),
    };

    const key = JSON.stringify([
      assignment.syllabus.toLowerCase(),
      assignment.subject.toLowerCase(),
    ]);

    if (seen.has(key)) {
      throw new Error(
        `Subject ${index + 1} duplicates an earlier entry.`,
      );
    }

    seen.add(key);
    return assignment;
  });

  return { name, email, level, assignments };
}

export async function addStudent(
  input: unknown,
): Promise<AddStudentResult> {
  let data: StudentInput;

  try {
    data = validateInput(input);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Please check the student details.",
    };
  }

  // Validate email configuration before saving anything.
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const appUrl = process.env.APP_URL;

  if (!resendApiKey || !emailFrom || !appUrl) {
    return {
      success: false,
      error: "Invitation email configuration is incomplete.",
    };
  }

  let invitationUrl: URL;

  try {
    const baseUrl = new URL(appUrl);

    const isLocal =
      baseUrl.hostname === "localhost" ||
      baseUrl.hostname === "127.0.0.1";

    if (
      baseUrl.protocol !== "https:" &&
      !(isLocal && baseUrl.protocol === "http:")
    ) {
      throw new Error("Invalid app URL");
    }

    if (baseUrl.username || baseUrl.password) {
      throw new Error("Invalid app URL");
    }

    invitationUrl = new URL("/invite/accept", baseUrl.origin);
  } catch {
    return {
      success: false,
      error: "APP_URL must be a valid HTTPS URL or local development URL.",
    };
  }

  // Only the hash is stored in the database.
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  invitationUrl.searchParams.set("token", token);

  let invitationId = "";
  let tutorName = "";
  let expiresAt: Date;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user.emailVerified) {
      return {
        success: false,
        error: "Please sign in with a verified email to add students.",
      };
    }

    const teachers = await sql`
      SELECT
        teacher.id,
        COALESCE(
          NULLIF(btrim(app_user.name), ''),
          NULLIF(btrim(teacher.name), ''),
          'Your tutor'
        ) AS name
      FROM teachers AS teacher
      JOIN users AS app_user
        ON app_user.id = teacher.user_id
      WHERE app_user.auth_user_id = ${session.user.id}
        AND app_user.role = 'teacher'
      LIMIT 1
    `;

    const teacherId = teachers[0]?.id;

    if (!teacherId) {
      return {
        success: false,
        error: "Your tutor profile has not been set up yet.",
      };
    }

    tutorName = teachers[0].name;

    const assignmentsJson = JSON.stringify(data.assignments);

    const results = await sql.transaction(
      [
        sql`
          SELECT id
          FROM teachers
          WHERE id = ${teacherId}
          FOR UPDATE
        `,

        sql`
          WITH new_student AS (
            INSERT INTO students (
              name,
              email,
              level
            )
            SELECT
              ${data.name},
              ${data.email},
              ${data.level}
            WHERE NOT EXISTS (
              SELECT 1
              FROM teacher_student_connections AS connection
              JOIN students AS student
                ON student.id = connection.student_id
              WHERE connection.teacher_id = ${teacherId}
                AND lower(btrim(student.email)) = ${data.email}
            )
            RETURNING id
          ),

          new_connection AS (
            INSERT INTO teacher_student_connections (
              teacher_id,
              student_id
            )
            SELECT
              ${teacherId},
              id
            FROM new_student
            RETURNING id
          ),

          new_assignments AS (
            INSERT INTO teaching_assignments (
              connection_id,
              subject,
              syllabus
            )
            SELECT
              connection.id,
              assignment.subject,
              assignment.syllabus
            FROM new_connection AS connection
            CROSS JOIN jsonb_to_recordset(
              ${assignmentsJson}::jsonb
            ) AS assignment(
              subject text,
              syllabus text
            )
            RETURNING id
          ),

          new_invitation AS (
            INSERT INTO invitations (
              connection_id,
              invitee_email,
              token_hash,
              status,
              expires_at
            )
            SELECT
              id,
              ${data.email},
              ${tokenHash},
              'pending',
              now() + interval '24 hours'
            FROM new_connection
            RETURNING id, expires_at
          )

          SELECT
            invitation.id AS "invitationId",
            invitation.expires_at AS "expiresAt",
            (
              SELECT count(*)
              FROM new_assignments
            ) AS "assignmentCount"
          FROM new_invitation AS invitation
        `,
      ],
      { isolationLevel: "ReadCommitted" },
    );

    const invitation = results[1][0];

    if (!invitation) {
      return {
        success: false,
        error:
          "A student with this email is already connected to you, possibly as an inactive or ended connection.",
      };
    }

    invitationId = invitation.invitationId;
    expiresAt = new Date(invitation.expiresAt);
  } catch {
    return {
      success: false,
      error:
        "Could not confirm that the student was saved. Refresh the student list before trying again.",
    };
  }

  // Database records are committed before attempting email delivery.
  let emailStatus: "sent" | "unconfirmed" = "unconfirmed";

  try {
    const resend = new Resend(resendApiKey);

    const expiryLabel = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Hong_Kong",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(expiresAt);

    const { data: emailResult, error } = await resend.emails.send(
      {
        from: emailFrom,
        to: data.email,
        subject: "You're invited to TutorFlow",
        text: `Hi ${data.name},

${tutorName} has invited you to join TutorFlow as their student.

Accept your invitation using this link:
${invitationUrl.toString()}

You can set up your account or sign in to an existing account when accepting.

This invitation expires on ${expiryLabel} (Hong Kong time), 24 hours after it was created.

If you were not expecting this invitation, you can ignore this email.

TutorFlow`,
      },
      {
        idempotencyKey: `student-invitation/${invitationId}`,
      },
    );

    if (!error && emailResult?.id) {
      emailStatus = "sent";
    }
  } catch {
    // Keep the student and invitation if delivery cannot be confirmed.
    emailStatus = "unconfirmed";
  }

  revalidatePath("/dashboard/students");
  revalidatePath("/dashboard");

  return {
    success: true,
    emailStatus,
    message:
      emailStatus === "sent"
        ? "Student added. Invitation email sent."
        : "Student added, but we couldn't confirm the invitation email was sent. Don't add the student again.",
  };
}