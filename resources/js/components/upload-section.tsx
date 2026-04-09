import { useState } from "react"
import { router } from "@inertiajs/react"

import { Button } from "@/components/ui/button"

import { UploadCloud, X } from "lucide-react"

import type { CalendarEvent } from "@/types/calendar"

export default function UploadSection({
  selectedEvent,
}: {
  selectedEvent: CalendarEvent | null
}) {

  const [files, setFiles] = useState<File[]>([])

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {

    const newFiles = Array.from(e.target.files || [])

    // limite de 10 imagens
    if (files.length + newFiles.length > 10) {
      alert("Máximo de 10 imagens permitido")
      return
    }

    setFiles(prev => [...prev, ...newFiles])
  }

  function removeFile(index: number) {
    setFiles(prev =>
      prev.filter((_, i) => i !== index)
    )
  }

  function sendFiles() {

  if (!selectedEvent) return

  const formData = new FormData()

  // 🔵 adicionar imagens
  files.forEach(file => {
    formData.append("images[]", file)
  })

  // 🔵 adicionar data da aula

  const lessonDate =
    selectedEvent.start
      .toPlainDate()
      .toString()

  formData.append(
    "lesson_date",
    lessonDate
  )

  router.post(
    `/lesson/${selectedEvent.id}/gerar-resumo`,
    formData
  )
}

  return (
    <div className="mt-4 flex flex-col gap-4">

      {/* ÁREA UPLOAD */}
      <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 cursor-pointer hover:border-primary transition">

        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />

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
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

      </label>

      {/* PREVIEW */}
      {files.length > 0 && (

        <div className="grid grid-cols-3 gap-2">

          {files.map((file, index) => (

            <div
              key={index}
              className="relative border rounded-lg overflow-hidden"
            >

              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-24 object-cover"
              />

              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4 text-white" />
              </button>

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
        disabled={files.length === 0}
        onClick={sendFiles}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Gerar resumo da aula
      </Button>

    </div>
  )
}