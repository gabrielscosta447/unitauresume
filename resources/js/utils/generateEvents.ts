// /utils/generateEvents.ts

import { CalendarEvent, Period } from '@/types/calendar'

export function generateEvents(
  selectedPeriod: Period | undefined,
  today: Temporal.PlainDate,
  lessons: any[]
): CalendarEvent[] {

  if (!selectedPeriod) return []

  const eventsList: CalendarEvent[] = []

  const startOfYear = Temporal.PlainDate.from({
    year: today.year,
    month: 1,
    day: 1,
  })

  const endOfYear = Temporal.PlainDate.from({
    year: today.year,
    month: 12,
    day: 31,
  })

  for (
    let date = startOfYear;
    Temporal.PlainDate.compare(date, endOfYear) <= 0;
    date = date.add({ days: 1 })
  ) {

    const dateString = date.toString()

    const weekday = date.dayOfWeek

    const grouped: Record<
      string,
      {
        id: number
        time: string
        subject_id: number
        time_slot_id: number
      }[]
    > = {}

    selectedPeriod.schedules.forEach(s => {

      if (s.weekday === weekday) {

        if (!grouped[s.subject])
          grouped[s.subject] = []

        grouped[s.subject].push({
          id: s.id,
          time: s.time,
          subject_id: s.subject_id,
          time_slot_id: s.time_slot_id
        })

      }

    })

    Object.entries(grouped).forEach(
      ([subject, schedules]) => {

        const sortedSchedules =
          schedules.sort((a, b) =>
            a.time.localeCompare(b.time)
          )

        const firstSchedule =
          sortedSchedules[0]

        const startTime =
          firstSchedule.time.slice(0, 5)

        const lastTime =
          sortedSchedules[
            sortedSchedules.length - 1
          ].time.slice(0, 5)

        const scheduleId =
          firstSchedule.id

        const subjectId =
          firstSchedule.subject_id

        const timeSlotId =
          firstSchedule.time_slot_id

        const endHour =
          lastTime === '19:00'
            ? '21:00'
            : '22:40'

        const start =
          Temporal.ZonedDateTime.from(
            `${date}T${startTime}:00-03:00[America/Sao_Paulo]`
          )

        const end =
          Temporal.ZonedDateTime.from(
            `${date}T${endHour}:00-03:00[America/Sao_Paulo]`
          )
console.log(lessons)
        // 🎯 FILTRO CORRETO
const lessonMatch =
  lessons.find(
    l =>
      l.lesson_date === dateString &&
      l.schedules?.some(
        (s: { id: number }) =>
          s.id === scheduleId
      )
  )
  
   
        eventsList.push({

          id: scheduleId,

          title: subject,

          start,
          end,

          description:
            lessonMatch?.summary?.content ?? '',

          lesson_id:
            lessonMatch?.id ?? null,

        })

      }
    )

  }

  return eventsList
}