<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\CourseService;
use App\Http\Resources\CourseResource;

class CourseController extends Controller
{
    public function __construct(
        private CourseService $courseService
    ) {}

    public function index()
    {
        $courses = $this->courseService->getAll();

        return Inertia::render('welcome', [
            'courses' => CourseResource::collection($courses)
        ]);
    }
}