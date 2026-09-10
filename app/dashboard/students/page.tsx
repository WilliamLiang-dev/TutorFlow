import StudentTab from "@/app/ui/students/students-tab";
import { getStudentCards } from "@/app/lib/student-data";

export default async function StudentsPage() {
  const studentCards = await getStudentCards();
  return (
    <section className="h-full overflow-hidden rounded-[32px] border border-black/20 bg-white/30 p-8 shadow-none backdrop-blur-none">
      <StudentTab studentCards={studentCards}/>
    </section>
)}