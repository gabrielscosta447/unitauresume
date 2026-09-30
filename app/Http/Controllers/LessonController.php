<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\BoardImage;
use App\Models\Summary;
use App\Models\Schedule;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class LessonController extends Controller
{
    public function gerarResumo(
        $scheduleId,
        Request $request
    ) {
        Log::info(
            'Gerando resumo para schedule_id: ' . $scheduleId,
            $request->all()
        );

        $request->validate([
            'lesson_date' => ['required', 'date'],

            'images' => [
                'required',
                'array',
                'max:10',
            ],

            'images.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png',
                'max:5120',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Schedule
        |--------------------------------------------------------------------------
        */

        $schedule = Schedule::findOrFail($scheduleId);

        /*
        |--------------------------------------------------------------------------
        | Lesson
        |--------------------------------------------------------------------------
        */

        $lesson = Lesson::create([
            'lesson_date' => $request->lesson_date,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Encontra schedules equivalentes
        |--------------------------------------------------------------------------
        */

        $scheduleIds = Schedule::where(
                'subject_id',
                $schedule->subject_id
            )
            ->where(
                'weekday',
                $schedule->weekday
            )
            ->where(
                'time_slot_id',
                $schedule->time_slot_id
            )
            ->pluck('id');

        /*
        |--------------------------------------------------------------------------
        | Vincula schedules
        |--------------------------------------------------------------------------
        */

        $lesson->schedules()->syncWithoutDetaching($scheduleIds);

        /*
        |--------------------------------------------------------------------------
        | Salva imagens
        |--------------------------------------------------------------------------
        */

        $images = [];

        foreach ($request->file('images') as $image) {

            $path = $image->store(
                'board-images',
                'public'
            );

            BoardImage::create([
                'lesson_id' => $lesson->id,
                'image_path' => $path,
            ]);

            /*
             * Mantemos o UploadedFile para enviar
             * a imagem para a NVIDIA.
             */
            $images[] = $image;
        }

        /*
        |--------------------------------------------------------------------------
        | Gera resumo com NVIDIA Nemotron
        |--------------------------------------------------------------------------
        */

        $summaryContent = $this->gerarResumoComNvidia($images);

        /*
        |--------------------------------------------------------------------------
        | Salva resumo
        |--------------------------------------------------------------------------
        */

        Summary::updateOrCreate(
            [
                'lesson_id' => $lesson->id,
            ],
            [
                'content' => $summaryContent,
            ]
        );

       
       return Inertia::flash([
             'success' => 'Resumo gerado com IA com sucesso',
    'summary' => $summaryContent,
    'lesson_id' => $lesson->id,
        ])->back();
    }

    /**
     * Gera o resumo das imagens usando NVIDIA Nemotron.
     */
  /**
 * Gera o resumo das imagens usando NVIDIA.
 */
private function gerarResumoComNvidia(array $images): string
{
    /*
    |--------------------------------------------------------------------------
    | Prompt
    |--------------------------------------------------------------------------
    */

    $prompt = <<<'PROMPT'
Você é um assistente especializado em transformar anotações de aulas
escritas em lousas em resumos didáticos.

Analise cuidadosamente TODAS as imagens fornecidas.

Objetivo:
Criar um resumo completo, organizado e fiel ao conteúdo apresentado
nas fotos da lousa.

Regras obrigatórias:

1. Identifique os principais assuntos da aula.

2. Transcreva fórmulas, definições, conceitos, exemplos e observações
quando estiverem visíveis.

3. Preserve os termos técnicos utilizados pelo professor.

4. Organize o conteúdo usando:
   - títulos;
   - subtítulos;
   - listas;
   - fórmulas;
   - exemplos quando existirem.

5. Explique os conceitos de maneira clara e didática, mas sem adicionar
informações que não possam ser justificadas pelo conteúdo das imagens.

6. NÃO invente informações.

7. NÃO complete fórmulas ou palavras que estejam ilegíveis.

8. Se uma parte da imagem estiver ilegível, indique:
   "[trecho ilegível na imagem]"

9. Compare as diferentes imagens para reconstruir a sequência lógica
da aula.

10. Evite repetir informações que aparecem em várias fotos.

11. Responda exclusivamente em português brasileiro.

12. Retorne somente o resumo da aula.

Não descreva o processo de análise.
Não mostre raciocínio interno.
Não escreva introduções como "Aqui está o resumo".
Entregue diretamente o resumo final.
PROMPT;

    /*
    |--------------------------------------------------------------------------
    | Conteúdo multimodal
    |--------------------------------------------------------------------------
    */

    $content = [
        [
            'type' => 'text',
            'text' => $prompt,
        ],
    ];

    /*
    |--------------------------------------------------------------------------
    | Adiciona as imagens
    |--------------------------------------------------------------------------
    */

    foreach ($images as $image) {

        $realPath = $image->getRealPath();

        if (!$realPath || !file_exists($realPath)) {

            Log::error(
                'Arquivo de imagem não encontrado',
                [
                    'name' => $image->getClientOriginalName(),
                ]
            );

            throw new \Exception(
                'Uma das imagens não pôde ser lida.'
            );
        }

        $base64 = base64_encode(
            file_get_contents($realPath)
        );

        $mimeType = $image->getMimeType();

        $content[] = [
            'type' => 'image_url',
            'image_url' => [
                'url' => "data:{$mimeType};base64,{$base64}",
            ],
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Modelo NVIDIA
    |--------------------------------------------------------------------------
    */

    $model = 'meta/muse-glimmer-30b';

    /*
    |--------------------------------------------------------------------------
    | Requisição NVIDIA
    |--------------------------------------------------------------------------
    */

    $response = Http::timeout(180)
        ->connectTimeout(30)
        ->withToken(
            config('services.nvidia.key')
        )
        ->acceptJson()
        ->post(
            'https://integrate.api.nvidia.com/v1/chat/completions',
            [
                'model' => $model,

                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $content,
                    ],
                ],

                'max_tokens' => 20000,

                'temperature' => 0.2,

                'top_p' => 0.95,

                'stream' => false,
            ]
        );

    /*
    |--------------------------------------------------------------------------
    | Trata erro da NVIDIA
    |--------------------------------------------------------------------------
    */

    if ($response->failed()) {

        Log::error(
            'Erro ao gerar resumo com NVIDIA',
            [
                'model' => $model,
                'status' => $response->status(),
                'response' => $response->json(),
                'body' => $response->body(),
            ]
        );

        throw new \Exception(
            'Não foi possível gerar o resumo com a NVIDIA.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Extrai resposta
    |--------------------------------------------------------------------------
    */

    $summary = $response->json(
        'choices.0.message.content'
    );

    if (!is_string($summary) || trim($summary) === '') {

        Log::error(
            'NVIDIA retornou resposta vazia',
            [
                'model' => $model,
                'response' => $response->json(),
            ]
        );

        throw new \Exception(
            'A NVIDIA não retornou um resumo.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Retorna somente o conteúdo final
    |--------------------------------------------------------------------------
    */

    return trim($summary);
}
}