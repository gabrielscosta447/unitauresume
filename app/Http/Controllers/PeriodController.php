<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class PeriodController extends Controller
{
    public function index(Course $course)
    {
        return $course->periods()
            ->select([
                'id',
                'course_id',
                'name',
            ])
            ->get();
    }
}