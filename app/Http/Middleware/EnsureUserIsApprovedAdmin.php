<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\AdminRequest;

class EnsureUserIsApprovedAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $hasApproval = AdminRequest::where('user_id', auth()->id())
            ->where('status', 'approved')
            ->exists();

        if (!$hasApproval) {
            return redirect()->route('admin.request.form');
        }

        return $next($request);
    }
}