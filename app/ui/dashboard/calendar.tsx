"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function TutorCalendar() {
  return (
    <div className="h-full overflow-hidden">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        height="100%"
        expandRows={true}
        allDaySlot={false}
        initialDate="2026-07-05"
        events={[
          {
            title: "Math Lesson",
            start: "2026-07-06T10:00:00",
            end: "2026-07-06T11:30:00",
          },
          {
            title: "Physics Lesson",
            start: "2026-07-08T14:00:00",
            end: "2026-07-08T15:30:00",
          },
        ]}
      />
    </div>
  );
}