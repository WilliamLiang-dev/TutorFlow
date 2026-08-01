import type {
  User,
  Teacher,
  Student,
  TeacherStudentConnection,
  TeachingAssignment,
  Invitation,
  RecurringLessonSeries,
  RecurringLessonScheduleVersion,
  ScheduleChangeRequest,
  Lesson,
} from "@/app/lib/definition";

/* =========================================================
   Users
   ========================================================= */

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
  },
  {
    id: "user_teacher_2",
    name: "Mr Lee",
    email: "lee@example.com",
  },
];

export const students: Student[] = [
  {
    id: "user_student_1",
    name: "Jason Chan",
    email: "jason.chan@example.com",
    level: "F.4",
  },
  {
    id: "user_student_2",
    name: "Emily Wong",
    email: "emily.wong@example.com",
    level: "F.5",
  },
  {
    id: "user_student_3",
    name: "Marcus Lee",
    email: "marcus.lee@example.com",
    level: "F.3",
  },
];


export const teacherStudentConnections: TeacherStudentConnection[] = [
  {
    id: "connection_1",
    teacherId: "user_teacher_1",
    studentId: "user_student_1",
    cardColor: "#AF52DE",
    createdAt: "2026-07-05",
    status: "active",
  },
  {
    id: "connection_2",
    teacherId: "user_teacher_2",
    studentId: "user_student_1",
    cardColor: "#007AFF",
    createdAt: "2026-07-05",
    status: "active",
  },
  {
    id: "connection_3",
    teacherId: "user_teacher_1",
    studentId: "user_student_2",
    cardColor: "#5AC8FA",
    createdAt: "2026-07-06",
    status: "active",
  },
  {
    id: "connection_4",
    teacherId: "user_teacher_2",
    studentId: "user_student_2",
    cardColor: "#FF9500",
    createdAt: "2026-07-06",
    status: "active",
  },
  {
    id: "connection_5",
    teacherId: "user_teacher_1",
    studentId: "user_student_3",
    cardColor: "#34C759",
    createdAt: "2026-07-06",
    status: "active",
  },
];


export const teachingAssignments: TeachingAssignment[] = [
  {
    id: "assignment_1",
    connectionId: "connection_1",
    subject: "Math",
    defaultHourlyRate: 450,
    createdAt: "2026-07-05",
    status: "active",
  },
  {
    id: "assignment_2",
    connectionId: "connection_2",
    subject: "Physics",
    defaultHourlyRate: 480,
    createdAt: "2026-07-05",
    status: "active",
  },
  {
    id: "assignment_3",
    connectionId: "connection_3",
    subject: "Chemistry",
    defaultHourlyRate: 500,
    createdAt: "2026-07-06",
    status: "active",
  },
  {
    id: "assignment_4",
    connectionId: "connection_4",
    subject: "Biology",
    defaultHourlyRate: 480,
    createdAt: "2026-07-06",
    status: "active",
  },
  {
    id: "assignment_5",
    connectionId: "connection_5",
    subject: "Math",
    defaultHourlyRate: 400,
    createdAt: "2026-07-06",
    status: "active",
  },
  {
    id: "assignment_6",
    connectionId: "connection_4",
    subject: "Chemistry",
    defaultHourlyRate: 520,
    createdAt: "2026-07-07",
    status: "active",
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


export const recurringLessonSeries: RecurringLessonSeries[] = [
  {
    id: "series_1",
    assignmentId: "assignment_1",
    status: "active",
    createdAt: "2026-05-04",
    endedAt: null,
  },
  {
    id: "series_2",
    assignmentId: "assignment_3",
    status: "active",
    createdAt: "2026-06-02",
    endedAt: null,
  },
  {
    id: "series_3",
    assignmentId: "assignment_5",
    status: "active",
    createdAt: "2026-06-04",
    endedAt: null,
  },
  {
    id: "series_4",
    assignmentId: "assignment_4",
    status: "active",
    createdAt: "2026-06-05",
    endedAt: null,
  },
  {
    id: "series_5",
    assignmentId: "assignment_6",
    status: "active",
    createdAt: "2026-06-03",
    endedAt: null,
  },
];

export const recurringLessonScheduleVersions: RecurringLessonScheduleVersion[] =
  [
    {
      id: "schedule_version_1_old",
      seriesId: "series_1",
      dayOfWeek: "monday",
      startTime: "16:00",
      endTime: "17:30",
      intervalWeeks: 1,
      effectiveFrom: "2026-05-04",
      effectiveUntil: "2026-07-05",
      hourlyRateOverride: null,
      createdByUserId: "user_teacher_1",
      createdAt: "2026-05-04",
    },
    {
      id: "schedule_version_1_current",
      seriesId: "series_1",
      dayOfWeek: "monday",
      startTime: "08:00",
      endTime: "09:30",
      intervalWeeks: 1,
      effectiveFrom: "2026-07-06",
      effectiveUntil: null,
      hourlyRateOverride: null,
      createdByUserId: "user_teacher_1",
      createdAt: "2026-07-04",
    },
    {
      id: "schedule_version_2_current",
      seriesId: "series_2",
      dayOfWeek: "tuesday",
      startTime: "10:00",
      endTime: "11:30",
      intervalWeeks: 1,
      effectiveFrom: "2026-06-02",
      effectiveUntil: null,
      hourlyRateOverride: null,
      createdByUserId: "user_teacher_1",
      createdAt: "2026-06-02",
    },
    {
      id: "schedule_version_3_current",
      seriesId: "series_3",
      dayOfWeek: "thursday",
      startTime: "13:00",
      endTime: "15:00",
      intervalWeeks: 1,
      effectiveFrom: "2026-06-04",
      effectiveUntil: null,
      hourlyRateOverride: null,
      createdByUserId: "user_teacher_1",
      createdAt: "2026-06-04",
    },
    {
      id: "schedule_version_4_current",
      seriesId: "series_4",
      dayOfWeek: "friday",
      startTime: "16:00",
      endTime: "17:30",
      intervalWeeks: 1,
      effectiveFrom: "2026-06-05",
      effectiveUntil: null,
      hourlyRateOverride: null,
      createdByUserId: "user_teacher_2",
      createdAt: "2026-06-05",
    },
    {
      id: "schedule_version_5_current",
      seriesId: "series_5",
      dayOfWeek: "wednesday",
      startTime: "14:00",
      endTime: "15:30",
      intervalWeeks: 1,
      effectiveFrom: "2026-06-03",
      effectiveUntil: null,

      /*
       * This series uses HK$550 instead of the assignment
       * default of HK$520.
       */
      hourlyRateOverride: 550,

      createdByUserId: "user_teacher_2",
      createdAt: "2026-06-03",
    },
  ];

/* =========================================================
   Schedule change requests
   ========================================================= */

/*
 * This accepted request produced Jason's new schedule version.
 */
export const scheduleChangeRequests: ScheduleChangeRequest[] = [
  {
    id: "schedule_request_1",
    seriesId: "series_1",
    requestedByUserId: "user_teacher_1",
    effectiveFrom: "2026-07-06",
    proposedDayOfWeek: "monday",
    proposedStartTime: "08:00",
    proposedEndTime: "09:30",
    proposedHourlyRateOverride: null,
    status: "accepted",
    respondedByUserId: "user_student_1",
    createdAt: "2026-07-03",
    respondedAt: "2026-07-04",
  },
];


export const lessons: Lesson[] = [
  {
    id: "lesson_1",
    assignmentId: "assignment_1",

    scheduleVersionId: "schedule_version_1_current",
    source: "recurring",
    occurrenceDate: "2026-07-06",

    date: "2026-07-06",
    startTime: "08:00",
    endTime: "09:30",

    subjectSnapshot: "Math",
    hourlyRate: 450,
    currency: "HKD",

    teacherVerified: true,
    studentVerified: false,

    teacherComment:
      "Jason understood factorization better today, but still needs more practice on quadratic equations.",
    homework: "Finish Exercise 3A questions 1-10.",

    status: "pending_verification",

    createdByUserId: "user_teacher_1",
    updatedByUserId: "user_teacher_1",

    cancelledByUserId: null,
    cancellationReason: null,

    createdAt: "2026-06-29",
    updatedAt: "2026-07-06",
  },
  {
    id: "lesson_2",
    assignmentId: "assignment_3",

    scheduleVersionId: "schedule_version_2_current",
    source: "recurring",
    occurrenceDate: "2026-07-07",

    date: "2026-07-07",
    startTime: "10:00",
    endTime: "11:30",

    subjectSnapshot: "Chemistry",
    hourlyRate: 500,
    currency: "HKD",

    teacherVerified: true,
    studentVerified: true,

    teacherComment:
      "Emily did well on acid-base titration calculations and showed better exam technique.",
    homework: "Revise titration past paper questions.",

    status: "confirmed",

    createdByUserId: "user_teacher_1",
    updatedByUserId: "user_student_2",

    cancelledByUserId: null,
    cancellationReason: null,

    createdAt: "2026-06-30",
    updatedAt: "2026-07-07",
  },
  {
    id: "lesson_3",
    assignmentId: "assignment_5",

    scheduleVersionId: "schedule_version_3_current",
    source: "recurring",
    occurrenceDate: "2026-07-09",

    date: "2026-07-09",
    startTime: "13:00",
    endTime: "15:00",

    subjectSnapshot: "Math",
    hourlyRate: 400,
    currency: "HKD",

    teacherVerified: false,
    studentVerified: false,

    teacherComment: "",
    homework: "",

    status: "scheduled",

    createdByUserId: "user_teacher_1",
    updatedByUserId: "user_teacher_1",

    cancelledByUserId: null,
    cancellationReason: null,

    createdAt: "2026-07-02",
    updatedAt: "2026-07-02",
  },
  {
    id: "lesson_4",
    assignmentId: "assignment_4",

    scheduleVersionId: "schedule_version_4_current",
    source: "recurring",
    occurrenceDate: "2026-07-10",

    date: "2026-07-10",
    startTime: "16:00",
    endTime: "17:30",

    subjectSnapshot: "Biology",
    hourlyRate: 480,
    currency: "HKD",

    teacherVerified: true,
    studentVerified: false,

    teacherComment:
      "Emily understood cell structure well, but needs to memorize key terminology more accurately.",
    homework: "Complete cell biology worksheet.",

    status: "pending_verification",

    createdByUserId: "user_teacher_2",
    updatedByUserId: "user_teacher_2",

    cancelledByUserId: null,
    cancellationReason: null,

    createdAt: "2026-07-03",
    updatedAt: "2026-07-10",
  },
  {
    id: "lesson_5",
    assignmentId: "assignment_6",

    scheduleVersionId: "schedule_version_5_current",
    source: "recurring",
    occurrenceDate: "2026-07-08",

    date: "2026-07-08",
    startTime: "14:00",
    endTime: "15:30",

    subjectSnapshot: "Chemistry",

    /*
     * This uses the schedule override rather than the
     * assignment default of HK$520.
     */
    hourlyRate: 550,

    currency: "HKD",

    teacherVerified: true,
    studentVerified: true,

    teacherComment:
      "Emily reviewed mole calculations with Mr Lee and improved accuracy in multi-step questions.",
    homework: "Complete mole calculation worksheet.",

    status: "confirmed",

    createdByUserId: "user_teacher_2",
    updatedByUserId: "user_student_2",

    cancelledByUserId: null,
    cancellationReason: null,

    createdAt: "2026-07-01",
    updatedAt: "2026-07-08",
  },

  /*
   * Extra manually added lesson.
   *
   * It has no schedule version and no recurring occurrence date.
   */
  {
    id: "lesson_6",
    assignmentId: "assignment_1",

    scheduleVersionId: null,
    source: "manual",
    occurrenceDate: null,

    date: "2026-07-11",
    startTime: "11:00",
    endTime: "12:30",

    subjectSnapshot: "Math",
    hourlyRate: 500,
    currency: "HKD",

    teacherVerified: false,
    studentVerified: true,

    teacherComment: "",
    homework: "Prepare questions from the quadratic equations revision.",

    status: "pending_verification",

    /*
     * Jason requested this extra lesson.
     */
    createdByUserId: "user_student_1",
    updatedByUserId: "user_student_1",

    cancelledByUserId: null,
    cancellationReason: null,

    createdAt: "2026-07-09",
    updatedAt: "2026-07-09",
  },

  /*
   * Cancelled recurring occurrence.
   *
   * The record remains so that the lesson generator does not
   * recreate this date later.
   */
  {
    id: "lesson_7",
    assignmentId: "assignment_3",

    scheduleVersionId: "schedule_version_2_current",
    source: "recurring",
    occurrenceDate: "2026-07-14",

    date: "2026-07-14",
    startTime: "10:00",
    endTime: "11:30",

    subjectSnapshot: "Chemistry",
    hourlyRate: 500,
    currency: "HKD",

    teacherVerified: false,
    studentVerified: false,

    teacherComment: "",
    homework: "",

    status: "cancelled",

    createdByUserId: "user_teacher_1",
    updatedByUserId: "user_student_2",

    cancelledByUserId: "user_student_2",
    cancellationReason: "School activity",

    createdAt: "2026-07-07",
    updatedAt: "2026-07-12",
  },
];