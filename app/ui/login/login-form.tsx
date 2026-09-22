import LiquidGlass from "../liquid-glass";
export default function LoginForm() {
  return (
    <div>
        <LiquidGlass className="rounded-2xl" strength={12}>
            <form
                className="p-10">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label>
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
                            <label>
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
                    {/* <div className="my-6 mx-auto flex w-full max-w-xs items-center gap-3">
                        <div className="h-px min-w-0 flex-1 bg-black/20" />

                        <span className="shrink-0 text-sm text-black/50">
                            Or Continue With
                        </span>

                        <div className="h-px min-w-0 flex-1 bg-black/20" />
                    </div> */}
            </form>

        </LiquidGlass>
    </div>
  );
}