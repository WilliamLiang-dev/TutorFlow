"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  addDays,
  createWeekDays,
  formatDateISO,
  getStartOfWeek,
} from "@/app/lib/calendar-utils";

export type CalendarView = "month" | "week" | "day";

type DragStart = {
  x: number;
  y: number;
  pointerId: number;
};

export function useCalendar() {
  const [view, setView] = useState<CalendarView>("week");

  const [weekStartDate, setWeekStartDate] = useState(() =>
    getStartOfWeek(new Date())
  );

  /*
   * Stores where the user first pressed the mouse/finger.
   * useRef is suitable because updating it does not need to
   * re-render the calendar.
   */
  const dragStartRef = useRef<DragStart | null>(null);

  const weekDays = useMemo(
    () => createWeekDays(weekStartDate),
    [weekStartDate]
  );

  const todayISO = formatDateISO(new Date());

  const goToToday = useCallback(() => {
    setWeekStartDate(getStartOfWeek(new Date()));
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setWeekStartDate((current) => addDays(current, -7));
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekStartDate((current) => addDays(current, 7));
  }, []);

  /*
   * Runs when the user presses and holds the calendar.
   */
  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      /*
       * For a mouse, only accept the left button.
       * event.button:
       * 0 = left button
       * 1 = middle button
       * 2 = right button
       */
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
      };

      /*
       * Continue receiving pointer events even if the pointer
       * moves outside the calendar before being released.
       */
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    []
  );

  /*
   * Runs when the user releases the mouse/finger.
   */
  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const start = dragStartRef.current;

      if (!start || start.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;

      /*
       * Only treat the gesture as week navigation when it is
       * more horizontal than vertical.
       */
      const isHorizontalDrag =
        Math.abs(deltaX) > Math.abs(deltaY);

      /*
       * Require at least 70 pixels of horizontal movement.
       * This prevents an ordinary click from switching weeks.
       */
      const passedThreshold = Math.abs(deltaX) >= 70;

      if (isHorizontalDrag && passedThreshold) {
        if (deltaX < 0) {
          /*
           * User dragged towards the left.
           */
          goToNextWeek();
        } else {
          /*
           * User dragged towards the right.
           */
          goToPreviousWeek();
        }

        event.preventDefault();
      }

      if (
        event.currentTarget.hasPointerCapture(event.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(
          event.pointerId
        );
      }

      dragStartRef.current = null;
    },
    [goToNextWeek, goToPreviousWeek]
  );

  /*
   * Cleans up when the browser cancels a pointer gesture,
   * for example when a touch gesture becomes vertical scrolling.
   */
  const handlePointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        event.currentTarget.hasPointerCapture(event.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(
          event.pointerId
        );
      }

      dragStartRef.current = null;
    },
    []
  );

  return {
    view,
    setView,

    weekStartDate,
    weekDays,
    todayISO,

    goToToday,
    goToPreviousWeek,
    goToNextWeek,

    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  };
}