<?php

namespace App\Services;

use App\Models\Course;

class CourseService
{
    public function getAll()
    {
        return Course::select([
            'id',
            'name',
        ])->get();
    }
}