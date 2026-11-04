<?php

namespace App\Http\Controllers\Landing;

use Illuminate\Http\Request;
use App\Models\Prevconference;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PrevconferenceController extends Controller
{
    public function index()
    {
        $prevconferences = Prevconference::orderBy('year', 'desc')->get();

        return Inertia::render('LandingEditor/PrevConference/Index', [
            'prevconferences' => $prevconferences,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'image' => ['required', 'file', 'image', 'max:2048', 'mimes:jpeg,png,jpg'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'keynote' => ['required', 'string'],
            'date' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'year' => ['required', 'integer'],
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('prevconferences', 'public');
            $validatedData['image'] = $imagePath;
        }

        if ($request->hasFile('pdf')) {
            $pdfPath = $request->file('pdf')->store('prevconferences/pdfs', 'public');
            $validatedData['pdf'] = $pdfPath;
        }

        Prevconference::create($validatedData);

        return redirect()->route('landing.prevconference.index')->with('success', 'Prevconference created successfully.');
    }

    public function update(Request $request, $id)
    {
        $prevconference = Prevconference::findOrFail($id);
        $validatedData = $request->validate([
            'image' => ['nullable', 'file', 'image', 'max:2048', 'mimes:jpeg,png,jpg'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'keynote' => ['required', 'string'],
            'date' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'year' => ['required', 'integer'],
        ]);

        if ($request->hasFile('image')) {
            if ($prevconference->image) {
                Storage::disk('public')->delete($prevconference->image);
            }
            $imagePath = $request->file('image')->store('prevconferences', 'public');
            $validatedData['image'] = $imagePath;
        } else {
            $validatedData['image'] = $prevconference->image;
        }

        if ($request->hasFile('pdf')) {
            if ($prevconference->pdf) {
                Storage::disk('public')->delete($prevconference->pdf);
            }
            $pdfPath = $request->file('pdf')->store('prevconferences/pdfs', 'public');
            $validatedData['pdf'] = $pdfPath;
        } else {
            $validatedData['pdf'] = $prevconference->pdf;
        }

        $prevconference->update($validatedData);

        return redirect()->route('landing.prevconference.index')->with('success', 'Prevconference updated successfully.');
    }

    public function destroy($id)
    {
        $prevconference = Prevconference::findOrFail($id);

        if ($prevconference->image) {
            Storage::disk('public')->delete($prevconference->image);
        }

        if ($prevconference->pdf) {
            Storage::disk('public')->delete($prevconference->pdf);
        }

        $prevconference->delete();

        return redirect()->route('landing.prevconference.index')->with('success', 'Prevconference deleted successfully.');
    }
}
