export type Schedule = {
  id: number

  period_id: number

  weekday: number

  time: string

  subject_name: string

  subject_id: number

  time_slot_id: number
}

export type LessonSchedule = {
  id: number
}

export type LessonSummary = {
  content: string
}

export type Lesson = {
  id: number

  lesson_date: string

  summary?: LessonSummary | null

  schedules?: LessonSchedule[]
}

export type Period = {
  id: number

  course_id: number

  number: number

  schedules: Schedule[]
}

export type Course = {
  id: number

  name: string

  periods: Period[]
}

export type CalendarEvent = {
  id: string
  schedule_id: number,
  title: string

  start: Temporal.ZonedDateTime

  end: Temporal.ZonedDateTime

  description: string

  lesson_id: number | null
}