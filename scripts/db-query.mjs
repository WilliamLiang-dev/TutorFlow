import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DataBASE_URL is missing")
}

const sql = neon(databaseUrl);

const result = await sql`
  SELECT 'students' AS table_name, COUNT(*)::int AS total
  FROM students

  UNION ALL

  SELECT 'teacher_student_connections', COUNT(*)::int
  FROM teacher_student_connections

  UNION ALL

  SELECT 'teaching_assignments', COUNT(*)::int
  FROM teaching_assignments;
`;

console.table(result);