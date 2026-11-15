<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\LandingSetting;
use App\Models\Venue;
use App\Support\LandingLayoutData;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function showLandingpage()
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year');
        $contact = $activeYear
            ? Contact::where('year', $activeYear)->first([
                'id',
                'phone1',
                'phone1_name',
                'phone2',
                'phone2_name',
                'email',
                'address',
                'year',
            ])
            : null;
        $venues = $activeYear
            ? Venue::where('year', $activeYear)->get([
                'id',
                'image_path',
                'venue_name',
                'address',
                'date',
                'link_map',
                'map',
                'year',
                'conference_mode',
                'onsite_programme',
                'online_programme',
            ])
            : collect();

        return Inertia::render('Landing/Contact', array_merge(LandingLayoutData::props(), [
            'activeYear' => $activeYear,
            'contact' => $contact,
            'venues' => $venues,
        ]));
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => ['required', 'string', 'max:255', 'not_regex:/[\r\n]/'],
            'message' => 'required|string',
        ]);
        $details = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'body' => $validated['message'],
        ];

        $activeYear = LandingSetting::where('is_active', true)->value('year');
        $recipient = $activeYear
            ? Contact::where('year', $activeYear)->whereNotNull('email')->value('email')
            : null;
        $recipient = $recipient ?: config('mail.from.address');

        try {
            Mail::send('emails.contact', $details, function ($mail) use ($details, $recipient) {
                $mail->to($recipient)
                    ->replyTo($details['email'], $details['name'])
                    ->subject($details['subject']);
            });
        } catch (TransportExceptionInterface $exception) {
            Log::error('Contact form email delivery failed.', ['exception' => $exception]);

            return back()->with([
                'type' => 'error',
                'message' => 'Pesan belum dapat dikirim. Silakan coba lagi nanti.',
            ]);
        }

        return back()->with([
            'type' => 'success',
            'message' => 'Pesan Anda sudah terkirim. Panitia akan membalas lewat email.',
        ]);
    }
}
