import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-shadcn/dist/index.css'
import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useState } from 'react'

// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// 🔹 IMPORTS NOVOS (separação profissional)
import { generateEvents } from '@/utils/generateEvents'
import { CalendarEvent, Period } from '@/types/calendar'
import UploadSection from './upload-section'

type Props = {
  selectedPeriod: Period | undefined
    adminRequest: boolean
      lessons: any[]
}

export default function CalendarAulas({ selectedPeriod, adminRequest, lessons }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const eventsService = useState(() => createEventsServicePlugin())[0]

  const today = Temporal.Now.plainDateISO()

  const minDate = Temporal.PlainDate.from({
    year: 2026,
    month: 1,
    day: 1,
  })

  const maxDate = today

  // 🔹 EVENTOS (agora limpo ✨)
const events = useMemo(() => {

  return generateEvents(
    selectedPeriod,
    today,
    lessons
  )

}, [selectedPeriod, today, lessons])

  // 🔹 CALENDÁRIO
  const calendar = useCalendarApp({
    locale: 'pt-BR',
    theme: 'shadcn',
    isDark: true,
    timezone: 'America/Sao_Paulo',
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    dayBoundaries: { start: '19:00', end: '23:00' },
    weekOptions: { gridStep: 30, nDays: 5, gridHeight: 800 },
    plugins: [eventsService],
    minDate,
    maxDate,
    callbacks: {
      onEventClick(calendarEvent: any) {
        const formatted: CalendarEvent = {
          ...calendarEvent,
          id: String(calendarEvent.id),
          description: calendarEvent.description || '',
        }

        setSelectedEvent(formatted)
        setDialogOpen(true)
      },
    },
  })

  // 🔹 Atualiza eventos no calendário
  useEffect(() => {
    eventsService.set(events)
  }, [events])

  if (!selectedPeriod) return null
function formatEventDate(event: CalendarEvent | null) {

  if (!event) return ""

  const start = event.start
  const end = event.end

  const weekday = start.toLocaleString("pt-BR", {
    weekday: "long",
  })

  const date = start.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const startTime = start.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const endTime = end.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return {
    weekday,
    date,
    time: `${startTime} — ${endTime}`,
  }
}
const formattedDate = formatEventDate(selectedEvent)
  return (
    <>
      {/* CALENDÁRIO */}
      <div style={{ '--sx-z-index-week-header': 10 } as React.CSSProperties}>
        <ScheduleXCalendar calendarApp={calendar} />
      </div>

      {/* MODAL */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="z-[999999] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1158ca] font-bold text-xl">
              {selectedEvent?.title}
            </DialogTitle>

            <DialogDescription>
               {formattedDate && (

    <>
      <span className="capitalize text-sm mr-6 text-muted-foreground">
        {formattedDate.weekday} • {formattedDate.date}
      </span>

      <span className="text-sm font-medium text-primary">
        {formattedDate.time}
      </span>
    </>

  )}
            </DialogDescription>
          </DialogHeader>

         
{adminRequest ? (

  selectedEvent?.description ? (

    // 🟢 ADMIN JÁ TEM RESUMO

<>
     

         <ReactMarkdown>
        {selectedEvent.description}
 </ReactMarkdown>

     </> 



  ) : (

    // 🔵 ADMIN AINDA NÃO ENVIOU
    <UploadSection
      selectedEvent={selectedEvent}
    />

  )

) : (

  // 🎓 ALUNO
  <>
      <ReactMarkdown>

      {selectedEvent?.description
        ? selectedEvent.description
        : "Resumo ainda não disponível para esta aula."}

</ReactMarkdown>
   

  </>

)}
          
        </DialogContent>
      </Dialog>
    </>
  )
}