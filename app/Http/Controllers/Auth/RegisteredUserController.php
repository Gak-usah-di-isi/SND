<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\RegistrationConfirmation;
use Illuminate\Support\Facades\Mail;
use setasign\Fpdi\Fpdi;
use App\Models\Certificate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Upload;
use App\Models\ConferenceSetting;
use Illuminate\Support\Facades\File;
use App\Models\Country;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $roleOrder = [
            'indonesia-presenter',
            'foreign-presenter',
            'indonesia-participants',
            'foreign-participants',
            'reviewer',
        ];

        $roles = Role::whereIn('name', $roleOrder)
            ->get(['id', 'name', 'display_name'])
            ->sortBy(function ($role) use ($roleOrder) {
                $idx = array_search($role->name, $roleOrder);
                return $idx === false ? 999 : $idx;
            })
            ->values();
        $conferenceSetting = ConferenceSetting::first();
        $openRegistration = $conferenceSetting->open_registration ?? false;
        $conferenceTitle = optional($conferenceSetting)->conference_title ?? 'The 3rd International Conference on Applied Science for Vocational Education';
        $conferenceAbbreviation = optional($conferenceSetting)->conference_abbreviation ?? 'ICASVE2025';
        $logo = Upload::currentForType('logo');
        $logoPath = $logo ? asset('storage/' . $logo->file_path) : asset('img/Logo_ICASVE_rmbg.png');
        $countries = Country::orderBy('name', 'asc')->get(['id', 'name']);

        return Inertia::render('Auth/Register', compact('roles', 'openRegistration', 'conferenceTitle', 'conferenceAbbreviation', 'logoPath', 'countries'));
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $conferenceSetting = ConferenceSetting::first();
        if (!$conferenceSetting || !$conferenceSetting->open_registration) {
            return redirect()->route('register')->with('type', 'error')->with('message', 'Registration Closed.');
        }

        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'institution' => ['required', 'string', 'max:255'],
            'job_title' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:15', 'regex:/^[0-9\-\+\(\)\s]*$/'],
            'attendance' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => ['required', 'exists:roles,id'],
            'is_student' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'institution' => $validatedData['institution'],
            'job_title' => $validatedData['job_title'],
            'phone_number' => $validatedData['phone_number'],
            'attendance' => $validatedData['attendance'],
            'country' => $validatedData['country'],
            'password' => Hash::make($validatedData['password']),
            'is_student' => (bool) ($request->is_student ?? false),
        ]);

        $role = Role::findOrFail($validatedData['role_id']);
        $user->syncRoles([$role]);
        $user->flushCache();

        event(new Registered($user));

        $conference = ConferenceSetting::first();

        $details = [
            'name' => $validatedData['name'],
            'institution' => $validatedData['institution'],
            'job_title' => $validatedData['job_title'],
            'email' => $validatedData['email'],
            'phone_number' => $validatedData['phone_number'],
            'registration_type' => $role->display_name,
            'conference_title' => $conference->conference_title,
            'password' => $validatedData['password'],
        ];

        if (env('MAIL_SEND_REGISTRATION_EMAIL', false)) {
            Mail::to($validatedData['email'])->send(new RegistrationConfirmation($details));
        }

        $this->generateCertificate($user);

        return redirect(route('login'))->with('type', 'success')->with('message', 'Registration successful. A confirmation email has been sent.');
    }

    public function generateCertificate(User $user)
    {
        if ($user->hasRole('reviewer')) {
            $templateUrl = Upload::getFilePath('reviewer_certificate');
            $certificateType = 'reviewer';
            $participantText = 'Reviewer';
        } else {
            $templateUrl = Upload::getFilePath('certificate_participant');
            $certificateType = 'participant';
            $participantText = 'Participant';
        }

        $templatePath = storage_path('app/public/' . str_replace(asset('storage/'), '', $templateUrl));

        if (!file_exists($templatePath)) {
            throw new \Exception('Certificate template not found');
        }

        // Inisialisasi FPDI
        $pdf = new Fpdi();
        $pdf->setSourceFile($templatePath);
        $template = $pdf->importPage(1);
        $size = $pdf->getTemplateSize($template);
        $pdf->addPage($size['orientation'], [$size['width'], $size['height']]);
        $pdf->useTemplate($template);

        // Menambahkan teks ke dalam template sertifikat
        $pdf->SetFont('Times', 'B', 45); // Gunakan font Times New Roman atau Helvetica

        // Menentukan posisi untuk nama penerima dan menambahkan garis bawah
        $nameToPrint = $user->name_certificate ?: $user->name;
        $nameWidth = $pdf->GetStringWidth($nameToPrint);
        $nameX = ($size['width'] - $nameWidth) / 2;  // Memusatkan nama
        $pdf->SetXY($nameX, 150);  // Koordinat untuk nama penerima
        $pdf->Write(0, $nameToPrint);

        // Menambahkan garis bawah pada nama
        $pdf->Line($nameX, 155, $nameX + $nameWidth, 155);  // Garis bawah untuk nama

        // Menambahkan teks untuk institusi
        $participantWidth = $pdf->GetStringWidth($participantText);
        $participantX = ($size['width'] - $participantWidth) / 2;  // Memusatkan teks
        $pdf->SetXY($participantX, 200);  // Koordinat untuk teks
        $pdf->Write(0, $participantText);

        // Menyimpan PDF ke storage
        Storage::disk('public')->makeDirectory('certificates');
        $certificateName = Str::random(20) . '.pdf';  // Hash nama file
        $certificatePath = 'certificates/' . $certificateName;
        $pdf->Output(storage_path('app/public/' . $certificatePath), 'F');

        // Menyimpan path sertifikat ke database
        Certificate::create([
            'user_id' => $user->id,
            'year' => \App\Models\Year::activeYear(),
            'certificate_type' => 'participant',
            'certificate_path' => $certificatePath,
        ]);
    }
}
