"use client";


export default function Calendar() {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[30px] bg-gradient-to-br from-lime-200 via-white to-violet-100 p-8">
      {/* Top header */}
      <header className="mb-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-black">July 2026</h1>

          <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
            Today
          </button>

          <button className="text-2xl text-black">‹</button>
          <button className="text-2xl text-black">›</button>
        </div>

        {/* Right side */}
        <div className="flex rounded-2xl bg-slate-300/50 p-1">
          <button className="rounded-xl px-8 py-2 text-sm text-black">
            Month
          </button>

          <button className="rounded-xl bg-white px-8 py-2 text-sm text-black shadow">
            Week
          </button>

          <button className="rounded-xl px-8 py-2 text-sm text-black">
            Day
          </button>
        </div>
      </header>

      {/* Calendar body placeholder */}
      <div className="min-h-0 flex-1 rounded-[28px] bg-white/90 p-6 shadow-sm">
        Calendar grid will go here
      </div>
    </section>
  );
}