<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AdminRequest;

class AdminController extends Controller
{
    public function index()
    {
       $adminRequests = AdminRequest::with([
    'course',
    'period',
    'user'
])->get();
       return Inertia::render('admin/index', [
           'adminRequests' => $adminRequests
       ]);
    }
}
