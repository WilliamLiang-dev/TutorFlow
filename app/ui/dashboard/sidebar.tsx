"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { geist } from "@/app/ui/font";
import LiquidGlass from "../liquid-glass";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Files",
    href: "/dashboard/files",
  },
  {
    name: "Students",
    href: "/dashboard/students",
  },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 p-4">
      <div className='flex h-full flex-col rounded-[28px] border border-black/20 bg-white/30 shadow-none backdrop-blur-none p-4 text-white'>
        {/* Logo */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex w-fit rounded-2xl bg-white px-5 py-3 text-xl font-semibold text-black"
        >
        <span>TutorFlow</span>
        <span className="blink-dot">.</span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 font-regular">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

    return (
      <LiquidGlass
        key={link.href}
        className="w-full rounded-2xl"
        strength={isActive ? 9 : 6}
        interactive
      >
        <Link
          href={link.href}
          className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3
            focus:outline-none
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-white/80
            transition-[background-color,border-color,color,box-shadow]
            duration-150
            ${
              isActive
                ? "border-white/90 bg-white/60 text-black"
                : "border-transparent bg-transparent text-black/50 hover:bg-white/45 hover:text-black"
            }`}
        >

          <span>{link.name}</span>
        </Link>
      </LiquidGlass>
    );
  })}
</nav>

        {/* Bottom user area */}
        <div className="mt-auto rounded-3xl bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-black border border-black/15">
              W
            </div>

            <div>
              <p className="text-sm font-semibold text-black">William</p>
              <p className="text-xs text-zinc-700">Tutor</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}