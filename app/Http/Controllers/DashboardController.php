<?php

namespace App\Http\Controllers;

use App\Models\AdminRequest;
use App\Models\Lesson;
use App\Models\Period;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $adminRequest = AdminRequest::query()
            ->with('course')
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$adminRequest) {
            return Inertia::render('dashboard', [
                'adminRequest' => null,
                'selectedPeriod' => null,
                'lessons' => [],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Semana atual
        |--------------------------------------------------------------------------
        */

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
        | Período do AdminRequest
        |--------------------------------------------------------------------------
        */

        $selectedPeriod = Period::query()
            ->select('id', 'course_id', 'number')
            ->with([
                'schedules:id,period_id,weekday,subject_id,time_slot_id',
                'schedules.subject:id,name',
                'schedules.timeSlot:id,start_time',
            ])
            ->where('course_id', $adminRequest->course_id)
            ->findOrFail($adminRequest->period_id);

        /*
        |--------------------------------------------------------------------------
        | Aulas da semana
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
            ->whereHas('schedules', function ($query) use ($adminRequest) {
                $query->where(
                    'period_id',
                    $adminRequest->period_id
                );
            })
            ->orderBy('lesson_date')
            ->get();

        return Inertia::render('dashboard', [
            'adminRequest' => [
                'id' => $adminRequest->id,
                'course' => $adminRequest->course,
                'status' => $adminRequest->status,
            ],

            // mesma estrutura usada pelo CalendarAulas
            'selectedPeriod' => $selectedPeriod,

            'lessons' => $lessons,

            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}