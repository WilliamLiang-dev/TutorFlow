export type UserRole = "teacher" | "student";

export type CurrencyCode = "HKD";

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
  email: string;
  level: string;
};


export type Teacher = {
  id: string;
  name: string;
  email: string;
};


export type ConnectionStatus =
  | "active"
  | "inactive"
  | "ended";


export type TeacherStudentConnection = {
  id: string;

  teacherId: string;
  studentId: string;

  cardColor: string;


  createdAt: string;
  status: ConnectionStatus;
};


export type AssignmentStatus =
  | "active"
  | "inactive"
  | "ended";

export type TeachingAssignment = {
  id: string;

  connectionId: string;

  subject: string;

  defaultHourlyRate: number;

  createdAt: string;
  status: AssignmentStatus;
};

export type InvitationStatus =
  | "pending"
  | "accepted"
  | "expired"
  | "cancelled";

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


export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type RecurringSeriesStatus =
  | "active"
  | "paused"
  | "ended";

export type RecurringLessonSeries = {
  id: string;

  assignmentId: string;

  status: RecurringSeriesStatus;

  createdAt: string;
  endedAt: string | null;
};


export type RecurringLessonScheduleVersion = {
  id: string;

  seriesId: string;

  dayOfWeek: Weekday;
  startTime: string;
  endTime: string;

  intervalWeeks: number;

  effectiveFrom: string;

  effectiveUntil: string | null;

  hourlyRateOverride: number | null;

  createdByUserId: string;
  createdAt: string;
};


export type ScheduleChangeRequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export type ScheduleChangeRequest = {
  id: string;

  seriesId: string;

  requestedByUserId: string;

  effectiveFrom: string;

  proposedDayOfWeek: Weekday;
  proposedStartTime: string;
  proposedEndTime: string;

  proposedHourlyRateOverride: number | null;

  status: ScheduleChangeRequestStatus;

  respondedByUserId: string | null;

  createdAt: string;
  respondedAt: string | null;
};


export type LessonSource =
  | "recurring"
  | "manual";

export type LessonStatus =
  | "scheduled"
  | "pending_verification"
  | "confirmed"
  | "cancelled";

export type Lesson = {
  id: string;

  assignmentId: string;


  scheduleVersionId: string | null;

  source: LessonSource;

  occurrenceDate: string | null;

  date: string;
  startTime: string;
  endTime: string;

  subjectSnapshot: string;
  hourlyRate: number;
  currency: CurrencyCode;

  teacherVerified: boolean;
  studentVerified: boolean;

  teacherComment: string;
  homework: string;

  status: LessonStatus;

  createdByUserId: string;
  updatedByUserId: string;

  cancelledByUserId: string | null;
  cancellationReason: string | null;

  createdAt: string;
  updatedAt: string;
};