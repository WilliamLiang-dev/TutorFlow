import Calendar from "@/app/ui/dashboard/calendar";

export default function Page() {
  return (
    <section className="h-full overflow-hidden rounded-[32px] border border-black/20 bg-white/30 p-8 shadow-none backdrop-blur-none">
      <Calendar />
    </section>
  );
}