<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Year;

class EmailCsvController extends Controller
{
    public function index()
    {
        $roles = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];

        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with('error', 'No active year set.');
        }

        $emails = User::whereHas('roles', function ($query) use ($roles) {
            $query->whereIn('name', $roles);
        })
            ->whereYear('created_at', $activeYear->year)
            ->pluck('email')->toArray();

        $emailCsv = implode(',', $emails);

        return Inertia::render('Admin/EmailCsv/Index', [
            'emailCsv' => $emailCsv,
        ]);
    }
}
