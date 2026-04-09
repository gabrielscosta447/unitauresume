<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdminRequest;
use App\Models\Course;
use App\Models\Period;
use Illuminate\Support\Facades\Log;

class AdminRequestController extends Controller
{
 public function create()
{
    $adminRequest = AdminRequest::where('user_id', auth()->id())
        ->where('status', 'pending')
        ->first();

    return inertia('admin-request/create', [
        'courses' => Course::with('periods')->get(),
        'hasPending' => !!$adminRequest,
        'adminRequest' => $adminRequest,
    ]);
}

public function store(Request $request)
{
    $request->validate([
        'course_id' => 'required|exists:courses,id',
        'period_id' => 'required|exists:periods,id',
    ]);

    $existing = AdminRequest::where('user_id', auth()->id())
        ->where('status', 'pending')
        ->first();

    if ($existing) {
       $existing->update([
            'course_id' => $request->course_id,
            'period_id' => $request->period_id,
        ]);

        return redirect()->route('admin.request.form');
    }

    AdminRequest::create([
        'user_id' => auth()->id(),
        'course_id' => $request->course_id,
        'period_id' => $request->period_id,
        'status' => 'pending',
    ]);

    return redirect()->route('admin.request.form');
}
}