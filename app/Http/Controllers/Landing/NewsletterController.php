<?php

namespace App\Http\Controllers\Landing;

use App\Exports\NewsletterExport;
use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class NewsletterController extends Controller
{

    public function show(Newsletter $newsletter)
    {
        return view('landingpage-editor.newsletters.show', compact('newsletter'));
    }

    public function index()
    {
        $newsletters = Newsletter::latest()->paginate(request('per_page', 10));
        return Inertia::render('LandingEditor/Newsletter/Index', [
            'newsletters' => $newsletters,
        ]);
    }

    public function create()
    {
        return view('landingpage-editor.newsletters.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email',
        ]);

        Newsletter::create(['email' => $request->email]);

        if (!Auth::check()) {
            return redirect('home')->with('success', 'You have subscribed successfully.');
        }

        return redirect()->route('home')->with('success', 'Subscriber added successfully.');
    }



    public function edit(Newsletter $newsletter)
    {
        return view('landingpage-editor.newsletters.edit', compact('newsletter'));
    }

    public function update(Request $request, Newsletter $newsletter)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email,' . $newsletter->id,
        ]);

        $newsletter->update(['email' => $request->email]);

        return redirect()->route('landing.newsletters.index')->with('success', 'Subscriber updated successfully.');
    }

    public function destroy(Newsletter $newsletter)
    {
        $newsletter->delete();
        return redirect()->route('landing.newsletters.index')->with('success', 'Subscriber deleted successfully.');
    }

    public function export()
    {
        return Excel::download(new NewsletterExport, 'newsletters.xlsx');
    }
}
