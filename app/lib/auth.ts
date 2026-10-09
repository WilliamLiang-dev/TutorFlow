import { betterAuth } from "better-auth";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

export const auth = betterAuth({
  database: new Pool({
    connectionString: databaseUrl,
  }),
  emailAndPassword: {
    enabled: true,
  },
});