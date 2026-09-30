import { router, usePage } from '@inertiajs/react'
import { useState } from 'react'

import CalendarAulas from '@/components/calendar-aulas'
import { BookOpen, Calendar } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { Course, Period, Lesson } from '@/types/calendar'

type Props = {
  courses: Course[]
  selectedCourseId: number | null
  selectedPeriod: Period | null
  lessons: Lesson[]
  filters: {
    start_date: string
    end_date: string
  }
}

export default function Welcome() {

  const {
    courses,
    selectedCourseId,
    selectedPeriod,
    lessons,
    filters,
  } = usePage<Props>().props

  const [courseId, setCourseId] = useState<number | ''>(
    selectedCourseId ?? ''
  )

  const [periodId, setPeriodId] = useState<number | ''>(
    selectedPeriod?.id ?? ''
  )

  const selectedCourse = courses.find(
    course => course.id === courseId
  )

  /*
  |--------------------------------------------------------------------------
  | Selecionar curso
  |--------------------------------------------------------------------------
  */

  function handleCourseChange(value: string) {

    const id = Number(value)

    setCourseId(id)
    setPeriodId('')

    router.get(
      '/',
      {
        course: id,
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Selecionar período
  |--------------------------------------------------------------------------
  */

 function handlePeriodChange(value: string) {

  const id = Number(value)

  setPeriodId(id)


  /*
  |--------------------------------------------------------------------------
  | Verifica se já existe um intervalo de datas
  |--------------------------------------------------------------------------
  */

  const hasDateFilter =
    filters.start_date &&
    filters.end_date


  /*
  |--------------------------------------------------------------------------
  | Se já existe filtro:
  |
  | Mantém exatamente o mesmo intervalo.
  |--------------------------------------------------------------------------
  */

  if (hasDateFilter) {

    router.get(
      '/',
      {
        course: courseId,

        period: id,

        start_date:
          filters.start_date,

        end_date:
          filters.end_date,
      },
      {
        preserveState: true,

        preserveScroll: true,

        replace: true,
      }
    )

    return
  }


  /*
  |--------------------------------------------------------------------------
  | Não existe filtro.
  |
  | Então usamos a semana atual.
  |--------------------------------------------------------------------------
  */

  const today = new Date()


  /*
  | JavaScript:
  |
  | 0 = Domingo
  | 1 = Segunda
  | ...
  | 6 = Sábado
  */

  const dayOfWeek =
    today.getDay()


  /*
  |--------------------------------------------------------------------------
  | Quantos dias precisamos voltar
  | para chegar na segunda-feira
  |--------------------------------------------------------------------------
  */

  const daysFromMonday =
    dayOfWeek === 0
      ? 6
      : dayOfWeek - 1


  /*
  |--------------------------------------------------------------------------
  | Segunda-feira
  |--------------------------------------------------------------------------
  */

  const startDate =
    new Date(today)

  startDate.setDate(
    today.getDate() -
      daysFromMonday
  )


  /*
  |--------------------------------------------------------------------------
  | Sexta-feira
  |--------------------------------------------------------------------------
  */

  const endDate =
    new Date(startDate)

  endDate.setDate(
    startDate.getDate() + 4
  )


  /*
  |--------------------------------------------------------------------------
  | Busca o período
  |--------------------------------------------------------------------------
  */

  router.get(
    '/',
    {
      course: courseId,

      period: id,

      start_date:
        formatDate(startDate),

      end_date:
        formatDate(endDate),
    },
    {
      preserveState: true,

      preserveScroll: true,

      replace: true,
    }
  )
}
  /*
  |--------------------------------------------------------------------------
  | Formatar YYYY-MM-DD
  |--------------------------------------------------------------------------
  */

  function formatDate(date: Date) {

    return [
      date.getFullYear(),

      String(date.getMonth() + 1)
        .padStart(2, '0'),

      String(date.getDate())
        .padStart(2, '0'),

    ].join('-')
  }

  return (
    <div className="p-6 space-y-6">

      <div className="text-center">

        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-white">

          <BookOpen size={28} />

          Resumos das Aulas

        </h1>

        <p className="text-white mt-1">
          Selecione seu curso e período para visualizar
          os resumos das aulas no calendário.
        </p>

      </div>

      {/* CURSO */}

      <div className="space-y-1">

        <label className="text-sm font-medium text-white">
          Curso
        </label>

        <Select
          value={String(courseId)}
          onValueChange={handleCourseChange}
        >

          <SelectTrigger className="w-full border-2 border-[#083f97]">

            <SelectValue placeholder="Selecione um curso" />

          </SelectTrigger>

          <SelectContent>

            <SelectGroup>

              <SelectLabel>
                Cursos disponíveis
              </SelectLabel>

              {courses.map(course => (

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
            onValueChange={handlePeriodChange}
          >

            <SelectTrigger className="w-full border-2 border-[#083f97]">

              <SelectValue placeholder="Selecione o período" />

            </SelectTrigger>

            <SelectContent>

              <SelectGroup>

                <SelectLabel>
                  Períodos do curso
                </SelectLabel>

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

      {selectedPeriod && (

        <>

          <div className="text-center">

            <h2 className="flex items-center gap-2 justify-center text-lg font-semibold text-white mb-2">

              <Calendar size={20} />

              Aulas disponíveis

            </h2>

            <p className="text-sm text-white mb-4">
              Clique em uma aula no calendário para visualizar o resumo.
            </p>

          </div>

          <CalendarAulas
            selectedPeriod={selectedPeriod}
            lessons={lessons}
            adminRequest={false}
            filters={filters}
          />

        </>

      )}

    </div>
  )
}