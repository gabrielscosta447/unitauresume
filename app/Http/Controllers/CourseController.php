<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Period;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $courseId = $request->integer('course');
        $periodId = $request->integer('period');

        $startDate = $request->input(
        'start_date',
        now()->startOfWeek()->toDateString()
    );

    $endDate = $request->input(
        'end_date',
        now()->startOfWeek()->addDays(4)->toDateString()
    );

        /*
        |--------------------------------------------------------------------------
        | Cursos e períodos
        |--------------------------------------------------------------------------
        */

        $courses = Course::query()
            ->select('id', 'name')
            ->with([
                'periods:id,course_id,number',
            ])
            ->get();

        $selectedPeriod = null;
        $lessons = collect();

        /*
        |--------------------------------------------------------------------------
        | Período selecionado
        |--------------------------------------------------------------------------
        */

        if ($periodId) {

         $selectedPeriod = Period::query()
    ->select('id', 'course_id', 'number')
    ->with([
        'schedules:id,period_id,weekday,subject_id,time_slot_id',

        'schedules.subject:id,name',

        'schedules.timeSlot:id,start_time',
    ])
    ->where('course_id', $courseId)
    ->findOrFail($periodId);

            /*
            |--------------------------------------------------------------------------
            | Aulas somente dentro do intervalo solicitado
            |--------------------------------------------------------------------------
            */

            $lessons = Lesson::query()
                ->with([
                    'summary',
                    'schedules:id',
                ])
                ->whereBetween('lesson_date', [
                    $startDate,
                    $endDate,
                ])
                ->whereHas('schedules', function ($query) use ($periodId) {
                    $query->where('period_id', $periodId);
                })
                ->orderBy('lesson_date')
                ->get();
        }

        return Inertia::render('welcome', [
            'courses' => $courses,

            'selectedCourseId' => $courseId,

            'selectedPeriod' => $selectedPeriod,

            'lessons' => $lessons,

            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}