export type UserRole = "teacher" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type Student = {
  id: string;
  name: string;
  level: string;
  subjects: string[];
  email: string;
  defaultHourlyRate: number;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  subjects: string[];
};

export type AssignmentStatus = "active" | "inactive" | "ended";

export type TeachingAssignment = {
  id: string;

  teacherId: string;
  studentId: string;

  subject: string;
  hourlyRate: number;

  createdAt: string;
  status: AssignmentStatus;
};

export type InvitationStatus = "pending" | "accepted" | "expired" | "cancelled";

export type Invitation = {
  id: string;
  inviterId: string;
  inviteeEmail: string;
  roleOffered: UserRole;
  token: string;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
};

export type LessonStatus =
  | "scheduled"
  | "pending_student_verification"
  | "confirmed"
  | "cancelled";

export type Lesson = {
  id: string;

  assignmentId: string;

  date: string;
  startTime: string;
  endTime: string;

  teacherVerified: boolean;
  studentVerified: boolean;

  teacherComment: string;
  homework: string;

  status: LessonStatus;
  color: string;
};