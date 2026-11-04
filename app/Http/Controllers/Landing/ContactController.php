<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\Year;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function showLandingpage()
{
    $activeYear = Year::where('is_active', true)->first();

    if (!$activeYear) {
        return back()->with('error', 'Tidak ada tahun aktif yang ditemukan.');
    }

    $contacts = Contact::where('year', $activeYear->year)->get();

    return view('landingpage.contact.contact', compact('contacts'));
}

    

    public function index()
    {
        $contacts = Contact::all();
        return Inertia::render('LandingEditor/LandingPage/Contact/Index', ['contacts' => $contacts]);
    }



    public function store(Request $request)
{
    $request->validate([
        'phone1'       => 'required|string|max:20',
        'phone1_name'  => 'nullable|string|max:255',
        'phone2'       => 'nullable|string|max:20',
        'phone2_name'  => 'nullable|string|max:255',
        'email'        => 'nullable|email|max:255',
        'address'      => 'required|string',
        'year'         => 'required|integer|min:2000|max:' . date('Y'),
    ]);

    Contact::create($request->all());

    return redirect()->route('landing.contact.index')->with('success', 'Contact added successfully!');
}




    public function update(Request $request, $id)
    {
        $request->validate([
            'phone1'       => 'required|string|max:20',
            'phone1_name'  => 'nullable|string|max:255',
            'phone2'       => 'nullable|string|max:20',
            'phone2_name'  => 'nullable|string|max:255',
            'email'        => 'nullable|email|max:255',
            'address'      => 'required|string',
            'year'         => 'required|integer|min:2000|max:' . date('Y'),
        ]);
    
        $contact = Contact::findOrFail($id);
        $contact->update($request->all());
    
        return redirect()->route('landing.contact.index')->with('success', 'Contact updated successfully!');
    }
    

    public function destroy($id)
    {
        Contact::findOrFail($id)->delete();
        return redirect()->route('landing.contact.index')->with('success', 'Contact deleted successfully!');
    }

    public function sendEmail(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $details = [
            'name'    => $request->name,
            'email'   => $request->email,
            'message' => $request->message,
        ];

        Mail::send('emails.contact', $details, function ($message) use ($details) {
            $message->to('admin@example.com') // Ganti dengan email tujuan
                ->subject('New Contact Message from ' . $details['name']);
        });

        return redirect()->back()->with('success', 'Your message has been sent successfully!');
    }
}
