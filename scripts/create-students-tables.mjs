import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

const sql = neon(databaseUrl);

await sql.transaction([
  sql`
    CREATE TABLE students (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      level TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `,

  sql`
    CREATE TABLE teacher_student_connections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      teacher_id UUID NOT NULL REFERENCES teachers(id),
      student_id UUID NOT NULL REFERENCES students(id),
      card_color TEXT NOT NULL DEFAULT '#3b82f6',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'ended')),
      end_at TIMESTAMPTZ,

      UNIQUE (teacher_id, student_id)
    )
  `,

  sql`
    CREATE TABLE teaching_assignments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      connection_id UUID NOT NULL
        REFERENCES teacher_student_connections(id),
      subject TEXT NOT NULL,
      syllabus TEXT,
      level TEXT,
      default_hourly_rate NUMERIC(10, 2)
        CHECK (default_hourly_rate >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'ended'))
    )
  `,

  sql`
    CREATE INDEX connections_student_id_idx
      ON teacher_student_connections(student_id)
  `,

  sql`
    CREATE INDEX assignments_connection_id_idx
      ON teaching_assignments(connection_id)
  `,
]);

console.log("Students, connections, and assignments tables created.");