<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'weekday' => $this->weekday,
            'time' => $this->timeSlot->start_time,
            'subject' => $this->subject->name,
            'subject_id' => $this->subject->id,
            'time_slot_id' => $this->timeSlot->id,

            'lessons' => LessonResource::collection($this->lessons),
        ];
    }
}