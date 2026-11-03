import { notFound } from "next/navigation";

import Sidebar from "@/app/ui/dashboard/sidebar";
import TutorsTab from "@/app/ui/tutors/tutors-tab";
import type { TutorCardData } from "@/app/lib/tutor-data";

const sampleTutors: TutorCardData[] = [
  {
    connectionId: "preview-connection-1",
    teacherId: "preview-teacher-1",
    displayName: "William",
    subjects: ["Mathematics", "Programming"],
    nickname: null,
    nextLesson: null,
  },
  {
    connectionId: "preview-connection-2",
    teacherId: "preview-teacher-2",
    displayName: "Jamie",
    subjects: ["Physics"],
    nickname: null,
    nextLesson: null,
  },
];

export default function TutorsPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <Sidebar name="Test Student" role="student" />

      <main className="h-full min-w-0 flex-1 overflow-hidden px-5 pb-6 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pb-10 lg:pt-14">
        <TutorsTab tutorCards={sampleTutors} />
      </main>
    </div>
  );
}