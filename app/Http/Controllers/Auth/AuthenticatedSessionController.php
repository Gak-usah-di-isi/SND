<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ConferenceSetting;
use App\Models\Upload;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        $conferenceSetting = ConferenceSetting::first();
        $conferenceTitle = optional($conferenceSetting)->conference_title ?? 'Seminar Nasional Berdampak';
        $conferenceAbbreviation = optional($conferenceSetting)->conference_abbreviation ?? 'SND';

        $logo = Upload::currentForType('logo');
        $logoPath = $logo ? asset('storage/' . $logo->file_path) : asset('img/Logo_ICASVE_rmbg.png');

        return Inertia::render('Auth/Login', compact('conferenceTitle', 'conferenceAbbreviation', 'logoPath'));
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): SymfonyResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();
        $roles = $user->roles->pluck('name')->toArray();

        $users = [
            'indonesia-presenter',
            'foreign-presenter',
            'indonesia-participants',
            'foreign-participants',
        ];

        // These targets are still classic Blade views (not migrated to Inertia yet).
        // A plain redirect() makes Inertia's client try to parse the Blade HTML as an
        // Inertia response and fail ("Permintaan tidak dapat diproses"), even though the
        // login itself succeeded - Inertia::location() forces a real full-page browser
        // navigation instead, which renders Blade views correctly.
        if (array_intersect($roles, $users)) {
            return Inertia::location(route('dashboard'));
        }

        $reviewer = [
            'chief-editor',
            'editor',
            'reviewer'
        ];

        if (array_intersect($roles, $reviewer)) {
            return Inertia::location(route('reviewer.summary'));
        }

        $landingEditor = [
            'landing-editor'
        ];

        if (array_intersect($roles, $landingEditor)) {
            return Inertia::location(route('landing.landingpage.index'));
        }

        if (in_array('bendahara', $roles)) {
            return Inertia::location(route('bendahara.summary'));
        }

        if (in_array('sekretaris', $roles)) {
            return Inertia::location(route('sekretaris.summary'));
        }

        if (in_array('humas', $roles)) {
            return Inertia::location(route('humas.summary'));
        }

        $executive = [
            'executive'
        ];

        if (array_intersect($roles, $executive)) {
            return Inertia::location(route('executive.index'));
        }

        // admin.summary is already an Inertia page, so a normal redirect keeps the smooth SPA navigation.
        return redirect()->intended(route('admin.summary', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): SymfonyResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // '/' is the public Blade landing page, not an Inertia page - see the note on
        // store() above for why this needs Inertia::location() instead of redirect().
        return Inertia::location('/');
    }
}
