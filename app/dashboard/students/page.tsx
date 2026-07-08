import StudentsTabs from "@/app/ui/students/students-tab";

export default function StudentsPage() {
  return (
    <section className="h-full overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#F6E7D8_0%,#D9B08C_50%,#A76F5A_100%)] p-8">
      <StudentsTabs />
    </section>
  );
}