"use client";


import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarIcon,
  FolderIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const MIN_WIDTH = 200;
const DEFAULT_WIDTH = 260;
const MAX_WIDTH = 400;

type AccountRole = "teacher" | "student";

const accountLabels: Record<AccountRole, string> = {
  teacher: "Tutor",
  student: "Student",
};

function getLinks(role: AccountRole | null) {
  const sharedLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Schedule",
      href: "/dashboard/schedule",
      icon: CalendarIcon,
    },
    {
      name: "Files",
      href: "/dashboard/files",
      icon: FolderIcon,
    },
  ];

  // Accounts without an application profile only see Dashboard.
  if (!role) {
    return [sharedLinks[0]];
  }

  return [
    ...sharedLinks,
    role === "teacher"
      ? {
          name: "Students",
          href: "/dashboard/students",
          icon: UserGroupIcon,
        }
      : {
          name: "Tutors",
          href: "/dashboard/tutors",
          icon: UserGroupIcon,
        },
    {
      name: "Invoices",
      href: "/dashboard/invoices",
      icon: DocumentTextIcon,
    },
  ];
}

type SidebarProps = {
  name: string;
  role: AccountRole | null;
};

export default function Sidebar({
  name,
  role,
  }: SidebarProps) {
  const displayName = name?.trim() || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const accountType = role
    ? accountLabels[role]
    : "Setup incomplete";

  const links = getLinks(role);
  const pathname = usePathname();

  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function clampWidth(value: number) {
    return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, value));
  }

  return (
    <aside
      style={{ width: collapsed ? 72 : width }}
      className={`sticky top-0 flex h-dvh shrink-0 flex-col
        border-r border-zinc-200 bg-white text-zinc-900
        ${isResizing ? "select-none" : ""}`}
    >
  {/* Logo and collapse / expand button */}
  <div
    className={`flex h-20 shrink-0 items-center ${
      collapsed ? "justify-center" : "justify-between px-4"
    }`}
  >
    {!collapsed && (
      <Link
        href="/dashboard"
        className="whitespace-nowrap text-xl font-semibold tracking-tight"
      >
        <span>TutorFlow</span>
        <span className="blink-dot">.</span>
      </Link>
    )}

    <button
      type="button"
      onClick={() => setCollapsed((previous) => !previous)}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="group relative flex h-10 w-10 shrink-0
        items-center justify-center bg-transparent
        text-zinc-500 hover:text-zinc-900
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
    >
      {collapsed && (
        <img
          src="/light_logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute h-8 w-8 object-contain
            group-hover:opacity-0 group-focus-visible:opacity-0"
        />
      )}

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
        className={`pointer-events-none h-5 w-5 ${
          collapsed
            ? "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
            : "opacity-100"
        }`}
      >
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M9 4v16" />
      </svg>
    </button>
  </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3"
      >
        {links.map((link) => {
          const Icon = link.icon;

          const isActive =
            link.href === "/dashboard"
              ? pathname === link.href
              : pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.name}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? link.name : undefined}
              className={`flex h-11 shrink-0 items-center rounded-lg
                transition-colors
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-inset focus-visible:ring-blue-500
                ${collapsed ? "justify-center" : "gap-3 px-3"}
                ${
                  isActive
                    ? "bg-zinc-100 font-medium text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />

              {!collapsed && (
                <span className="whitespace-nowrap">{link.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user area */}
      <div className="shrink-0 p-3">
        <button
          type="button"
          className="w-full rounded-lg text-left transition-colors
            hover:bg-zinc-100"
        >
          <div
            title={collapsed ? `${displayName} · ${accountType}` : undefined}
            className={`flex items-center py-2 ${
              collapsed ? "justify-center" : "gap-3 px-2"
            }`}
          >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center
            rounded-full bg-zinc-100 text-sm font-semibold">
            {initial}
          </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {displayName}
                </p>
                <p className="text-xs text-zinc-500">{accountType}</p>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Draggable right edge */}
      {!collapsed && (
        <div
          role="separator"
          aria-label="Resize sidebar"
          aria-orientation="vertical"
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
          aria-valuenow={width}
          tabIndex={0}
          onPointerDown={(event) => {
            if (event.button !== 0) return;

            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsResizing(true);
          }}
          onPointerMove={(event) => {
            if (
              !event.currentTarget.hasPointerCapture(event.pointerId)
            ) {
              return;
            }

            const sidebar = event.currentTarget.parentElement;
            if (!sidebar) return;

            const left = sidebar.getBoundingClientRect().left;
            setWidth(clampWidth(event.clientX - left));
          }}
          onPointerUp={(event) => {
            if (
              event.currentTarget.hasPointerCapture(event.pointerId)
            ) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }

            setIsResizing(false);
          }}
          onPointerCancel={() => setIsResizing(false)}
          onLostPointerCapture={() => setIsResizing(false)}
          onKeyDown={(event) => {
            if (
              event.key !== "ArrowLeft" &&
              event.key !== "ArrowRight"
            ) {
              return;
            }

            event.preventDefault();

            const change = event.key === "ArrowRight" ? 10 : -10;

            setWidth((previous) => clampWidth(previous + change));
          }}
            className="group absolute inset-y-0 -right-1 z-20 w-2
              cursor-col-resize touch-none focus-visible:outline-none"
            >
              <div
                className={`pointer-events-none absolute inset-y-0 left-1/2
                  w-px -translate-x-1/2 transition-colors
                  group-hover:bg-black/30
                  group-focus-visible:bg-black/40
                  ${isResizing ? "bg-black/50" : "bg-transparent"}`}
              />
        </div>

      )}

    </aside>
  );
}