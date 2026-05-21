<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\Schedule;
use App\Models\Summary;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class LessonSummarySeeder extends Seeder
{
    public function run(): void
    {
        $start = Carbon::create(2026, 5, 18);
        $end   = Carbon::create(2026, 5, 22);

        $templates = [

            'Banco de Dados' => [
                'Modelagem relacional e criação de tabelas utilizando SQL.',
                'Explicação sobre JOINs, chaves estrangeiras e normalização.',
                'Atividade prática envolvendo consultas SQL e relacionamentos.',
            ],

            'Programação' => [
                'Desenvolvimento de exercícios utilizando orientação a objetos.',
                'Explicação sobre boas práticas de desenvolvimento e SOLID.',
                'Implementação prática utilizando PHP e Laravel.',
            ],

            'Engenharia de Software' => [
                'Introdução aos diagramas UML e modelagem de sistemas.',
                'Discussão sobre metodologias ágeis e Scrum.',
                'Levantamento de requisitos e análise de sistemas.',
            ],

            'Redes' => [
                'Configuração de redes locais e protocolos TCP/IP.',
                'Explicação sobre roteamento e arquitetura de redes.',
                'Atividade prática de subnetting e comunicação entre dispositivos.',
            ],

            'Inteligência Artificial' => [
                'Introdução aos conceitos de machine learning.',
                'Explicação sobre algoritmos supervisionados e não supervisionados.',
                'Discussão sobre aplicações modernas de IA.',
            ],

            'Cálculo' => [
                'Resolução de limites e derivadas.',
                'Exercícios envolvendo integrais e funções.',
                'Aplicação prática de cálculo diferencial.',
            ],

            'Física' => [
                'Estudo sobre movimento uniforme e acelerado.',
                'Resolução de exercícios envolvendo força e energia.',
                'Atividade prática sobre leis de Newton.',
            ],

            'Estrutura de Dados' => [
                'Implementação de listas, filas e pilhas.',
                'Exercícios práticos utilizando algoritmos de ordenação.',
                'Explicação sobre complexidade de algoritmos.',
            ],
        ];

        while ($start->lte($end)) {

            $schedules = Schedule::with('subject')->get();

            foreach ($schedules as $schedule) {

                $lesson = Lesson::create([
                    'lesson_date' => $start->toDateString(),
                ]);

                // relaciona aula ao horário
                $lesson->schedules()->attach($schedule->id);

                $subjectName = $schedule->subject->name;

                $content = $this->generateSummary(
                    $subjectName,
                    $templates
                );

                Summary::create([
                    'lesson_id' => $lesson->id,
                    'content' => $content,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $start->addDay();
        }
    }

    private function generateSummary(
        string $subject,
        array $templates
    ): string {

        foreach ($templates as $keyword => $texts) {

            if (str_contains(
                mb_strtolower($subject),
                mb_strtolower($keyword)
            )) {
                return $texts[array_rand($texts)];
            }
        }

        // fallback genérico
        $fallbacks = [
            "Aula expositiva sobre {$subject} com resolução de exercícios.",
            "Discussão dos principais conceitos relacionados à disciplina {$subject}.",
            "Atividade prática aplicada aos conteúdos de {$subject}.",
            "Revisão e fixação dos temas abordados em {$subject}.",
        ];

        return $fallbacks[array_rand($fallbacks)];
    }
}
