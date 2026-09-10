import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

const sql = neon(databaseUrl);

const userId = randomUUID();
const teacherId = randomUUID();

await sql.transaction([
  sql`
    INSERT INTO users (id, name, email, role)
    VALUES (
      ${userId},
      'Development Teacher',
      'teacher@tutorflow.example',
      'teacher'
    )
  `,

  sql`
    INSERT INTO teachers (id, user_id, name, email)
    VALUES (
      ${teacherId},
      ${userId},
      'Development Teacher',
      'teacher@tutorflow.example'
    )
  `,
]);

console.log("Development teacher created.");
console.log("DEV_TEACHER_ID=" + teacherId);