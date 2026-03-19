import { usePage, router } from '@inertiajs/react'
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
import { useEffect, useMemo, useState } from 'react'

// 🔹 Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 🔹 TIPOS
type Schedule = { weekday: number; time: string; subject: string }
type Period = { id: number; number: number; schedules: Schedule[] }
type Course = { id: number; name: string; periods: Period[] }
type CalendarEvent = {
  id: string
  title: string
  start: Temporal.ZonedDateTime
  end: Temporal.ZonedDateTime
  description: string
}

export default function Welcome() {
  const { courses } = usePage<{ courses: Course[] }>().props
  const [courseId, setCourseId] = useState<number | ''>('')
  const [periodId, setPeriodId] = useState<number | ''>('')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const selectedCourse = courses.find(c => c.id === courseId)
  const selectedPeriod = selectedCourse?.periods.find(p => p.id === periodId)
  const eventsService = useState(() => createEventsServicePlugin())[0]

  const today = Temporal.Now.plainDateISO()
  const minDate = Temporal.PlainDate.from({ year: 2026, month: 1, day: 1 })
  const maxDate = today

  // 🔹 EVENTOS
  const events = useMemo(() => {
    if (!selectedPeriod) return []
    const eventsList: CalendarEvent[] = []

    const startOfYear = Temporal.PlainDate.from({ year: today.year, month: 1, day: 1 })
    const endOfYear = Temporal.PlainDate.from({ year: today.year, month: 12, day: 31 })

    for (
      let date = startOfYear;
      Temporal.PlainDate.compare(date, endOfYear) <= 0;
      date = date.add({ days: 1 })
    ) {
      const weekday = date.dayOfWeek
      const grouped: Record<string, string[]> = {}
      selectedPeriod.schedules.forEach(s => {
        if (s.weekday === weekday) {
          if (!grouped[s.subject]) grouped[s.subject] = []
          grouped[s.subject].push(s.time)
        }
      })

      Object.entries(grouped).forEach(([subject, times], index) => {
        const sortedTimes = times.sort()
        const startTime = sortedTimes[0].slice(0, 5)
        const lastTime = sortedTimes[sortedTimes.length - 1].slice(0, 5)
        const endHour = lastTime === '19:00' ? '21:00' : '22:40'

        const start = Temporal.ZonedDateTime.from(
          `${date}T${startTime}:00-03:00[America/Sao_Paulo]`
        )
        const end = Temporal.ZonedDateTime.from(
          `${date}T${endHour}:00-03:00[America/Sao_Paulo]`
        )

        eventsList.push({
          id: `${selectedPeriod.id}-${date}-${index}`,
          title: subject,
          start,
          end,
          description: `Resumo da aula de ${subject} nesse dia.`,
        })
      })
    }
    return eventsList
  }, [selectedPeriod])

  // 🔹 CALENDÁRIO
  const calendar = useCalendarApp({
    locale: 'pt-BR',
    theme: 'shadcn',
    isDark: true,
    timezone: 'America/Sao_Paulo',
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    dayBoundaries: { start: '19:00', end: '23:00' },
    weekOptions: { gridStep: 30, nDays: 5, gridHeight: 800 },
    plugins: [eventsService],
    minDate,
    maxDate,
    callbacks: {
      onEventClick(calendarEvent: any, e: UIEvent) {
        const formattedEvent = { ...calendarEvent, id: String(calendarEvent.id), description: calendarEvent.description || '' }
        setSelectedEvent(formattedEvent)
        setDialogOpen(true)
      },
    },
  })

  // 🔹 ATUALIZA EVENTOS
  useEffect(() => {
    eventsService.set(events)
  }, [events])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-[#1158ca]">Grade de Horários UNITAU</h1>

      {/* CURSO */}
      <Select value={String(courseId)} onValueChange={val => { setCourseId(Number(val)); setPeriodId('') }}>
        <SelectTrigger className="w-full border-2 border-[#083f97] z-[99999]">
          <SelectValue placeholder="Selecione o curso" />
        </SelectTrigger>
        <SelectContent className="z-[99999]">
          <SelectGroup>
            <SelectLabel>Cursos</SelectLabel>
            {courses.map(course => (
              <SelectItem key={course.id} value={String(course.id)} className="hover:bg-[#0f2c5a] hover:text-white">
                {course.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* PERÍODO */}
      {selectedCourse && (
        <Select value={String(periodId)} onValueChange={val => setPeriodId(Number(val))}>
          <SelectTrigger className="w-full border-2 border-[#083f97]  z-[99999]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent className="z-[99999]">
            <SelectGroup>
              <SelectLabel>Períodos</SelectLabel>
              {selectedCourse.periods.map(period => (
                <SelectItem key={period.id} value={String(period.id)} className="hover:bg-[#0f2c5a] hover:text-white">
                  {period.number}º período
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}


      {/* CALENDÁRIO */}
      {selectedPeriod && <div style={{ '--sx-z-index-week-header': 10 } as React.CSSProperties}>
  <ScheduleXCalendar calendarApp={calendar} />
</div>}

      {/* 🔹 MODAL UNITAU */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
        <DialogContent className="z-[999999]">
          <DialogHeader>
            <DialogTitle className="text-[#1158ca]  font-bold text-xl">{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent && `${selectedEvent.start.toString()} - ${selectedEvent.end.toString()}`}
            </DialogDescription>
          </DialogHeader>

          <p className="mt-2 text-white">{selectedEvent?.description}</p>

          <Button
            className="mt-4 w-full bg-[#0f2c5a] hover:bg-[#2b3e7d] text-white font-semibold"
            onClick={() => selectedEvent && router.visit(`/aula/${selectedEvent.id}`)}
          >
            Ir para página completa
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}