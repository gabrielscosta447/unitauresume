import { usePage } from '@inertiajs/react'
import { useState } from 'react'

import CalendarAulas from '@/components/calendar-aulas'
import { BookOpen, Calendar } from "lucide-react"
// UI
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// TIPOS
type Lesson = {
  id: number
  lesson_date: string

  summary?: {
    content: string
  }

  board_images?: {
    id: number
    url: string
  }[]
}
type Schedule = { weekday: number; time: string; subject: string, lessons: Lesson[] }
type Period = { id: number; number: number; schedules: Schedule[] }
type Course = { id: number; name: string; periods: Period[] }

export default function Welcome() {
  const { courses } = usePage<{ courses: { data: Course[] } }>().props
  const courseList = courses.data

  const [courseId, setCourseId] = useState<number | ''>('')
  const [periodId, setPeriodId] = useState<number | ''>('')

  const selectedCourse = courseList.find(c => c.id === courseId)
  const selectedPeriod = selectedCourse?.periods.find(p => p.id === periodId)
const lessons =
  selectedPeriod?.schedules.flatMap(
    schedule => schedule.lessons ?? []
  ) ?? []
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
  <BookOpen size={28} />
  Resumos das Aulas
</h1>
        <p className="text-white mt-1">
          Selecione seu curso e período para visualizar os resumos das aulas no calendário.
        </p>
      </div>

      {/* CURSO */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-white">
          Curso
        </label>

        <Select
          value={String(courseId)}
          onValueChange={val => {
            setCourseId(Number(val))
            setPeriodId('')
          }}
        >
          <SelectTrigger className="w-full border-2 border-[#083f97]">
            <SelectValue placeholder="Selecione um curso" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cursos disponíveis</SelectLabel>
              {courseList.map(course => (
                <SelectItem
                  key={course.id}
                  value={String(course.id)}
                  className="hover:bg-[#0f2c5a] hover:text-white"
                >
                  {course.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* PERÍODO */}
      {selectedCourse && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-white">
            Período
          </label>

          <Select
            value={String(periodId)}
            onValueChange={val => setPeriodId(Number(val))}
          >
            <SelectTrigger className="w-full border-2 border-[#083f97]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Períodos do curso</SelectLabel>
                {selectedCourse.periods.map(period => (
                  <SelectItem
                    key={period.id}
                    value={String(period.id)}
                    className="hover:bg-[#0f2c5a] hover:text-white"
                  >
                    {period.number}º período
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* CALENDÁRIO */}
      {/* CALENDÁRIO */}
{selectedPeriod && (
  <>
    <div className="text-center">
      <h2 className="flex items-center gap-2 justify-center text-lg font-semibold text-white mb-2">
        <Calendar size={20} className="inline mb-1" />
        Aulas disponíveis
      </h2>

      <p className="text-sm text-white mb-4">
        Clique em uma aula no calendário para visualizar o resumo.
      </p>
    </div>

    <CalendarAulas selectedPeriod={selectedPeriod} adminRequest={false} lessons={lessons} />
  </>
)}
    </div>
  )
}