<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbstractModel;
use App\Models\Symposium;
use App\Models\FullPaper;
use App\Models\Year;
use App\Traits\FlashAlert;

class OralController extends Controller
{
    use FlashAlert;

    public function index(Request $request)
    {
        $activeYear = Year::where('is_active', true)->first();

        $search = $request->query('search');
        $filter = $request->query('symposium');

        $symposiums = Symposium::with(['abstracts' => function ($query) use ($search) {
            $query->where('presentation_type', 'Oral presentation')
                ->when($search, fn($q) => $q->where(function ($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%")
                      ->orWhere('authors', 'LIKE', "%{$search}%");
                }))
                ->with('user');
        }])
        ->when($activeYear, fn($q) => $q->whereYear('created_at', $activeYear->year))
        ->when($filter, fn($q) => $q->where('id', $filter))
        ->get();

        $allSymposiums = Symposium::orderBy('name')
            ->when($activeYear, fn($q) => $q->whereYear('created_at', $activeYear->year))
            ->get(['id', 'name', 'abbreviation']);

        $stats = $symposiums->map(fn($s) => [
            'id'    => $s->id,
            'name'  => $s->name,
            'abbr'  => $s->abbreviation,
            'count' => $s->abstracts->count(),
        ]);

        return \Inertia\Inertia::render('Admin/OralDistribution/Index', [
            'symposiums'    => $symposiums,
            'allSymposiums' => $allSymposiums,
            'stats'         => $stats,
            'search'        => $search ?? '',
            'filter'        => $filter ?? '',
        ]);
    }

    public function edit($id)
    {
        $abstract = AbstractModel::findOrFail($id);
        $symposiums = Symposium::all();
        return view('oral.edit', compact('abstract', 'symposiums'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'symposium_id' => 'required|exists:symposiums,id',
        ]);

        $abstract = AbstractModel::findOrFail($id);
        $abstract->update(['symposium_id' => $request->symposium_id]);

        return back();
    }
}
