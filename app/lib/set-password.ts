"use server";

import { headers } from "next/headers";
import { neon } from "@neondatabase/serverless";
import { auth } from "./auth";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing");
}

const sql = neon(databaseUrl);

export async function setInitialPassword(
    password: string,
    expectedEmail: string,
    name: string
) {
    if (
        typeof password !== "string" ||
        password.length < 8 ||
        password.length > 128
    ) {
        return { error: "Use a password between 8 and 128 characters." };
    }

    if (
        typeof name !== "string" ||
        !name.trim() ||
        name.trim().length > 100
    ) {
        return { error: "Enter a name between 1 and 100 characters." };
    }

    if (typeof expectedEmail !== "string") {
        return { error: "Please verify your email again." };
    }

    const displayName = name.trim();

    try {
        const requestHeaders = await headers();

        const session = await auth.api.getSession({
            headers: requestHeaders,
        });

        if (
            !session ||
            !session.user.emailVerified ||
            session.user.email.toLowerCase() !==
                expectedEmail.trim().toLowerCase()
        ) {
            return { error: "Please verify your email again." };
        }

        const sessionAge =
            Date.now() - new Date(session.session.createdAt).getTime();

        if (
            !Number.isFinite(sessionAge) ||
            sessionAge > 10 * 60 * 1000
        ) {
            return {
                error: "Verification has expired. Please verify again.",
            };
        }

        const authUserId = session.user.id;
        const email = session.user.email;

        const existingProfiles = await sql`
            SELECT id, role, auth_user_id
            FROM users
            WHERE auth_user_id = ${authUserId}
               OR LOWER(email) = LOWER(${email})
        `;

        if (
            existingProfiles.some(
                (profile) =>
                    profile.auth_user_id !== authUserId ||
                    profile.role !== "teacher"
            )
        ) {
            return {
                error:
                    "This email already belongs to an existing TutorFlow profile. Please contact support to link it.",
            };
        }

        const credentials = await sql`
            SELECT id
            FROM account
            WHERE "userId" = ${authUserId}
              AND "providerId" = 'credential'
              AND password IS NOT NULL
            LIMIT 1
        `;

        if (credentials.length === 0) {
            await auth.api.setPassword({
                body: { newPassword: password },
                headers: requestHeaders,
            });
        }

        const teachers = await sql`
            WITH profile AS (
                INSERT INTO users (
                    name,
                    email,
                    role,
                    auth_user_id
                )
                VALUES (
                    ${displayName},
                    ${email},
                    'teacher',
                    ${authUserId}
                )
                ON CONFLICT (auth_user_id)
                DO UPDATE SET
                    name = EXCLUDED.name,
                    email = EXCLUDED.email
                WHERE users.role = 'teacher'
                RETURNING id, name, email
            )
            INSERT INTO teachers (user_id, name, email)
            SELECT id, name, email
            FROM profile
            ON CONFLICT (user_id)
            DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email
            RETURNING id
        `;

        if (teachers.length === 0) {
            return { error: "Unable to create the tutor profile." };
        }

        return {
            success: true,
            teacherId: teachers[0].id as string,
        };
    } catch {
        return {
            error:
                "Could not finish account setup. Please try again. If this continues, contact support.",
        };
    }
}