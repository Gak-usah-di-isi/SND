<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CommitteeController extends Controller
{
    public function index()
    {
        return Inertia::render('LandingEditor/Committee/Index');
    }
}
