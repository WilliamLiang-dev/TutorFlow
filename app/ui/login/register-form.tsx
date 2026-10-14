"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { setInitialPassword } from "../../lib/set-password";
import { useRef, useState } from "react";
import { authClient } from "../../lib/auth-client";
import LiquidGlass from "../liquid-glass";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

type RegisterFormProps = {
    onSignIn: () => void;
}

export default function RegisterForm({ onSignIn }: RegisterFormProps) {
    const emailRef = useRef<HTMLInputElement>(null);
    const sendingRef = useRef(false);

    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();
    const submittingRef = useRef(false);

    const [isVerified, setIsVerified] = useState(false);
    const [verifiedEmail, setVerifiedEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSendCode() {
        const emailInput = emailRef.current;

        if (!emailInput || sendingRef.current) return;

        if (!emailInput.reportValidity()) return;

        sendingRef.current = true;
        setIsSending(true);
        setMessage("");
        setErrorMessage("");

        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email: emailInput.value.trim(),
                type: "sign-in",
            });

            if (error) {
                setErrorMessage(
                    error.message || "Unable to send the code. Please try again."
                );
                return;
            }

            setMessage("Code sent. Check your inbox and spam folder.");
        } catch {
            setErrorMessage("Unable to connect. Please try again.");
        } finally {
            sendingRef.current = false;
            setIsSending(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (submittingRef.current || sendingRef.current) return;

        const formData = new FormData(event.currentTarget);

        submittingRef.current = true;
        setIsSubmitting(true);
        setMessage("");
        setErrorMessage("");

        try {
            if (!isVerified) {
                const email = emailRef.current?.value.trim() ?? "";
                const otp = String(formData.get("verificationCode") ?? "").trim();

                const { data, error } = await authClient.signIn.emailOtp({
                    email,
                    otp,
                });

                if (error || !data) {
                    setErrorMessage(
                        error?.message || "Unable to verify the code."
                    );
                    return;
                }

                setVerifiedEmail(data.user.email);
                setIsVerified(true);
            } else {
                const password = String(formData.get("password") ?? "");
                const confirmPassword = String(
                    formData.get("confirmPassword") ?? ""
                );

                if (password !== confirmPassword) {
                    setErrorMessage("The passwords do not match.");
                    return;
                }

                const name = String(formData.get("name") ?? "").trim();

                const result = await setInitialPassword(
                    password,
                    verifiedEmail,
                    name
                );

                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                router.replace("/dashboard");
                router.refresh();
            }
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex min-w-0 justify-center">
            <LiquidGlass className="rounded-2xl" strength={12}>
                <form
                    onSubmit={handleSubmit}
                    className="w-[420px] max-w-full p-10">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-base">
                                Email
                                {isVerified && (
                                    <span className="ml-2 text-sm text-green-700">
                                        ✓ Verified
                                    </span>
                                )}
                            </label>

                            <input
                                ref={emailRef}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="example@gmail.com"
                                required
                                readOnly={isVerified}
                                disabled={isSending || isSubmitting}
                                onChange={() => {
                                    setMessage("");
                                    setErrorMessage("");
                                }}
                                className="w-full p-3 bg-white rounded h-10 border-b-2 border-transparent focus:outline-none focus:border-b-gray-400"
                            />
                        </div>

                        {!isVerified && (
                            <div className="flex flex-col gap-1">
                                <label htmlFor="verificationCode" className="text-base">
                                    Verification code
                                </label>

                                <div className="flex gap-2 items-center">
                                    <input
                                        id="verificationCode"
                                        name="verificationCode"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        pattern="[0-9]{6}"
                                        placeholder="6-digit code"
                                        required
                                        className="min-w-0 flex-1 p-3 bg-white rounded h-10 border-b-2 border-transparent focus:outline-none focus:border-b-gray-400"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        disabled={isSending || isSubmitting}
                                        aria-busy={isSending}
                                        className="flex items-center justify-center shrink-0 min-w-[56px] rounded bg-black px-3 h-8 text-sm text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSending ? (
                                            <>
                                                <span
                                                    aria-hidden="true"
                                                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                                />
                                                <span className="sr-only">Sending code…</span>
                                            </>
                                        ) : (
                                            "Send"
                                        )}
                                    </button>
                                </div>
                                {message && (
                                    <p role="status" className="text-sm text-green-700">
                                        {message}
                                    </p>
                                )}
                            </div>
                        )}

                        {errorMessage && (
                            <p role="alert" className="text-sm text-red-600">
                                {errorMessage}
                            </p>
                        )}
                        <div
                            aria-hidden={!isVerified}
                            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${isVerified
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                                }`}
                        >
                            <div className="min-h-0 overflow-hidden">
                                <fieldset
                                    disabled={!isVerified || isSubmitting}
                                    className="flex flex-col gap-3"
                                >
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="name" className="text-base">
                                        Display Name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Enter your display name"
                                        maxLength={100}
                                        required={isVerified}
                                        className="w-full p-3 bg-white rounded h-10 border-b-2 border-transparent focus:outline-none focus:border-b-gray-400 text-sm"
                                    />
                                </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="password" className="text-base">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="At least 8 characters"
                                            minLength={8}
                                            maxLength={128}
                                            required={isVerified}
                                            className="w-full p-3 bg-white rounded h-10 border-b-2 border-transparent focus:outline-none focus:border-b-gray-400 text-sm"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Confirm password"
                                            minLength={8}
                                            maxLength={128}
                                            required={isVerified}
                                            className="w-full p-3 bg-white rounded h-10 border-b-2 border-transparent focus:outline-none focus:border-b-gray-400 text-sm"
                                        />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSending || isSubmitting}
                            className={`${isVerified ? "mt-3" : ""} bg-black rounded w-full text-white py-1 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting
                                ? isVerified
                                    ? "Saving…"
                                    : "Verifying…"
                                : isVerified
                                    ? "Set password & continue"
                                    : "Verify Email"}
                        </button>
                    </div>
                    <div className="my-6 mx-auto flex w-full max-w-xs items-center gap-3">
                        <div className="h-px min-w-0 flex-1 bg-black/20" />

                        <span className="shrink-0 text-sm text-black/50">
                            Or Start With
                        </span>

                        <div className="h-px min-w-0 flex-1 bg-black/20" />
                    </div>
                    <div className="flex justify-center gap-5 my-6">
                        <button
                            type="button"
                            aria-label="Continue with Google"
                            className="flex h-11 w-24 items-center justify-center rounded-full bg-white transition hover:bg-gray-100"
                        >
                            <FcGoogle className="h-6 w-6" />
                        </button>

                        <button
                            type="button"
                            aria-label="Continue with Apple"
                            className="flex h-11 w-24 items-center justify-center rounded-full bg-white transition hover:bg-gray-100"
                        >
                            <FaApple className="h-6 w-6 text-black" />
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onSignIn}
                            className="cursor-pointer text-sm text-right text-black/50">
                            <span>→ Back to sign in</span>
                        </button>
                    </div>
                </form>
            </LiquidGlass>
        </div>

    )
}