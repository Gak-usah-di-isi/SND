<?php

namespace App\Http\Controllers;

use App\Support\ViewingYear;
use Illuminate\Http\Request;

class ViewingYearController extends Controller
{
    /**
     * Ganti tahun konferensi yang sedang dilihat peserta.
     * Hanya tahun yang benar-benar punya data milik peserta ini yang diterima.
     */
    public function update(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
        ]);

        $year = (int) $request->input('year');

        if (!in_array($year, ViewingYear::availableYears($request->user()), true)) {
            return back()->with([
                'type' => 'error',
                'message' => 'Tahun tersebut tidak tersedia untuk akun Anda.',
            ]);
        }

        ViewingYear::set($year);

        return back();
    }
}
