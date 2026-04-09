<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\BoardImage;
use App\Models\Summary;
use Illuminate\Support\Facades\Storage;
use App\Ai\Agents\LessonSummarizer;

use Illuminate\Support\Facades\Log;
use App\Models\Schedule;
use Laravel\Ai\Facades\Ai;
use Laravel\Ai\Files\Image as AiImage;
class LessonController extends Controller
{


public function gerarResumo(
    $scheduleId,
    Request $request
) {
Log::info('Gerando resumo para schedule_id: ' . $scheduleId, $request->all());
    $request->validate([
        'lesson_date' => ['required','date'],

        'images' => [
            'required',
            'array',
            'max:10'
        ],

        'images.*' => [
            'image',
            'mimes:jpg,jpeg,png',
            'max:5120'
        ],
    ]);

    // 🔵 cria lesson
$schedule = Schedule::findOrFail($scheduleId);

// cria ou encontra lesson pela data
$lesson = Lesson::create([
    'lesson_date' => $request->lesson_date
]);

// encontra schedules equivalentes
$scheduleIds = Schedule::where('subject_id', $schedule->subject_id)
    ->where('weekday', $schedule->weekday)
    ->where('time_slot_id', $schedule->time_slot_id)
    ->pluck('id');

// vincula todos schedules à lesson
$lesson->schedules()->syncWithoutDetaching($scheduleIds);

    $attachments = [];

    foreach ($request->file('images') as $image) {

        // salva no storage

        $path = $image->store(
            'board-images',
            'public'
        );

        BoardImage::create([
            'lesson_id' => $lesson->id,
            'image_path' => $path,
        ]);

        // ✅ PASSA O UPLOADED FILE DIRETO

        $attachments[] = $image;
    }

    // 🧠 IA

    $response = (new LessonSummarizer)->prompt(
        "Analise as imagens da lousa e gere um resumo claro e organizado para estudantes.",
        attachments: $attachments
    );

Log::info('Resposta da IA:', ['response' => $response]);
    $summaryContent = $response['summary'];

    // 💾 salvar resumo

    Summary::updateOrCreate(
        [
            'lesson_id' => $lesson->id
        ],
        [
            'content' => $summaryContent
        ]
    );

    return back()->with([
        'success' => 'Resumo gerado com IA com sucesso'
    ]);
}
  private function gerarResumoFake()
    {
        return "Resumo gerado automaticamente.";
    }
}