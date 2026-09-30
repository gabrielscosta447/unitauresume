import { useState } from "react"
import { router } from "@inertiajs/react"

import { Button } from "@/components/ui/button"

import { UploadCloud, X } from "lucide-react"

import type { CalendarEvent } from "@/types/calendar"
export default function UploadSection({
  selectedEvent,
  onSummaryGenerated,
}: {
  selectedEvent: CalendarEvent | null
  onSummaryGenerated: (summary: string) => void
}) {

  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)

  function handleFiles(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const newFiles = Array.from(
      e.target.files || []
    )

    if (files.length + newFiles.length > 10) {
      alert("Máximo de 10 imagens permitido")
      return
    }

    setFiles(prev => [
      ...prev,
      ...newFiles,
    ])

    // permite selecionar novamente os mesmos arquivos
    e.target.value = ""
  }

  function removeFile(index: number) {

    setFiles(prev =>
      prev.filter((_, i) => i !== index)
    )
  }

  function sendFiles() {
  if (!selectedEvent || files.length === 0) {
    return
  }

  setProcessing(true)

  const formData = new FormData()

  files.forEach(file => {
    formData.append("images[]", file)
  })

  const lessonDate =
    selectedEvent.start
      .toPlainDate()
      .toString()

  formData.append(
    "lesson_date",
    lessonDate
  )

  router.post(
  `/lesson/${selectedEvent.schedule_id}/gerar-resumo`,
  formData,
  {
    forceFormData: true,

    preserveState: true,
    preserveScroll: true,

    onSuccess: () => {
      

      setFiles([])
      setProcessing(false)
    },
  onFlash: (flash: {
      summary?: string
      lesson_id?: number
      success?: string
    }) => {
      if (typeof flash.summary === "string") {
        onSummaryGenerated(flash.summary)
      }
    },
    onError: () => {
      setProcessing(false)
    },

    onCancel: () => {
      setProcessing(false)
    },
  }
)
}

  return (
    <div className="mt-4 flex flex-col gap-4">

      {/* ÁREA UPLOAD */}

      <label
        className="
          relative
          flex
          flex-col
          items-center
          justify-center
          border-2
          border-dashed
          border-muted-foreground/30
          rounded-xl
          p-6
          cursor-pointer
          hover:border-primary
          transition
        "
      >

        <UploadCloud
          className="w-8 h-8 mb-2 text-muted-foreground"
        />

        <span className="text-sm font-medium">
          Clique ou arraste fotos da lousa
        </span>

        <span className="text-xs text-muted-foreground mt-1">
          PNG, JPG até 10 imagens
        </span>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          disabled={processing}
          className="
            absolute
            inset-0
            opacity-0
            cursor-pointer
          "
        />

      </label>

      {/* PREVIEW */}

      {files.length > 0 && (

        <div className="grid grid-cols-3 gap-2">

          {files.map((file, index) => (

            <div
              key={`${file.name}-${index}`}
              className="
                relative
                border
                rounded-lg
                overflow-hidden
              "
            >

              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="
                  w-full
                  h-24
                  object-cover
                "
              />

              {!processing && (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="
                    absolute
                    top-1
                    right-1
                    bg-black/60
                    rounded-full
                    p-1
                    hover:bg-red-600
                  "
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}

            </div>

          ))}

        </div>

      )}

      {/* CONTADOR */}

      {files.length > 0 && (

        <p className="text-xs text-muted-foreground">

          {files.length} imagem(ns) selecionada(s)

        </p>

      )}

      {/* BOTÃO */}

      <Button
        disabled={
          files.length === 0 ||
          processing
        }
        onClick={sendFiles}
        className="
          w-full
          bg-green-600
          hover:bg-green-700
        "
      >

        {processing
          ? "Gerando resumo..."
          : "Gerar resumo da aula"
        }

      </Button>

    </div>
  )
}