import {
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import type { StudentCardData } from "@/app/lib/student-data";

type InvitationState = StudentCardData["invitationState"];

const labels: Record<Exclude<InvitationState, "accepted">, string> = {
  pending: "Awaiting acceptance",
  expired: "Invitation expired",
  cancelled: "Invitation cancelled",
  not_invited: "No invitation sent",
};

export default function InvitationIndicator({
  state,
}: {
  state: InvitationState;
}) {
  if (state === "accepted") {
    return null;
  }

  const label = labels[state];
  const needsAttention = state !== "pending";
  const Icon = needsAttention ? ExclamationTriangleIcon : EnvelopeIcon;

  return (
    <div className="group/invitation relative inline-flex shrink-0">
      <span
        tabIndex={0}
        role="img"
        aria-label={label}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${
          needsAttention ? "text-amber-600" : "text-zinc-400"
        }`}
      >
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>

      {/* Explicit inline styles guarantee the text and background render correctly */}
      <div
        role="tooltip"
        style={{ backgroundColor: "#18181b", color: "#ffffff" }}
        className="pointer-events-none absolute right-0 top-full z-50 mt-1.5 w-max max-w-xs rounded-lg px-3 py-1.5 text-xs font-medium shadow-xl invisible opacity-0 transition-all duration-150 group-hover/invitation:visible group-hover/invitation:opacity-100 group-focus-within/invitation:visible group-focus-within/invitation:opacity-100"
      >
        {label}
      </div>
    </div>
  );
}