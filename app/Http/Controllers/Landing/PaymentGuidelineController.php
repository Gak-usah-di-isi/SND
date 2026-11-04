<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use App\Models\LandingSetting;
use App\Models\PaymentGuideline;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentGuidelineController extends Controller
{

    public function showLandingPage(){
    $activeYear = LandingSetting::where('is_active', true)->first();

    if (!$activeYear) {
        return back()->with('error', 'Tidak ada tahun aktif yang ditemukan.');
    }

    // Ambil semua guideline berdasarkan tahun aktif
    $guidelines = PaymentGuideline::where('year', $activeYear->year)
        ->orderBy('year', 'desc')
        ->get();

    return view('landingpage.payment_guidelines.index', compact('guidelines', 'activeYear'));
    }

    public function index()
    {
        $paymentGuidelines = PaymentGuideline::orderBy('year', 'desc')->orderBy('bank_name')->get();
        $years = PaymentGuideline::select('year')->distinct()->orderBy('year', 'desc')->pluck('year');

        return Inertia::render('LandingEditor/PaymentGuidelines/Index', [
            'paymentGuidelines' => $paymentGuidelines,
            'years' => $years,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'bank_name' => 'required|string|max:255',
            'year' => 'required|integer',
            'guideline' => 'required',
        ]);

        PaymentGuideline::create($request->all());
        return redirect()->route('landing.payment_guidelines.index')->with('success', 'Guideline berhasil ditambahkan.');
    }

    public function update(Request $request, PaymentGuideline $paymentGuideline)
    {
        $request->validate([
            'bank_name' => 'required|string|max:255',
            'year' => 'required|integer',
            'guideline' => 'required',
        ]);

        $paymentGuideline->update($request->all());
        return redirect()->route('landing.payment_guidelines.index')->with('success', 'Guideline berhasil diperbarui.');
    }

    public function destroy(PaymentGuideline $paymentGuideline)
    {
        $paymentGuideline->delete();
        return redirect()->route('landing.payment_guidelines.index')->with('success', 'Guideline berhasil dihapus.');
    }
}
