<?php

use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use Inertia\Inertia;
use App\Models\Course;
Route::get('/', function () {

    $courses = Course::with([
        'periods.schedules.subject',
        'periods.schedules.timeSlot'
    ])->get()->map(function ($course) {
        return [
            'id' => $course->id,
            'name' => $course->name,
            'periods' => $course->periods->map(function ($period) {
                return [
                    'id' => $period->id,
                    'number' => $period->number,
                    'schedules' => $period->schedules->map(function ($schedule) {
                        return [
                            'weekday' => $schedule->weekday,
                            'time' => $schedule->timeSlot->start_time,
                            'subject' => $schedule->subject->name,
                        ];
                    })
                ];
            })
        ];
    });

    return Inertia::render('welcome', [
        'courses' => $courses
    ]);

})->name('home');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
