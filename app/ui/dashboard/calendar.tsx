const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const sampleLessonDays = [3, 8, 14, 21, 27];

function getCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingWeekday = firstDayOfMonth.getDay();

  const blankDays = Array.from({ length: startingWeekday }, () => null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return [...blankDays, ...monthDays];
}

export default function DashboardCalendar() {
  const today = new Date();
  const calendarDays = getCalendarDays(today);

  const monthName = today.toLocaleString('en-US', { month: 'long' });
  const year = today.getFullYear();
  const currentDay = today.getDate();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Calendar</h2>
          <p className="text-sm text-gray-500">
            {monthName} {year}
          </p>
        </div>

        <div className="rounded-full bg-black px-3 py-1 text-sm text-white">
          {sampleLessonDays.length} lessons
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const hasLesson = day !== null && sampleLessonDays.includes(day);
          const isToday = day === currentDay;

          return (
            <div
              key={index}
              className={`flex h-16 flex-col rounded-xl border p-2 text-sm ${
                day === null
                  ? 'border-transparent bg-transparent'
                  : isToday
                    ? 'border-black bg-gray-100'
                    : 'border-gray-200 bg-white'
              }`}
            >
              {day && (
                <>
                  <span className="font-medium text-gray-900">{day}</span>

                  {hasLesson && (
                    <span className="mt-auto rounded-full bg-black px-2 py-0.5 text-[10px] text-white">
                      Lesson
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}