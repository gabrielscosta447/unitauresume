<?php



namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AdminRequest;
use App\Http\Resources\PeriodResource;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $adminRequest = AdminRequest::with([
            'course',
            'period.schedules'
        ])
        ->where('user_id', $request->user()->id)
        ->first();

        if (!$adminRequest) {
            return Inertia::render('dashboard', [
                'adminRequest' => null
            ]);
        }

        return Inertia::render('dashboard', [
            'adminRequest' => [
                'id' => $adminRequest->id,

                'course' => $adminRequest->course,

                // 👇 aqui entra o Resource
                'period' => new PeriodResource(
                    $adminRequest->period
                ),

                'status' => $adminRequest->status,
            ]
        ]);
    }
}