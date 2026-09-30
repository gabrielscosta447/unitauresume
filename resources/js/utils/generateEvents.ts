import {
  CalendarEvent,
  Period,
  Lesson,
} from '@/types/calendar'

export function generateEvents(
  selectedPeriod: Period | undefined,
  lessons: Lesson[],
  startDate: string,
  endDate: string
): CalendarEvent[] {

  if (!selectedPeriod) {
    return []
  }

  const eventsList: CalendarEvent[] = []

  /*
  |--------------------------------------------------------------------------
  | Data inicial e final
  |--------------------------------------------------------------------------
  */

  let date = Temporal.PlainDate.from(startDate)

  const finalDate =
    Temporal.PlainDate.from(endDate)


  /*
  |--------------------------------------------------------------------------
  | Percorre todos os dias do intervalo
  |--------------------------------------------------------------------------
  */

  while (
    Temporal.PlainDate.compare(date, finalDate) <= 0
  ) {

    const dateString = date.toString()

    /*
    |--------------------------------------------------------------------------
    | Temporal:
    |
    | dayOfWeek:
    |
    | 1 = Segunda
    | 2 = Terça
    | 3 = Quarta
    | 4 = Quinta
    | 5 = Sexta
    | 6 = Sábado
    | 7 = Domingo
    |--------------------------------------------------------------------------
    */

    const weekday = date.dayOfWeek


    /*
    |--------------------------------------------------------------------------
    | Procura os schedules desse dia
    |--------------------------------------------------------------------------
    */

    selectedPeriod.schedules.forEach(schedule => {

      if (schedule.weekday !== weekday) {
        return
      }


      /*
      |--------------------------------------------------------------------------
      | Procura uma Lesson para esse Schedule nessa data
      |--------------------------------------------------------------------------
      */

      const lesson = lessons.find(lesson => {

        if (lesson.lesson_date !== dateString) {
          return false
        }

        return lesson.schedules?.some(
          lessonSchedule =>
            lessonSchedule.id === schedule.id
        )

      })


      /*
      |--------------------------------------------------------------------------
      | Horário inicial
      |--------------------------------------------------------------------------
      */

      const startTime =
        schedule.time.slice(0, 5)


      /*
      |--------------------------------------------------------------------------
      | Horário final
      |--------------------------------------------------------------------------
      */

      const endHour =
        startTime === '19:00'
          ? '21:00'
          : '22:40'


      /*
      |--------------------------------------------------------------------------
      | Início
      |--------------------------------------------------------------------------
      */

      const start =
        Temporal.ZonedDateTime.from(
          `${dateString}T${startTime}:00-03:00[America/Sao_Paulo]`
        )


      /*
      |--------------------------------------------------------------------------
      | Final
      |--------------------------------------------------------------------------
      */

      const end =
        Temporal.ZonedDateTime.from(
          `${dateString}T${endHour}:00-03:00[America/Sao_Paulo]`
        )


      /*
      |--------------------------------------------------------------------------
      | Cria o evento
      |--------------------------------------------------------------------------
      |
      | IMPORTANTE:
      |
      | O Schedule SEMPRE vira um evento.
      |
      | Lesson é opcional.
      |
      |--------------------------------------------------------------------------
      */

      eventsList.push({

        id: `${schedule.id}-${dateString}`,

        title: schedule.subject_name,
  // ID real do Schedule no banco
  schedule_id: schedule.id,
        start,

        end,

        description:
          lesson?.summary?.content ?? '',

        lesson_id:
          lesson?.id ?? null,

      })

    })


    /*
    |--------------------------------------------------------------------------
    | Próximo dia
    |--------------------------------------------------------------------------
    */

    date = date.add({
      days: 1,
    })

  }


  return eventsList
}