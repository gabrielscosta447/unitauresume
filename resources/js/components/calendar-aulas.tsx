import {
  useCalendarApp,
  ScheduleXCalendar,
} from '@schedule-x/react'

import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'

import { createEventsServicePlugin } from '@schedule-x/events-service'

import 'temporal-polyfill/global'
import '@schedule-x/theme-shadcn/dist/index.css'

import ReactMarkdown from 'react-markdown'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { router } from '@inertiajs/react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { generateEvents } from '@/utils/generateEvents'

import type {
  CalendarEvent,
  Lesson,
  Period,
} from '@/types/calendar'

import UploadSection from './upload-section'


type Props = {
  selectedPeriod: Period | undefined

  adminRequest: boolean

  lessons: Lesson[]

  filters: {
    start_date: string
    end_date: string
  }
}


export default function CalendarAulas({
  selectedPeriod,
  adminRequest,
  lessons,
  filters,
}: Props) {

  /*
  |--------------------------------------------------------------------------
  | Evento selecionado
  |--------------------------------------------------------------------------
  */
const link = adminRequest ? '/dashboard' : '/'
  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEvent | null>(null)

  const [dialogOpen, setDialogOpen] =
    useState(false)


  /*
  |--------------------------------------------------------------------------
  | Intervalo atualmente visualizado
  |--------------------------------------------------------------------------
  |
  | O backend fornece o intervalo inicial.
  |
  | Depois disso, o Schedule-X atualiza esse estado
  | sempre que o usuário muda o intervalo visualizado.
  |
  */

  const [dateRange, setDateRange] = useState({
    start_date: filters.start_date,
    end_date: filters.end_date,
  })


  /*
  |--------------------------------------------------------------------------
  | Plugin de eventos
  |--------------------------------------------------------------------------
  */

  const eventsService = useState(
    () => createEventsServicePlugin()
  )[0]


  /*
  |--------------------------------------------------------------------------
  | Estado do calendário
  |--------------------------------------------------------------------------
  */

  const [calendarReady, setCalendarReady] =
    useState(false)


  /*
  |--------------------------------------------------------------------------
  | Sincroniza o estado local quando o Laravel
  | devolver novos filtros
  |--------------------------------------------------------------------------
  |
  | Isso é importante caso outra ação da página
  | altere os filtros.
  |
  */

  useEffect(() => {

    setDateRange({
      start_date: filters.start_date,
      end_date: filters.end_date,
    })

  }, [
    filters.start_date,
    filters.end_date,
  ])


  /*
  |--------------------------------------------------------------------------
  | Gera os eventos
  |--------------------------------------------------------------------------
  */

  const events = useMemo(() => {

    return generateEvents(
      selectedPeriod,
      lessons,
      dateRange.start_date,
      dateRange.end_date
    )

  }, [
    selectedPeriod,
    lessons,
    dateRange.start_date,
    dateRange.end_date,
  ])


  /*
  |--------------------------------------------------------------------------
  | Busca aulas pelo intervalo visualizado
  |--------------------------------------------------------------------------
  */

  function loadLessonsByDate(
    startDate: string,
    endDate: string
  ) {

    if (!selectedPeriod) {
      return
    }

    router.get(
      link,
      {
        /*
        |----------------------------------------------------------------------
        | Mantém o mesmo curso
        |----------------------------------------------------------------------
        */

        course:
          selectedPeriod.course_id,

        /*
        |----------------------------------------------------------------------
        | Mantém o mesmo período
        |----------------------------------------------------------------------
        */

        period:
          selectedPeriod.id,

        /*
        |----------------------------------------------------------------------
        | Novo intervalo visualizado
        |----------------------------------------------------------------------
        */

        start_date:
          startDate,

        end_date:
          endDate,
      },
      {
        /*
        |----------------------------------------------------------------------
        | Não perde o estado da página
        |----------------------------------------------------------------------
        */

        preserveState: true,

        preserveScroll: true,

        replace: true,

        /*
        |----------------------------------------------------------------------
        | NÃO recarregamos selectedPeriod.
        |
        | O período selecionado continua sendo o mesmo.
        |----------------------------------------------------------------------
        */

        only: [
          'selectedPeriod',
          'lessons',
          'filters',
        ],
      }
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Calendário
  |--------------------------------------------------------------------------
  */

  const calendar = useCalendarApp({

    locale: 'pt-BR',

    theme: 'shadcn',

    isDark: true,

    timezone: 'America/Sao_Paulo',
selectedDate:
  Temporal.PlainDate.from(dateRange.start_date),

    /*
    |--------------------------------------------------------------------------
    | Eventos iniciais
    |--------------------------------------------------------------------------
    */

    events,


    /*
    |--------------------------------------------------------------------------
    | Visualizações
    |--------------------------------------------------------------------------
    */

    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],


    /*
    |--------------------------------------------------------------------------
    | Horários
    |--------------------------------------------------------------------------
    */

    dayBoundaries: {
      start: '19:00',
      end: '23:00',
    },


    weekOptions: {
      gridStep: 30,

      nDays: 5,

      gridHeight: 800,
    },


    /*
    |--------------------------------------------------------------------------
    | Plugins
    |--------------------------------------------------------------------------
    */

    plugins: [
      eventsService,
    ],


    /*
    |--------------------------------------------------------------------------
    | Limites do calendário
    |--------------------------------------------------------------------------
    */

    minDate:
      Temporal.PlainDate.from('2026-01-01'),

    maxDate:
      Temporal.Now.plainDateISO(),


    /*
    |--------------------------------------------------------------------------
    | Callbacks
    |--------------------------------------------------------------------------
    */

    callbacks: {


      /*
      |--------------------------------------------------------------------------
      | Calendário terminou de inicializar
      |--------------------------------------------------------------------------
      */

      onRender() {

        setCalendarReady(true)

      },


      /*
      |--------------------------------------------------------------------------
      | Clique em uma aula
      |--------------------------------------------------------------------------
      */

      onEventClick(calendarEvent: any) {

        const formatted: CalendarEvent = {

          ...calendarEvent,

          id:
            Number(calendarEvent.id),

          description:
            calendarEvent.description || '',

        }


        setSelectedEvent(formatted)

        setDialogOpen(true)

      },


      /*
      |--------------------------------------------------------------------------
      | Usuário mudou o intervalo visualizado
      |--------------------------------------------------------------------------
      |
      | Exemplos:
      |
      | Semana:
      | 2026-08-03 → 2026-08-07
      |
      | Próxima semana:
      | 2026-08-10 → 2026-08-14
      |
      | Mês:
      | intervalo correspondente ao mês visualizado
      |
      */

      onRangeUpdate(range: any) {

        if (!selectedPeriod) {
          return
        }


        /*
        |--------------------------------------------------------------------------
        | Schedule-X pode fornecer ZonedDateTime.
        |
        | Como o banco usa DATE, transformamos para:
        |
        | YYYY-MM-DD
        |
        |--------------------------------------------------------------------------
        */

        const startDate =
          range.start
            .toPlainDate()
            .toString()


        const endDate =
          range.end
            .toPlainDate()
            .toString()


        /*
        |--------------------------------------------------------------------------
        | Debug
        |--------------------------------------------------------------------------
        */

        console.log(
          'Intervalo visualizado:',
          {
            startDate,
            endDate,
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Atualiza imediatamente o filtro local
        |--------------------------------------------------------------------------
        */

        setDateRange({
          start_date:
            startDate,

          end_date:
            endDate,
        })


        /*
        |--------------------------------------------------------------------------
        | Evita requisição desnecessária
        |--------------------------------------------------------------------------
        */

        if (
          startDate === filters.start_date &&
          endDate === filters.end_date
        ) {
          return
        }


        /*
        |--------------------------------------------------------------------------
        | Busca somente as aulas do intervalo
        |--------------------------------------------------------------------------
        */

        loadLessonsByDate(
          startDate,
          endDate
        )

      },

    },

  })


  /*
  |--------------------------------------------------------------------------
  | Atualiza os eventos
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!calendarReady) {
      return
    }

    eventsService.set(events)

  }, [
    events,
    calendarReady,
    eventsService,
  ])


  /*
  |--------------------------------------------------------------------------
  | Nenhum período selecionado
  |--------------------------------------------------------------------------
  */

  if (!selectedPeriod) {
    return null
  }


  /*
  |--------------------------------------------------------------------------
  | Formatação da data do evento
  |--------------------------------------------------------------------------
  */

  function formatEventDate(
    event: CalendarEvent | null
  ) {

    if (!event) {
      return null
    }


    const start = event.start

    const end = event.end


    const weekday =
      start.toLocaleString(
        'pt-BR',
        {
          weekday: 'long',
        }
      )


    const date =
      start.toLocaleString(
        'pt-BR',
        {
          day: '2-digit',

          month: '2-digit',

          year: 'numeric',
        }
      )


    const startTime =
      start.toLocaleString(
        'pt-BR',
        {
          hour: '2-digit',

          minute: '2-digit',
        }
      )


    const endTime =
      end.toLocaleString(
        'pt-BR',
        {
          hour: '2-digit',

          minute: '2-digit',
        }
      )


    return {

      weekday,

      date,

      time:
        `${startTime} — ${endTime}`,

    }

  }


  const formattedDate =
    formatEventDate(selectedEvent)


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */
function handleSummaryGenerated(summary: string) {
  setSelectedEvent(prev => {
    if (!prev) {
      return prev
    }

    return {
      ...prev,
      description: summary,
    }
  })
}
  return (

    <>

      {/* --------------------------------------------------------------- */}
      {/* CALENDÁRIO                                                      */}
      {/* --------------------------------------------------------------- */}

      <div
        style={
          {
            '--sx-z-index-week-header': 10,
          } as React.CSSProperties
        }
      >

        <ScheduleXCalendar
          calendarApp={calendar}
        />

      </div>


      {/* --------------------------------------------------------------- */}
      {/* MODAL                                                           */}
      {/* --------------------------------------------------------------- */}

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >

        <DialogContent
          className="
            z-[999999]
            max-h-[80vh]
            overflow-y-auto
          "
        >

          <DialogHeader>

            <DialogTitle
              className="
                text-[#1158ca]
                font-bold
                text-xl
              "
            >

              {selectedEvent?.title}

            </DialogTitle>


            <DialogDescription>

              {formattedDate && (

                <>

                  <span
                    className="
                      capitalize
                      text-sm
                      mr-6
                      text-muted-foreground
                    "
                  >

                    {formattedDate.weekday}

                    {' • '}

                    {formattedDate.date}

                  </span>


                  <span
                    className="
                      text-sm
                      font-medium
                      text-primary
                    "
                  >

                    {formattedDate.time}

                  </span>

                </>

              )}

            </DialogDescription>

          </DialogHeader>


          {/* ----------------------------------------------------------- */}
          {/* ADMIN                                                       */}
          {/* ----------------------------------------------------------- */}

          {adminRequest ? (

            selectedEvent?.description ? (

              <ReactMarkdown>

                {selectedEvent.description}

              </ReactMarkdown>

            ) : (

              <UploadSection
                selectedEvent={selectedEvent}
                 onSummaryGenerated={handleSummaryGenerated}
              />

            )

          ) : (

            /* --------------------------------------------------------- */
            /* ALUNO                                                     */
            /* --------------------------------------------------------- */

            <ReactMarkdown>

              {
                selectedEvent?.description
                  ? selectedEvent.description
                  : 'Resumo ainda não disponível para esta aula.'
              }

            </ReactMarkdown>

          )}

        </DialogContent>

      </Dialog>

    </>

  )

}