"use server";

import { createHash } from "node:crypto";
import { Pool } from "pg";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/app/lib/auth";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type AcceptResult =
  | { success: true }
  | { success: false; error: string };

class InvitationError extends Error {}

export async function acceptStudentInvitation(
  token: string,
  password?: string,
): Promise<AcceptResult> {
  if (
    typeof token !== "string" ||
    !/^[a-f0-9]{64}$/i.test(token)
  ) {
    return { success: false, error: "This invitation is invalid." };
  }

  if (
    password !== undefined &&
    (typeof password !== "string" ||
      (password.length > 0 &&
        (password.length < 8 || password.length > 128)))
  ) {
    return {
      success: false,
      error: "Use a password between 8 and 128 characters.",
    };
  }

  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || !session.user.emailVerified) {
      throw new InvitationError("Please verify your email first.");
    }

    const sessionAge =
      Date.now() - new Date(session.session.createdAt).getTime();

    if (
      !Number.isFinite(sessionAge) ||
      sessionAge < 0 ||
      sessionAge > 10 * 60 * 1000
    ) {
      throw new InvitationError(
        "Your verification session has expired. Refresh this page and verify again.",
      );
    }

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const email = session.user.email.trim().toLowerCase();
    const authUserId = session.user.id;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Lock the invitation and its existing student relationship.
      const invitationResult = await client.query(
        `
          SELECT
            invitation.id,
            invitation.status,
            invitation.invitee_email AS "inviteeEmail",
            invitation.expires_at <= clock_timestamp() AS expired,
            connection.status AS "connectionStatus",
            student.id AS "studentId",
            student.user_id AS "linkedUserId",
            student.name AS "studentName"
          FROM invitations AS invitation
          JOIN teacher_student_connections AS connection
            ON connection.id = invitation.connection_id
          JOIN students AS student
            ON student.id = connection.student_id
          WHERE invitation.token_hash = $1
          FOR UPDATE OF invitation, connection, student
        `,
        [tokenHash],
      );

      const invitation = invitationResult.rows[0];

      if (!invitation) {
        throw new InvitationError("This invitation is invalid.");
      }

      if (invitation.inviteeEmail.trim().toLowerCase() !== email) {
        throw new InvitationError(
          "Please verify using the email address that received this invitation.",
        );
      }

      const profilesResult = await client.query(
        `
          SELECT id, role, auth_user_id
          FROM users
          WHERE auth_user_id = $1
             OR lower(btrim(email)) = $2
          FOR UPDATE
        `,
        [authUserId, email],
      );

      if (
        profilesResult.rows.some(
          (profile) =>
            profile.auth_user_id !== authUserId ||
            profile.role !== "student",
        )
      ) {
        throw new InvitationError(
          "This email belongs to another TutorFlow profile. A tutor account cannot accept a student invitation.",
        );
      }

      const existingProfile = profilesResult.rows.find(
        (profile) => profile.auth_user_id === authUserId,
      );

      // A repeated submission by the same student is safe.
      if (invitation.status === "accepted") {
        if (
          existingProfile &&
          invitation.linkedUserId === existingProfile.id
        ) {
          await client.query("COMMIT");
          return { success: true };
        }

        throw new InvitationError(
          "This invitation has already been accepted.",
        );
      }

      if (invitation.status === "cancelled") {
        throw new InvitationError("This invitation was cancelled.");
      }

      if (invitation.status === "expired" || invitation.expired) {
        throw new InvitationError(
          "This invitation has expired. Ask your tutor for a new link.",
        );
      }

      if (
        invitation.status !== "pending" ||
        invitation.connectionStatus !== "active"
      ) {
        throw new InvitationError(
          "This invitation is no longer available.",
        );
      }

      if (
        invitation.linkedUserId &&
        invitation.linkedUserId !== existingProfile?.id
      ) {
        throw new InvitationError(
          "This student profile is already linked to another account.",
        );
      }

      const credentials = await client.query(
        `
          SELECT id
          FROM account
          WHERE "userId" = $1
            AND "providerId" = 'credential'
            AND password IS NOT NULL
          LIMIT 1
        `,
        [authUserId],
      );

      if (credentials.rows.length === 0) {
        if (!password) {
          throw new InvitationError(
            "Please create a password for your new account.",
          );
        }

        await auth.api.setPassword({
          headers: requestHeaders,
          body: { newPassword: password },
        });
      }

      // Preserve an existing student's profile information.
      // Never convert another role into a student.
      const profileResult = await client.query(
        `
          INSERT INTO users (
            name,
            email,
            role,
            auth_user_id
          )
          VALUES ($1, $2, 'student', $3)
          ON CONFLICT (auth_user_id)
          DO UPDATE SET auth_user_id = EXCLUDED.auth_user_id
          WHERE users.role = 'student'
          RETURNING id
        `,
        [invitation.studentName, email, authUserId],
      );

      const profile = profileResult.rows[0];

      if (!profile) {
        throw new InvitationError(
          "This account cannot be registered as a student.",
        );
      }

      await client.query(
        `
          UPDATE students
          SET user_id = $1
          WHERE id = $2
        `,
        [profile.id, invitation.studentId],
      );

      // Check expiry again in case it passed during account setup.
      const accepted = await client.query(
        `
          UPDATE invitations
          SET status = 'accepted',
              accepted_at = now()
          WHERE id = $1
            AND status = 'pending'
            AND expires_at > clock_timestamp()
          RETURNING id
        `,
        [invitation.id],
      );

      if (accepted.rows.length === 0) {
        throw new InvitationError(
          "This invitation has expired. Ask your tutor for a new link.",
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof InvitationError
          ? error.message
          : "Could not finish accepting the invitation. Please try again.",
    };
  }

  revalidatePath("/dashboard/students");
  revalidatePath("/dashboard");

  return { success: true };
}