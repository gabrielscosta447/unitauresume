<?php

use App\Http\Controllers\AdminRequestController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LessonController;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use Inertia\Inertia;
use App\Models\Course;


// tela de solicitação
Route::get('/admin-request', [AdminRequestController::class, 'create'])
    ->name('admin.request.form');

Route::post('/admin-request', [AdminRequestController::class, 'store'])
    ->name('admin.request.store');




Route::get('/', [CourseController::class, 'index'])->name('home');
Route::middleware(['auth', 'approved.admin'])
    ->prefix('courses/{course}/periods/{period}')
    ->group(function () {

      

    });

    Route::post(
    '/lesson/{lesson}/gerar-resumo',
    [LessonController::class, 'gerarResumo']
)->name('lesson.gerarResumo');

Route::middleware([
    'auth','approved.admin',
    ValidateSessionWithWorkOS::class,
])->group(function () {
      Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
