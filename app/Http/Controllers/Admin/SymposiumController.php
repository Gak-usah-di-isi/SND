<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Symposium;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\Rule;
use App\Traits\FlashAlert;
use App\Models\Year;
use Inertia\Inertia;

class SymposiumController extends Controller
{
    use FlashAlert;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with($this->alertDanger());
        }

        $perPage = (int) request('per_page', 5);
        if ($perPage < 1) {
            $perPage = 5;
        }
        if ($perPage > 50) {
            $perPage = 50;
        }

        $search = request('search', '');

        $baseQuery = Symposium::withCount('abstracts')
            ->whereYear('created_at', $activeYear->year)
            ->when($search, fn($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('abbreviation', 'like', "%{$search}%");
            }));

        $maxAbstracts = (int) (((clone $baseQuery)->get()->max('abstracts_count')) ?? 0);

        $symposiums = $baseQuery
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Symposium/Index', [
            'symposiums' => $symposiums,
            'maxAbstracts' => $maxAbstracts,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('symposium.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'         => ['required', 'string', 'max:255', 'unique:symposiums,name'],
            'abbreviation' => ['required', 'string', 'max:50', 'unique:symposiums,abbreviation'],
            'description'  => ['nullable', 'string'],
        ]);

        Symposium::create($validatedData);

        return redirect()->route('admin.symposium.index')->with($this->alertCreated());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $symposium = Symposium::findOrFail($id);
            return view('symposium.edit', compact('symposium'));
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.symposium.index')->with($this->alertNotFound());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $symposium = Symposium::findOrFail($id);

            $validatedData = $request->validate([
                'name'         => ['required', 'string', 'max:255', Rule::unique('symposiums', 'name')->ignore($symposium->id)],
                'abbreviation' => ['required', 'string', 'max:50', Rule::unique('symposiums', 'abbreviation')->ignore($symposium->id)],
                'description'  => ['nullable', 'string'],
            ]);

            $symposium->update($validatedData);

            return redirect()->route('admin.symposium.index')->with($this->alertUpdated());
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.symposium.index')->with($this->alertNotFound());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $symposium = Symposium::findOrFail($id);
            $symposium->delete();

            return redirect()->route('admin.symposium.index')->with($this->alertDeleted());
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.symposium.index')->with($this->alertNotFound());
        }
    }
}
