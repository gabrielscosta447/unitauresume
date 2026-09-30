<?php

use App\Http\Controllers\AdminRequestController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LessonController;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Course;


// tela de solicitação
Route::get('/admin-request', [AdminRequestController::class, 'create'])
    ->name('admin.request.form');

Route::post('/admin-request', [AdminRequestController::class, 'store'])
    ->name('admin.request.store');


Route::get('/admin', [AdminController::class, 'index'])
    ->name('admin');
Route::get('/teste-openrouter', function () {

 
   $response = Http::timeout(180)
    ->connectTimeout(30)
    ->withToken(config('services.nvidia.key'))
    ->acceptJson()
    ->post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        [
            'model' => 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',

            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => 'O que aparece nesta imagem?',
                        ],
                        [
                            'type' => 'image_url',
                            'image_url' => [
                                'url' => 'https://assets.ngc.nvidia.com/products/api-catalog/phi-3-5-vision/example1b.jpg',
                            ],
                        ],
                    ],
                ],
            ],

            'max_tokens' => 1024,
            'temperature' => 1.0,
            'stream' => false,

            'chat_template_kwargs' => [
                'enable_thinking' => false,
            ],
        ]
    );

dd([
    'status' => $response->status(),
    'body' => $response->json(),
]);
});
Route::get('/teste-nvidia-texto', function () {

    $response = Http::timeout(180)
        ->connectTimeout(30)
        ->withToken(config('services.nvidia.key'))
        ->acceptJson()
        ->post(
            'https://integrate.api.nvidia.com/v1/chat/completions',
            [
                'model' => 'meta/muse-glimmer-30b',

                'messages' => [
                    [
                        'role' => 'user',
                        'content' => 'Responda apenas: OK',
                    ],
                ],

                'temperature' => 1,
                'top_p' => 0.95,
                'max_tokens' => 8192,

                'stream' => false,
            ]
        );

    return response()->json([
        'status' => $response->status(),
        'body' => $response->json(),
    ]);
});

Route::get('/teste-openrouter-models', function () {

    $response = Http::withToken(
        config('services.openrouter.key')
    )->get('https://openrouter.ai/api/v1/models');

    if ($response->failed()) {
        return response()->json([
            'status' => $response->status(),
            'error' => $response->json(),
        ], $response->status());
    }

    $models = collect($response->json('data'))
        ->filter(function ($model) {
            return str_ends_with($model['id'], ':free');
        })
        ->map(function ($model) {
            return [
                'id' => $model['id'],
                'name' => $model['name'] ?? null,
                'architecture' => $model['architecture'] ?? null,
                'supported_parameters' => $model['supported_parameters'] ?? [],
            ];
        })
        ->values();

    return response()->json([
        'count' => $models->count(),
        'models' => $models,
    ]);
});
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
