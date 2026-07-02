"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { geist } from "@/app/ui/font";

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
    <aside className="sticky top-0 h-screen w-[280px] bg-black p-4">
      <div className='flex h-full flex-col rounded-[28px] bg-zinc-900 p-4 text-white'>
        {/* Logo */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex w-fit rounded-2xl bg-white px-5 py-3 text-xl font-bold text-black"
        >
        <span>TutorFlow</span>
        <span className="blink-dot">.</span>
        </Link>

        {/* Navigation */}
        <nav className={`${geist.className} flex flex-col gap-3`}>
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-black"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom user area */}
        <div className="mt-auto rounded-3xl bg-[#1a1a1a] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
              W
            </div>

            <div>
              <p className="text-sm font-semibold">William</p>
              <p className="text-xs text-zinc-400">Tutor account</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}