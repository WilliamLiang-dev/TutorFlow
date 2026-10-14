"use client"

import LiquidGlass from "../liquid-glass";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";

type LoginFormProps = {
    onRegister: () => void;
};

export default function LoginForm({ onRegister }: LoginFormProps) {

    const [mode, setMode] = useState<"login" | "register">("login");

    const router = useRouter();
    const submittingRef = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSignIn(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (submittingRef.current) return;

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        submittingRef.current = true;
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error || !data) {
                setErrorMessage(
                    error?.message || "Unable to sign in. Please try again."
                );
                return;
            }

            router.replace("/dashboard");
            router.refresh();
        } catch {
            setErrorMessage("Unable to connect. Please try again.");
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-2 md:px-16">
            <div className="flex min-w-0 justify-center">
                <LiquidGlass className="rounded-2xl" strength={12}>
                    <form
                        onSubmit={handleSignIn}
                        className="w-[420px] max-w-full p-10">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-base">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="example@gmail.com"
                                        autoComplete="email"
                                        required
                                        disabled={isSubmitting}
                                        className="w-full p-3 bg-white/100 rounded h-10 border-b-2 border-transparent focus:outline-none focus:border-b-gray-400" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-base">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        required
                                        disabled={isSubmitting}
                                        className="w-full p-3 bg-white/100 rounded h-10 border-b-2 border-transparent focus:outline-none focus:border-b-gray-400" />
                                    {errorMessage && (
                                        <p role="alert" className="text-sm text-red-600">
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className={`${errorMessage ? "mt-0" : "mt-3"} text-right text-sm`}>
                                <button type="button">
                                    Forgot Password?
                                </button>
                            </div>

                            <div className="flex items-center my-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    aria-busy={isSubmitting}
                                    className="flex items-center justify-center bg-black rounded w-full h-8 text-white text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span
                                                aria-hidden="true"
                                                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                            />
                                            <span className="sr-only">Signing in…</span>
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </button>
                            </div>
                            <div className="my-6 mx-auto flex w-full max-w-xs items-center gap-3">
                                <div className="h-px min-w-0 flex-1 bg-black/20" />

                                <span className="shrink-0 text-sm text-black/50">
                                    Or Continue With
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
                            <div className="flex justify-center gap-3 text-black/50 text-sm">
                                <span>
                                    Don't have an account yet?
                                </span>
                                <button
                                    type="button"
                                    onClick={onRegister}
                                    className="underline underline-offset-4 cursor-pointer">
                                    Register Here
                                </button>
                            </div>
                    </form>
                </LiquidGlass>
            </div>
                
            <div className="flex min-w-0 flex-col items-center justify-center text-center">
                <svg
                    viewBox="0 0 600 180"
                    className="w-full max-w-[600px] overflow-visible"
                    role="img"
                    aria-label="TutorFlow"
                >
                    <text
                        x="300"
                        y="125"
                        textAnchor="middle"
                        className="tutorflow-handwriting"
                    >
                        TutorFlow
                    </text>
                </svg>

                <p className="tutorflow-tagline mt-4 text-base leading-relaxed text-black/65">
                    Your All-in-One
                    <br />
                    Tutor Management System
                </p>
            </div>

        </div>
  );
}