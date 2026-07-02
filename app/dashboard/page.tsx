import TutorCalendar from "@/app/ui/dashboard/calendar";

export default function Page() {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[32px] bg-gradient-to-br from-lime-200 via-white to-violet-100 p-8">
      <div className="min-h-0 flex-1 overflow-hidden rounded-[28px] bg-white/90 p-4 shadow-sm">
        <TutorCalendar />
      </div>
    </section>
  );
}
