import "server-only";

import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { Pool } from "pg";
import { Resend } from "resend";

const databaseUrl = process.env.DATABASE_URL;
const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

if (!resendApiKey || !emailFrom) {
  throw new Error("Email configuration is missing");
}

const resend = new Resend(resendApiKey);

export const auth = betterAuth({
  database: new Pool({
    connectionString: databaseUrl,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      storeOTP: "hashed",

      async sendVerificationOTP({ email, otp }) {
        const { error } = await resend.emails.send({
          from: emailFrom,
          to: email,
          subject: "Your TutorFlow verification code",
          text: `Your TutorFlow code is ${otp}.

This code expires in 5 minutes.

If you did not request this code, you can ignore this email.`,
        });

        if (error) {
    console.error("Resend email delivery failed:", {
        name: error.name,
        message: error.message,
    });

    throw new Error("Unable to send verification email");
}
      },
    }),
  ],
});