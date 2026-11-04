<?php

namespace App\Http\Controllers\Landing;

use App\Models\Instagram;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class InstagramController extends Controller
{
    public function index()
    {
        $instagramLinks = Instagram::orderBy('year', 'desc')->get();
        return Inertia::render('LandingEditor/Instagram/Index', [
            'instagrams' => $instagramLinks,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'link' => 'required|url',
            'year' => 'required|integer',
        ]);

        Instagram::create([
            'link' => $request->link,
            'year' => $request->year,
        ]);

        return redirect()->route('landing.instagram.index')->with('success', 'Instagram link berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'link' => 'required|url',
            'year' => 'required|integer',
        ]);

        $instagram = Instagram::findOrFail($id);
        $instagram->update([
            'link' => $request->link,
            'year' => $request->year,
        ]);

        return redirect()->route('landing.instagram.index')->with('success', 'Instagram link berhasil diupdate.');
    }

    public function destroy($id)
    {
        $instagram = Instagram::findOrFail($id);
        $instagram->delete();

        return redirect()->route('landing.instagram.index')->with('success', 'Instagram link berhasil dihapus.');
    }
}
