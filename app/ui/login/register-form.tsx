import LiquidGlass from "../liquid-glass";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

type RegisterFormProps = {
    onSignIn: () => void;
}

export default function RegisterForm({ onSignIn }: RegisterFormProps) {
    return (
        <div className="flex min-w-0 justify-center">
                <LiquidGlass className="rounded-2xl" strength={12}>
                    <form
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
                                        className="w-full p-3 bg-white/100 rounded h-10" />
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
                                        className="w-full p-3 bg-white/100 rounded h-10" />
                                </div>
                            </div>
                            <div className="flex items-center my-6">
                                <button className="bg-black/100 rounded w-full text-white py-1 text-base">
                                    Sign up
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