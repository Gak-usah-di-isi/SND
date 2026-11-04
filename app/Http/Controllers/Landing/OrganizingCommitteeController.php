<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrganizingCommittee;
use App\Models\LandingSetting;
use Inertia\Inertia;

class OrganizingCommitteeController extends Controller
{
    public function showLandingPage($year = null)
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year');
        $years = LandingSetting::orderBy('year', 'desc')->pluck('year');
        $selectedYear = $year ?? $activeYear ?? ($years->isNotEmpty() ? $years->first() : date('Y'));

        $committees = OrganizingCommittee::where('year', $selectedYear)
            ->orderBy('id')
            ->get();

        return view('landingpage.committee.organizing', compact('committees', 'selectedYear'));
    }

    public function index(Request $request)
    {
        $years = OrganizingCommittee::select('year')->distinct()->orderBy('year', 'desc')->pluck('year');
        $categories = OrganizingCommittee::select('category')->distinct()->orderBy('category')->pluck('category');

        // Ambil filter dari request (default 'all' jika tidak ada)
        $selectedYear = $request->query('year', 'all');
        $selectedCategory = $request->query('category', 'all');

        // Query berdasarkan filter
        $query = OrganizingCommittee::query();

        if ($selectedYear !== 'all') {
            $query->where('year', $selectedYear);
        }

        if ($selectedCategory !== 'all') {
            $query->where('category', $selectedCategory);
        }

        $committees = $query->orderBy('year', 'desc')->orderBy('category')->get();

        // Pastikan variabel ini dikirim ke view
        return Inertia::render('LandingEditor/Committee/Organizing/Index', [
            'committees' => $committees,
            'years' => $years,
            'categories' => $categories,
            'selectedYear' => (string) $selectedYear,
            'selectedCategory' => (string) $selectedCategory,
        ]);
    }


    // Menampilkan form untuk menambahkan Organizing Committee
    public function create()
    {
        return redirect()->route('landing.organizing.index');
    }

    // Menyimpan Organizing Committee baru ke database
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:' . date('Y'),
        ]);

        OrganizingCommittee::create($request->all());

        return redirect()->route('landing.organizing.index')->with('success', 'Committee member added!');
    }

    // Menampilkan form edit Organizing Committee berdasarkan ID
    public function edit($id)
    {
        return redirect()->route('landing.organizing.index');
    }

    // Memperbarui data Organizing Committee
    public function update(Request $request, $id)
    {
        $committee = OrganizingCommittee::findOrFail($id); // ✅ Perbaikan
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:' . date('Y'),
        ]);

        $committee->update($request->all());

        return redirect()->route('landing.organizing.index')
            ->with('success', 'Organizing Committee updated successfully.');
    }

    // Menghapus Organizing Committee berdasarkan ID
    public function destroy($id)
    {
        $committee = OrganizingCommittee::findOrFail($id); // ✅ Perbaikan
        $committee->delete();

        return redirect()->route('landing.organizing.index')
            ->with('success', 'Organizing Committee deleted successfully.');
    }
}
