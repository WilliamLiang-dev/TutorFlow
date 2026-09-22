import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

const sql = neon(databaseUrl);

await sql`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash TEXT;
`;

console.log("password_hash column is ready");