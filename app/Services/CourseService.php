<?php

namespace App\Services;

use App\Models\Course;

class CourseService
{
    public function getAll()
    {
        return Course::with([
            'periods.schedules.subject',
            'periods.schedules.timeSlot'
        ])->get();
    }
}