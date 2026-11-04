<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Venue;
use Illuminate\Support\Facades\Storage;
use App\Models\Year;
use Inertia\Inertia;

class VenueController extends Controller
{
    public function index()
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with('error', 'Tidak ada tahun aktif yang ditemukan.');
        }

        $venues = Venue::whereYear('created_at', $activeYear->year)->get();
        return Inertia::render('LandingEditor/LandingPage/Venue/Index', ['venues' => $venues]);
    }



    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'image_path' => ['required', 'file', 'image', 'max:2048', 'mimes:jpeg,png,jpg'],
            'venue_name' => ['required', 'string', 'max:255', 'min:3'],
            'address' => ['required', 'string', 'max:255', 'min:10'],
            'date' => ['required', 'date'],
            'link_map' => ['required', 'url'],
            'map' => ['required', 'string', 'min:10'],
            'year' => ['required', 'integer', 'min:2024', 'max:' . date('Y')],
            'conference_mode' => ['nullable', 'string', 'max:255'],
            'onsite_programme' => ['nullable', 'string'],
            'online_programme' => ['nullable', 'string'],
        ]);
    
        if ($request->hasFile('image_path')) {
            $imagePath = $request->file('image_path')->store('venues', 'public');
            $validatedData['image_path'] = $imagePath;
        }
    
        Venue::create($validatedData);
    
        return redirect()->route('landing.venue.index')->with('success', 'Venue created successfully.');
    }



    public function update(Request $request, $id)
    {
        $venue = Venue::findOrFail($id);
        $validatedData = $request->validate([
            'image_path' => ['nullable', 'file', 'image', 'max:2048', 'mimes:jpeg,png,jpg'],
            'venue_name' => ['string', 'max:255', 'min:3'],
            'address' => ['string', 'max:255', 'min:10'],
            'date' => ['date'],
            'link_map' => ['url'],
            'map' => ['string', 'min:10'],
            'year' => ['required', 'integer', 'min:2024', 'max:' . date('Y')],
            'conference_mode' => ['nullable', 'string', 'max:255'],
            'onsite_programme' => ['nullable', 'string'],
            'online_programme' => ['nullable', 'string'],
        ]);
    
        if ($request->hasFile('image_path')) {
            if ($venue->image_path) {
                Storage::disk('public')->delete($venue->image_path);
            }
            $imagePath = $request->file('image_path')->store('venues', 'public');
            $validatedData['image_path'] = $imagePath;
        } else {
            $validatedData['image_path'] = $venue->image_path;
        }
    
        $venue->update($validatedData);
    
        return redirect()->route('landing.venue.index')->with('success', 'Venue updated successfully.');
    }

    public function destroy($id)
    {
        $venue = Venue::findOrFail($id);
        if ($venue->image_path) {
            Storage::disk('public')->delete($venue->image_path);
        }
        $venue->delete();
        return redirect()->route('landing.venue.index')->with('success', 'Venue deleted successfully.');
    }
}
