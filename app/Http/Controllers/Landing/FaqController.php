<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Faq;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::latest()->get();
        return Inertia::render('LandingEditor/Faq/Index', ['faqs' => $faqs]);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ]);
        $validatedData['title'] = strip_tags($validatedData['title']);
        $validatedData['description'] = strip_tags($validatedData['description']);
        Faq::create($validatedData);
        return redirect()->route('landing.faq.index')->with('success', 'FAQ created successfully.');
    }

    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ]);
        $validatedData['title'] = strip_tags($validatedData['title']);
        $validatedData['description'] = strip_tags($validatedData['description']);
        $faq->update($validatedData);
        return redirect()->route('landing.faq.index')->with('success', 'FAQ updated successfully.');
    }
    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();
        return redirect()->route('landing.faq.index')->with('success', 'FAQ deleted successfully.');
    }
}
