<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Whatsapp;

class WhatsappController extends Controller
{
    public function index()
    {
        $whatsapps = Whatsapp::orderBy('year', 'desc')->get();
        return Inertia::render('LandingEditor/Whatsapp/Index', [
            'whatsapps' => $whatsapps,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nomor' => ['required', 'regex:/^62\d{9,}$/', 'max:15'],
            'year' => ['required', 'integer'],
        ], [
            'nomor.required' => 'Nomor Whatsapp wajib diisi.',
            'nomor.regex' => 'Nomor harus diawali dengan 62 dan minimal 10 digit (contoh: 6281234567890).',
            'nomor.max' => 'Nomor terlalu panjang. Maksimal 15 digit.',
            'year.required' => 'Tahun wajib diisi.',
            'year.integer' => 'Tahun harus berupa angka.',
        ]);

        Whatsapp::create([
            'nomor' => $request->nomor,
            'year' => $request->year,
        ]);

        return redirect()->route('landing.whatsapp.index')->with('success', 'Nomor Whatsapp berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nomor' => ['required', 'regex:/^62\d{9,}$/', 'max:15'],
            'year' => ['required', 'integer'],
        ], [
            'nomor.required' => 'Nomor Whatsapp wajib diisi.',
            'nomor.regex' => 'Nomor harus diawali dengan 62 dan minimal 10 digit (contoh: 6281234567890).',
            'nomor.max' => 'Nomor terlalu panjang. Maksimal 15 digit.',
            'year.required' => 'Tahun wajib diisi.',
            'year.integer' => 'Tahun harus berupa angka.',
        ]);

        $whatsapp = Whatsapp::findOrFail($id);
        $whatsapp->update([
            'nomor' => $request->nomor,
            'year' => $request->year,
        ]);

        return redirect()->route('landing.whatsapp.index')->with('success', 'Nomor Whatsapp berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $whatsapp = Whatsapp::findOrFail($id);
        $whatsapp->delete();

        return redirect()->route('landing.whatsapp.index')->with('success', 'Nomor Whatsapp berhasil dihapus.');
    }
}
