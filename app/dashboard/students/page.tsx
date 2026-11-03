import StudentTab from "@/app/ui/students/students-tab";
import { getStudentCards } from "@/app/lib/student-data";

export default async function StudentsPage() {
  const studentCards = await getStudentCards();
  return (
      <StudentTab studentCards={studentCards}/>
)}