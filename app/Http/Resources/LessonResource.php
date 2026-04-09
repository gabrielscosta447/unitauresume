<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class LessonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,
            
            'schedule_id' => $this->schedule_id,
        'schedules' => $this->schedules, // Relacionamento muitos-para-muitos
            'lesson_date' => $this->lesson_date,

            // 🔵 resumo
            'summary' => $this->summary
                ? [
                    'id' => $this->summary->id,
                    'content' => $this->summary->content,
                ]
                : null,

            // 🖼️ imagens do quadro
            'board_images' => $this->boardImages
                ->map(function ($image) {

                    return [

                        'id' => $image->id,

                        'url' => Storage::url(
                            $image->image_path
                        ),

                    ];

                }),

        ];
    }
}