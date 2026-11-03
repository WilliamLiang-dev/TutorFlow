import MiniCalendar from "@/app/ui/dashboard/mini-calendar";

export default function StudentDashboard({
  name,
}: {
  name: string;
}) {
  const now = new Date();
  const timeZone = "Asia/Hong_Kong";

  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const getPart = (type: string) =>
    dateParts.find((part) => part.type === type)?.value ?? "";

  const todayKey =
    `${getPart("year")}-${getPart("month")}-${getPart("day")}`;

  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(now),
  );

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <header className="mb-8">
            <p className="text-sm text-gray-500">{dateLabel}</p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {greeting}, {name}
            </h1>
          </header>

          <section
            aria-labelledby="next-lesson-heading"
            className="rounded-2xl border border-dashed border-black/20 px-6 py-12 text-center"
          >
            <div className="mx-auto max-w-sm">
              <h2
                id="next-lesson-heading"
                className="text-xl font-semibold"
              >
                Welcome to TutorFlow
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Your upcoming lessons will appear here once
                your tutor schedules them.
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <MiniCalendar todayKey={todayKey} />

          <section
            aria-labelledby="notifications-heading"
            className="rounded-2xl border border-black/10 p-5"
          >
            <h2
              id="notifications-heading"
              className="text-base font-semibold"
            >
              Notifications
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Lesson updates and requests for your confirmation
              will appear here.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}