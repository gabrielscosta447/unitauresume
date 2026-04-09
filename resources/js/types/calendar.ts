// /types/calendar.ts

export type Schedule = {
  id: number,
  weekday: number
  time: string
  subject: string,
  subject_id: number
  time_slot_id: number
}

export type Period = {

  id: number
  number: number
  schedules: Schedule[]
}

export type Course = {
  id: number
  name: string
  periods: Period[]
}

export type CalendarEvent = {
  id: number,
  title: string
  start: Temporal.ZonedDateTime
  end: Temporal.ZonedDateTime
  description: string,
  lesson_id: number | null
}