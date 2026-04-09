import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Create() {

  type Period = {
    id: number
    number: number
  }

  type Course = {
    id: number
    name: string
    periods: Period[]
  }

  type AdminRequest = {
    course_id: number
    period_id: number
  }

  const {
    courses,
    hasPending,
    adminRequest
  } = usePage<{
    courses: Course[]
    hasPending: boolean
    adminRequest?: AdminRequest
  }>().props

  // valores iniciais se existir pending
  const [courseId, setCourseId] = useState(
    adminRequest?.course_id
      ? String(adminRequest.course_id)
      : ''
  )

  const [periodId, setPeriodId] = useState(
    adminRequest?.period_id
      ? String(adminRequest.period_id)
      : ''
  )

  const [editing, setEditing] = useState(false)

  const selectedCourse = courses.find(
    (c) => c.id == Number(courseId)
  )

 const submit = () => {
  router.post('/admin-request', {
    course_id: courseId,
    period_id: periodId,
  }, {
    onSuccess: () => {
      setEditing(false) // 🔴 volta para aguardar aprovação
    }
  })
}

  const enableEdit = () => {
    setEditing(true)
  }

  const showForm = !hasPending || editing

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">

<Card className="w-full max-w-2xl min-h-[520px] shadow-xl border border-slate-800">


        <CardHeader>
          <CardTitle className="text-center text-xl">

            {showForm
              ? 'Solicitar acesso de representante'
              : 'Solicitação enviada com sucesso ✅'}

          </CardTitle>
        </CardHeader>

   <CardContent className="flex flex-col justify-center items-center h-full p-8">

  <div className="w-full max-w-md space-y-6">

    {/* TELA DE SUCESSO */}

    {!showForm && (
      <div className="text-center space-y-4">

        <p className="text-sm text-slate-400">
          Sua solicitação está aguardando aprovação.
        </p>

        <Button
          variant="outline"
          className="w-full"
          onClick={enableEdit}
        >
          Errou na solicitação? Editar curso e período
        </Button>

      </div>
    )}

    {/* FORMULÁRIO */}

    {showForm && (
      <>

        {/* CURSO */}

        <div className="space-y-2 text-left">
          <label className="text-sm">Curso</label>

          <Select
            value={courseId}
            onValueChange={setCourseId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o curso" />
            </SelectTrigger>

            <SelectContent>
              {courses.map((course) => (
                <SelectItem
                  key={course.id}
                  value={String(course.id)}
                >
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
        </div>

        {/* PERÍODO */}

        {selectedCourse && (

          <div className="space-y-2 text-left">
            <label className="text-sm">Período</label>

            <Select
              value={periodId}
              onValueChange={setPeriodId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>

              <SelectContent>
                {selectedCourse.periods.map((period) => (

                  <SelectItem
                    key={period.id}
                    value={String(period.id)}
                  >
                    {period.number}º período
                  </SelectItem>

                ))}
              </SelectContent>

            </Select>
          </div>

        )}

        <Button
          onClick={submit}
          className="w-full"
          disabled={!courseId || !periodId}
        >
          {editing
            ? 'Atualizar solicitação'
            : 'Enviar solicitação'}
        </Button>

      </>
    )}

  </div>

</CardContent>

      </Card>

    </div>
  )
}