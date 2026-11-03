import { getTutorCards } from "@/app/lib/tutor-data";
import TutorsTab from "@/app/ui/tutors/tutors-tab";

export default async function TutorsPage() {
  const tutorCards = await getTutorCards();

  return <TutorsTab tutorCards={tutorCards} />;
}