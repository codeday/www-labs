import { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar, Views, luxonLocalizer } from 'react-big-calendar';
import { DateTime } from 'luxon';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DnDCalendar = withDragAndDrop(Calendar);
const DAY_NAMES = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

// https://stackoverflow.com/questions/22784883/check-if-more-than-two-date-ranges-overlap
function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
  if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
  if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
  if (b_start <  a_start && a_end   <  b_end) return true; // a in b
  return false;
}

export default function TimeManagementPlan ({ onChange, starts }) {
  const [myEvents, setEvents] = useState([]);
  const [copyEvent, setCopyEvent] = useState(true)
  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const overlappingEvents = myEvents.filter((e) => dateRangeOverlaps(start, end, e.start, e.end));
      const durationMins = (end - start)/(60*1000);
      if (durationMins < 90 || overlappingEvents.length !== 0) return;
      setEvents((prev) => [...prev, { start, end, title: 'Work Time', id: Math.random() }])
    },
    [setEvents, myEvents]
  );

  useEffect(() => {
    let totalHours = 0;
    const days = Object.fromEntries(DAY_NAMES.map((d) => [d, []]));
    for (const event of myEvents) {
      totalHours += (event.end - event.start)/(1000*60*60);
      days[DAY_NAMES[event.start.getDay()]].push({
        start: (event.start.getHours() * 60 + event.start.getMinutes()),
        end: (event.end.getHours() * 60 + event.end.getMinutes()),
      });
    }
    if (onChange) onChange(totalHours, days);
  }, [myEvents]);

  const handleSelectEvent = useCallback((e) => {
    setEvents((prev) => prev.filter((p) => e.id !== p.id))
  });

  const localizer = luxonLocalizer(DateTime);
  const toggleCopyEvent = useCallback(() => setCopyEvent((val) => !val), [])

  const moveEvent = useCallback(
    ({
      event,
      start,
      end,
      resourceId,
      isAllDay: droppedOnAllDaySlot = false,
    }) => {
      const overlappingEvents = myEvents
        .filter((e) => e.id !== event.id)
        .filter((e) => dateRangeOverlaps(start, end, e.start, e.end));
      const durationMins = (end - start)/(60*1000);
      if (durationMins < 90 || overlappingEvents.length !== 0) return;

      if (Array.isArray(event.resourceId)) {
        if (copyEvent) {
          resourceId = [...new Set([...event.resourceId, resourceId])]
        } else {
          const filtered = event.resourceId.filter(
            (ev) => ev !== event.sourceResource
          )
          resourceId = [...new Set([...filtered, resourceId])]
        }
      } else if (copyEvent) {
        resourceId = [...new Set([event.resourceId, resourceId])]
      }

      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, resourceId }]
      })
    },
    [setEvents, copyEvent, myEvents]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {

      const overlappingEvents = myEvents
        .filter((e) => e.id !== event.id)
        .filter((e) => dateRangeOverlaps(start, end, e.start, e.end));
      const durationMins = (end - start)/(60*1000);
      if (durationMins < 90 || overlappingEvents.length !== 0) return;

      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end }]
      })
    },
    [setEvents]
  )

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: starts,
      scrollToTime: new Date(1972, 0, 1, 8),
    }),
    []
  )

  return (
    <>
      <style>{'.rbc-allday-cell { display:none; }'}</style>
      <DnDCalendar
        toolbar={false}
        allDayAccessor={false}
        dayLayoutAlgorithm={'no-overlap'}
        defaultDate={defaultDate}
        defaultView={Views.WEEK}
        events={myEvents}
        localizer={localizer}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        resizable
        selectable
        scrollToTime={scrollToTime}
      />
    </>
  )
}