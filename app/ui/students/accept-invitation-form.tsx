"use client";

import { useRef, useState, type FormEvent } from "react";

import { authClient } from "@/app/lib/auth-client";
import { acceptStudentInvitation } from "@/app/lib/actions/accept-student-invitation";

type Props = {
  token: string;
  email: string;
};

export default function AcceptInvitationForm({
  token,
  email,
}: Props) {
  const busyRef = useRef(false);

  const [step, setStep] = useState<
    "verify" | "accept" | "complete"
  >("verify");

  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function run(task: () => Promise<void>) {
    if (busyRef.current) return;

    busyRef.current = true;
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await task();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function sendCode() {
    await run(async () => {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (result.error) {
        setError(result.error.message || "Unable to send the code.");
        return;
      }

      setMessage("Code sent. Check your inbox and spam folder.");
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await run(async () => {
      if (step === "verify") {
        const result = await authClient.signIn.emailOtp({
          email,
          otp: code.trim(),
        });

        if (result.error || !result.data) {
          setError(
            result.error?.message || "Unable to verify this code.",
          );
          return;
        }

        setCode("");
        setStep("accept");
        return;
      }

      if (password !== confirmation) {
        setError("The passwords do not match.");
        return;
      }

      const result = await acceptStudentInvitation(
        token,
        password || undefined,
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setPassword("");
      setConfirmation("");
      setStep("complete");
    });
  }

  if (step === "complete") {
    return (
      <div
        role="status"
        className="mt-8 rounded-2xl bg-emerald-50 p-5"
      >
        <h2 className="font-semibold text-emerald-900">
          Invitation accepted
        </h2>

        <p className="mt-2 text-sm leading-6 text-emerald-800">
          Your account is now connected to your tutor.
          You can safely close this page.
        </p>
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-zinc-200 bg-white " +
    "px-4 py-3 text-sm outline-none focus:border-zinc-500";

  const buttonClass =
    "inline-flex min-h-12 items-center justify-center rounded-xl " +
    "bg-zinc-900 px-5 text-sm font-medium text-white " +
    "hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 " +
    "focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-zinc-900 focus-visible:ring-offset-2";

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <fieldset disabled={busy} className="space-y-5">
        <div>
          <p className="text-sm font-medium text-zinc-800">
            Invitation email
          </p>

          <p className="mt-1 break-all text-sm text-zinc-500">
            {email}
          </p>
        </div>

        {step === "verify" ? (
          <>
            <p className="text-sm leading-6 text-zinc-500">
              Verify this email to create your student account or
              sign in to your existing account.
            </p>

            <div>
              <label
                htmlFor="invitation-code"
                className="text-sm font-medium text-zinc-800"
              >
                Verification code
              </label>

              <div className="flex items-end gap-2">
                <input
                  id="invitation-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="6-digit code"
                  className={`${inputClass} min-w-0 flex-1`}
                />

                <button
                  type="button"
                  onClick={sendCode}
                  className={`${buttonClass} shrink-0`}
                >
                  Send code
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-emerald-700">
              Email verified
            </p>

            <p className="text-sm leading-6 text-zinc-500">
              New to TutorFlow? Create a password below.
              If you already have a password, leave these fields
              empty. Your existing password will stay unchanged.
            </p>

            <div>
              <label
                htmlFor="student-password"
                className="text-sm font-medium text-zinc-800"
              >
                Password
              </label>

              <input
                id="student-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="student-password-confirmation"
                className="text-sm font-medium text-zinc-800"
              >
                Confirm password
              </label>

              <input
                id="student-password-confirmation"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required={password.length > 0}
                value={confirmation}
                onChange={(event) =>
                  setConfirmation(event.target.value)
                }
                className={inputClass}
              />
            </div>
          </>
        )}

        <button type="submit" className={`${buttonClass} w-full`}>
          {busy
            ? "Please wait…"
            : step === "verify"
              ? "Verify email"
              : "Accept invitation"}
        </button>
      </fieldset>

      {message && (
        <p role="status" className="mt-4 text-sm text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}