import type {
  User,
  Teacher,
  Student,
  TeacherStudent,
  Invitation,
  Lesson,
} from "@/app/lib/definition";

export const users: User[] = [
  {
    id: "user_teacher_1",
    name: "William Liang",
    email: "william@example.com",
    role: "teacher",
    createdAt: "2026-07-01",
  },
  {
    id: "user_teacher_2",
    name: "Mr Lee",
    email: "lee@example.com",
    role: "teacher",
    createdAt: "2026-07-02",
  },
  {
    id: "user_student_1",
    name: "Jason Chan",
    email: "jason.chan@example.com",
    role: "student",
    createdAt: "2026-07-03",
  },
  {
    id: "user_student_2",
    name: "Emily Wong",
    email: "emily.wong@example.com",
    role: "student",
    createdAt: "2026-07-03",
  },
  {
    id: "user_student_3",
    name: "Marcus Lee",
    email: "marcus.lee@example.com",
    role: "student",
    createdAt: "2026-07-04",
  },
];

export const teachers: Teacher[] = [
  {
    id: "user_teacher_1",
    name: "William Liang",
    email: "william@example.com",
    subjects: ["Math", "Physics"],
  },
  {
    id: "user_teacher_2",
    name: "Mr Lee",
    email: "lee@example.com",
    subjects: ["Chemistry", "Biology"],
  },
];

export const students: Student[] = [
  {
    id: "user_student_1",
    name: "Jason Chan",
    level: "F.4",
    subjects: ["Math", "Physics"],
    email: "jason.chan@example.com",
    defaultHourlyRate: 450,
  },
  {
    id: "user_student_2",
    name: "Emily Wong",
    level: "F.5",
    subjects: ["Chemistry"],
    email: "emily.wong@example.com",
    defaultHourlyRate: 500,
  },
  {
    id: "user_student_3",
    name: "Marcus Lee",
    level: "F.3",
    subjects: ["Math"],
    email: "marcus.lee@example.com",
    defaultHourlyRate: 400,
  },
];

export const teacherStudents: TeacherStudent[] = [
  {
    id: "relation_1",
    teacherId: "user_teacher_1",
    studentId: "user_student_1",
    createdAt: "2026-07-05",
  },
  {
    id: "relation_2",
    teacherId: "user_teacher_1",
    studentId: "user_student_2",
    createdAt: "2026-07-05",
  },
  {
    id: "relation_3",
    teacherId: "user_teacher_2",
    studentId: "user_student_2",
    createdAt: "2026-07-06",
  },
  {
    id: "relation_4",
    teacherId: "user_teacher_1",
    studentId: "user_student_3",
    createdAt: "2026-07-06",
  },
];

export const invitations: Invitation[] = [
  {
    id: "invite_1",
    inviterId: "user_teacher_1",
    inviteeEmail: "jason.chan@example.com",
    roleOffered: "student",
    token: "fake_token_jason_123",
    status: "accepted",
    createdAt: "2026-07-03",
    expiresAt: "2026-07-10",
  },
  {
    id: "invite_2",
    inviterId: "user_teacher_1",
    inviteeEmail: "emily.wong@example.com",
    roleOffered: "student",
    token: "fake_token_emily_456",
    status: "accepted",
    createdAt: "2026-07-03",
    expiresAt: "2026-07-10",
  },
  {
    id: "invite_3",
    inviterId: "user_teacher_1",
    inviteeEmail: "new.student@example.com",
    roleOffered: "student",
    token: "fake_token_pending_789",
    status: "pending",
    createdAt: "2026-07-07",
    expiresAt: "2026-07-14",
  },
];

export const lessons: Lesson[] = [
  {
    id: "lesson_1",

    teacherId: "user_teacher_1",
    studentId: "user_student_1",

    subject: "Math",
    date: "2026-07-06",
    startTime: "08:00",
    endTime: "09:30",
    hourlyRate: 450,

    teacherVerified: true,
    studentVerified: false,

    teacherComment:
      "Jason understood factorization better today, but still needs more practice on quadratic equations.",
    homework: "Finish Exercise 3A questions 1-10.",

    status: "pending_student_verification",
    color: "bg-purple-400",
  },
  {
    id: "lesson_2",

    teacherId: "user_teacher_1",
    studentId: "user_student_2",

    subject: "Chemistry",
    date: "2026-07-07",
    startTime: "10:00",
    endTime: "11:30",
    hourlyRate: 500,

    teacherVerified: true,
    studentVerified: true,

    teacherComment:
      "Emily did well on acid-base titration calculations and showed better exam technique.",
    homework: "Revise titration past paper questions.",

    status: "confirmed",
    color: "bg-blue-400",
  },
  {
    id: "lesson_3",

    teacherId: "user_teacher_1",
    studentId: "user_student_3",

    subject: "Math",
    date: "2026-07-09",
    startTime: "13:00",
    endTime: "15:00",
    hourlyRate: 400,

    teacherVerified: false,
    studentVerified: false,

    teacherComment: "",
    homework: "",

    status: "scheduled",
    color: "bg-green-400",
  },
  {
    id: "lesson_4",

    teacherId: "user_teacher_2",
    studentId: "user_student_2",

    subject: "Biology",
    date: "2026-07-10",
    startTime: "16:00",
    endTime: "17:30",
    hourlyRate: 480,

    teacherVerified: true,
    studentVerified: false,

    teacherComment:
      "Emily understood cell structure well, but needs to memorize key terminology more accurately.",
    homework: "Complete cell biology worksheet.",

    status: "pending_student_verification",
    color: "bg-pink-400",
  },
];