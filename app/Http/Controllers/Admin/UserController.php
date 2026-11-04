<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\FlashAlert;
use App\Models\AbstractModel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Upload;
use App\Models\Year;
use App\Models\ConferenceSetting;
use App\Exports\ParticipantsExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;
use App\Models\Certificate;
use Illuminate\Support\Str;
use App\Exports\NotPaidExport;
use App\Mail\InvitationMail;
use Illuminate\Support\Facades\Mail;
use App\Mail\ParallelSessionMail;
use App\Mail\AbstractInvoice;
use App\Models\EmailTemplate;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    use FlashAlert;
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $rolesToDisplay = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];
        $activeYear = Year::where('is_active', true)->first();

        $search  = $request->query('search');
        $role    = $request->query('role');
        $paper   = $request->query('paper');    // 'yes' | 'no'
        $payment = $request->query('payment');  // 'verified' | 'unverified'
        $student = $request->query('student');  // 'yes' | 'no'

        // Stat cards
        // Peserta aktif tahun berjalan: akun baru tahun ini ATAU peserta lama yang
        // masih punya jejak aktivitas di tahun aktif (pembayaran, abstrak, sertifikat).
        $indoParticipant = $this->activeInYear(
            User::whereHas('roles', fn ($q) => $q->where('name', 'indonesia-participants')),
            $activeYear
        )->count();
        $indoPresenter   = $this->activeInYear(
            User::whereHas('roles', fn ($q) => $q->where('name', 'indonesia-presenter')),
            $activeYear
        )->count();
        $foreignParticipant = $this->activeInYear(
            User::whereHas('roles', fn ($q) => $q->where('name', 'foreign-participants')),
            $activeYear
        )->count();
        $foreignPresenter   = $this->activeInYear(
            User::whereHas('roles', fn ($q) => $q->where('name', 'foreign-presenter')),
            $activeYear
        )->count();

        $users = $this->activeInYear(
            User::whereHas('roles', fn ($q) => $q->whereIn('name', $rolesToDisplay)),
            $activeYear
        )
            ->when($search, fn ($q) => $q->where(fn ($q) => $q->where('name', 'LIKE', "%{$search}%")->orWhere('email', 'LIKE', "%{$search}%")->orWhere('institution', 'LIKE', "%{$search}%")))
            ->when($role, fn ($q) => $q->whereHas('roles', fn ($q) => $q->where('name', $role)))
            ->when($paper === 'yes', fn ($q) => $q->whereHas('abstracts.fullPaper'))
            ->when($paper === 'no', fn ($q) => $q->whereDoesntHave('abstracts.fullPaper'))
            ->when($payment === 'verified', fn ($q) => $q->whereHas('filePayment', fn ($q) => $q->where('status', 'verified')))
            ->when($payment === 'unverified', fn ($q) => $q->whereDoesntHave('filePayment', fn ($q) => $q->where('status', 'verified')))
            ->when($student === 'yes', fn ($q) => $q->where('is_student', true))
            ->when($student === 'no', fn ($q) => $q->where(fn ($sub) => $sub->where('is_student', false)->orWhereNull('is_student')))
            ->with(['roles', 'abstracts.fullPaper', 'filePayment'])
            ->orderBy('created_at', 'desc')
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();

        $roleOptions = Role::whereIn('name', $rolesToDisplay)->get(['id', 'name']);
        $countries   = \App\Models\Country::orderBy('name')->get(['id', 'name']);

        return \Inertia\Inertia::render('Admin/Participants/Index', [
            'users'       => $users,
            'stats'       => compact('indoParticipant', 'indoPresenter', 'foreignParticipant', 'foreignPresenter'),
            'search'      => $search ?? '',
            'role'        => $role ?? '',
            'filters'     => compact('paper', 'payment', 'student'),
            'roleOptions' => $roleOptions,
            'countries'   => $countries,
        ]);
    }

    /**
     * Batasi query user ke peserta yang benar-benar aktif di tahun konferensi.
     *
     * Keaktifan tidak boleh hanya bergantung pada users.created_at karena akun
     * lama yang kembali berpartisipasi di tahun berjalan tidak akan terhitung.
     * User dianggap aktif bila memenuhi salah satu jejak aktivitas tahun itu:
     * akun dibuat tahun itu, punya pembayaran (files_payment.year), abstrak
     * (abstracts.created_at), atau sertifikat (certificates.year).
     */
    private function activeInYear($query, ?Year $activeYear)
    {
        if (!$activeYear) {
            return $query;
        }

        $year = $activeYear->year;

        return $query->where(function ($q) use ($year) {
            $q->whereYear('created_at', $year)
                ->orWhereHas('filePayments', fn ($sub) => $sub->where('year', $year))
                ->orWhereHas('abstracts', fn ($sub) => $sub->whereYear('created_at', $year))
                ->orWhereHas('certificates', fn ($sub) => $sub->where('year', $year));
        });
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::whereIn('name', [
            'indonesia-presenter',
            'foreign-presenter',
            'indonesia-participants',
            'foreign-participants'
        ])->get();
        $conferenceSetting = ConferenceSetting::first();
        return view('participants.create', compact('roles', 'conferenceSetting'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'name_certificate' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'institution' => ['required', 'string', 'max:255'],
            'job_title' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:15', 'regex:/^[0-9\-\+\(\)\s]*$/'],
            'attendance' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'country' => ['required', 'string', 'max:255'],
            'role_id' => ['required'],
            'is_student' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'name_certificate' => $validatedData['name_certificate'],
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
        $this->generateCertificate($user);

        return redirect()->route('admin.participant.index')->with($this->alertCreated());
    }

    private function generateCertificate(User $user)
    {
        try {
            // Tentukan template sertifikat untuk peserta
            $templateUrl = Upload::getFilePath('certificate_participant');
            if (!$templateUrl) {
                return;
            }

            $templatePath = storage_path('app/public/' . str_replace(asset('storage/'), '', $templateUrl));

            if (!file_exists($templatePath)) {
                return;
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
            $nameWidth = $pdf->GetStringWidth($user->name);
            $nameX = ($size['width'] - $nameWidth) / 2;  // Memusatkan nama
            $pdf->SetXY($nameX, 150);  // Koordinat untuk nama penerima
            $pdf->Write(0, $user->name);

            // Menambahkan garis bawah pada nama
            $pdf->Line($nameX, 155, $nameX + $nameWidth, 155);  // Garis bawah untuk nama

            // Menambahkan teks untuk institusi
            $participantText = "Participant";  // Teks yang ingin ditampilkan
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
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Gagal generate certificate user {$user->id}: " . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::with('abstracts.fullpaper', 'filePayment')->findOrFail($id);
        return view('participants.detail', compact('user'));
    }

    public function showAbstract(Request $request, $id)
    {
        $abstract = AbstractModel::with('symposium')->findOrFail($id);
        $abstract->formattedAuthors      = $this->formatAuthors($abstract->authors);
        $abstract->formattedAffiliations = $this->formatAffiliations($abstract->affiliations);

        $from = $request->query('from');
        if (!$from && str_contains(url()->previous(), '/admin/abstract')) {
            $from = 'abstract';
        }

        return \Inertia\Inertia::render('Admin/Participants/ShowAbstract', [
            'abstract' => $abstract,
            'from'     => $from === 'abstract' ? 'abstract' : 'participant',
        ]);
    }

    public function downloadAbstractPdf($id)
    {
        $abstract = AbstractModel::with('symposium')->findOrFail($id);
        $formattedAuthors = $this->formatAuthors($abstract->authors);
        $formattedAffiliations = $this->formatAffiliations($abstract->affiliations);

        $pdf = Pdf::loadView('participants.pdf', compact('abstract', 'formattedAuthors', 'formattedAffiliations'));

        return $pdf->stream('abstract-detail.pdf');
    }

    private function formatAuthors($authors)
    {
        return preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $authors);
    }

    private function formatAffiliations($affiliations)
    {
        $formattedAffiliations = preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $affiliations);
        return nl2br($formattedAffiliations);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return redirect()->route('admin.participant.index', ['edit' => $id]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'name_certificate' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
                'institution' => ['required', 'string', 'max:255'],
                'job_title' => ['required', 'string', 'max:255'],
                'phone_number' => ['required', 'string', 'max:15', 'regex:/^[0-9\-\+\(\)\s]*$/'],
                'attendance' => ['required', 'string', 'max:255'],
                'country' => ['required', 'string', 'max:255'],
                'role_id' => ['required'],
                'is_student' => ['nullable', 'boolean'],
            ]);

            $user->update([
                'name' => $validatedData['name'],
                'name_certificate' => $validatedData['name_certificate'],
                'email' => $validatedData['email'],
                'institution' => $validatedData['institution'],
                'job_title' => $validatedData['job_title'],
                'phone_number' => $validatedData['phone_number'],
                'attendance' => $validatedData['attendance'],
                'country' => $validatedData['country'],
                'is_student' => (bool) ($request->is_student ?? false),
            ]);

            $role = Role::findOrFail($validatedData['role_id']);
            $user->syncRoles([$role]);
            $user->flushCache();

            return redirect()->route('admin.participant.index');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.participant.index')->with($this->alertNotFound());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            foreach ($user->abstracts as $abstract) {
                if ($abstract->fullPaper) {
                    $fullPaperPath = $abstract->fullPaper->file_path;
                    if (Storage::disk('public')->exists($fullPaperPath)) {
                        Storage::disk('public')->delete($fullPaperPath);
                    }
                    $abstract->fullPaper->delete();
                }

                $abstract->delete();
            }

            foreach ($user->certificates as $certificate) {
                $certificatePath = $certificate->certificate_path;
                if (Storage::disk('public')->exists($certificatePath)) {
                    Storage::disk('public')->delete($certificatePath);
                }
                $certificate->delete();
            }

            $user->syncRoles([]);
            $user->flushCache();

            $user->delete();

            return redirect()->route('admin.participant.index')->with($this->alertDeleted());
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.participant.index')->with($this->alertNotFound());
        }
    }


    public function acceptancePdf($id)
    {
        @ini_set('memory_limit', '512M');

        $conferenceSetting = ConferenceSetting::first();
        $conferenceChairPerson = $conferenceSetting ? $conferenceSetting->conference_chairperson : null;
        $conferenceTitle       = $conferenceSetting ? $conferenceSetting->conference_title : null;
        $abstract = AbstractModel::with('user')->findOrFail($id);

        $letterHeader = Upload::getBase64Image('letter_header', 800);
        $signature    = Upload::getBase64Image('signature', 300);

        $pdf = PDF::loadView('participants.acceptance', compact('abstract', 'letterHeader', 'signature', 'conferenceChairPerson', 'conferenceTitle', 'conferenceSetting'));
        $pdf->getDomPDF()->set_option('dpi', 96);
        $pdf->getDomPDF()->set_option('isPhpEnabled', false);

        return $pdf->stream('abstract-acceptance.pdf');
    }
    public function exportExcel()
    {
        return Excel::download(new ParticipantsExport, 'participants.xlsx');
    }

    public function notPaidExcel()
    {
        return Excel::download(new NotPaidExport, 'participants_not_paid.xlsx');
    }

    // public function sendInvitation(Request $request)
    // {
    //     $users = User::whereHas('roles', function ($query) {
    //         $query->whereIn('name', [
    //             'indonesia-participants',
    //             'foreign-participants',
    //             'indonesia-presenter',
    //             'foreign-presenter'
    //         ]);
    //     })

    //         ->whereHas('abstracts', function ($q) {
    //             $q->where('status', 'accepted');
    //         })

    //         ->whereHas('filePayment', function ($q) {
    //             $q->where('status', 'verified');
    //         })
    //         ->get();

    //     foreach ($users as $user) {
    //         $abstract = $user->abstracts()->where('status', 'accepted')->first();
    //         if ($abstract) {
    //             Mail::to($user->email)->send(new InvitationMail($user, $abstract));
    //         }
    //     }

    //     return back()->with('success', "Invitation sent!");
    // }

    public function sendParallelSession(Request $request)
    {
        // $user = User::find(132);
        // if ($user) {
        //     $abstract = AbstractModel::where('user_id', $user->id)->first();
        //     Mail::to($user->email)->send(new ParallelSessionMail($user, $abstract));
        //     return back()->with('success', 'Invitation sent to user ID 158!');
        // }
        // return back()->with('error', 'User not found!');

        // $user = User::find(172);
        // if ($user) {
        //     Mail::to($user->email)->send(new ParallelSessionMail($user));
        //     return back()->with('success', 'Invitation sent');
        // }

        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('name', [
                'indonesia-participants',
                'foreign-participants',
                'indonesia-presenter',
                'foreign-presenter'
            ]);
        })
            ->whereHas('abstracts', function ($q) {
                $q->where('status', 'accepted');
            })
            ->whereHas('filePayment', function ($q) {
                $q->where('status', 'verified');
            })
            ->get();

        foreach ($users as $user) {
            Mail::to($user->email)->send(new ParallelSessionMail($user));
        }

        return back()->with('success', "Parallel session schedule sent!");
    }

    // public function sendInvitation(Request $request)
    // {
    //     // 1. Kirim ke PRESENTER (indo & foreign) - payment verified/pending, abstract accepted
    //     $presenters = User::whereHas('roles', function ($query) {
    //         $query->whereIn('name', [
    //             'indonesia-presenter',
    //             'foreign-presenter'
    //         ]);
    //     })
    //         ->whereHas('abstracts', function ($q) {
    //             $q->where('status', 'accepted');
    //         })
    //         ->whereHas('filePayment', function ($q) {
    //             $q->whereIn('status', ['verified', 'pending']);
    //         })
    //         ->get();

    //     foreach ($presenters as $user) {
    //         $abstract = $user->abstracts()->where('status', 'accepted')->first();
    //         Mail::to($user->email)->send(new InvitationMail($user, $abstract));
    //     }

    //     // 2. Kirim ke PARTICIPANT (indo & foreign) - payment verified, TIDAK perlu abstract
    //     $participants = User::whereHas('roles', function ($query) {
    //         $query->whereIn('name', [
    //             'indonesia-participants',
    //             'foreign-participants'
    //         ]);
    //     })
    //         ->whereHas('filePayment', function ($q) {
    //             $q->where('status', 'verified');
    //         })
    //         // Tidak perlu whereHas('abstracts')
    //         ->get();

    //     foreach ($participants as $user) {
    //         Mail::to($user->email)->send(new InvitationMail($user, null));
    //     }

    //     return back()->with('success', "Invitation sent!");
    // }

    public function sendInvoice($id)
    {
        try {
            $user = User::with(['roles', 'abstracts'])->findOrFail($id);
            $abstract = $user->abstracts()->where('status', 'accepted')->first() ?? $user->abstracts()->first();

            if (!$abstract) {
                return back()->with([
                    'type' => 'error',
                    'message' => 'Peserta belum memiliki abstrak untuk ditagihkan.',
                    'error' => 'Peserta belum memiliki abstrak untuk ditagihkan.'
                ]);
            }

            Mail::to($user->email)->send(new AbstractInvoice($user, $abstract));

            return back()->with([
                'type' => 'success',
                'message' => "Email tagihan invoice berhasil dikirim ke {$user->email}.",
                'success' => "Email tagihan invoice berhasil dikirim ke {$user->email}."
            ]);
        } catch (\Throwable $e) {
            Log::error("Gagal mengirim email tagihan invoice ke user ID {$id}: " . $e->getMessage());
            return back()->with([
                'type' => 'error',
                'message' => 'Gagal mengirim email tagihan: ' . $e->getMessage() . '. Port SMTP server mungkin terblokir. Silakan unduh PDF Invoice secara langsung.',
                'error' => 'Gagal mengirim email tagihan: ' . $e->getMessage()
            ]);
        }
    }

    public function invoicePdf($id)
    {
        @ini_set('memory_limit', '512M');

        $user = User::with(['roles', 'abstracts'])->findOrFail($id);
        $abstract = $user->abstracts()->where('status', 'accepted')->first() ?? $user->abstracts()->first();

        if (!$abstract) {
            abort(404, 'Abstrak tidak ditemukan untuk peserta ini.');
        }

        $conference = ConferenceSetting::first();
        $roleNames = $user->roles->pluck('name')->toArray();

        if (in_array('indonesia-presenter', $roleNames)) {
            $templateType = 'abstract_invoice_idr';
        } else {
            $templateType = 'abstract_invoice_usd';
        }

        $logoBase64 = Upload::getBase64Image('logo', 400);
        $signaturePath = Upload::getBase64Image('signature', 300);

        $emailTemplate = EmailTemplate::where('type', $templateType)->first();
        $isStudent = (bool) ($user->is_student ?? false);
        $amount = 0;
        if ($emailTemplate) {
            if ($isStudent && !is_null($emailTemplate->amount_student) && $emailTemplate->amount_student > 0) {
                $amount = $emailTemplate->amount_student;
            } else {
                $amount = $emailTemplate->amount ?? 0;
            }
        }
        $amountType = strtoupper($emailTemplate?->amount_type ?? 'USD');

        $pdf = Pdf::loadView('invoice.invoice-pdf', [
            'user' => $user,
            'abstract' => $abstract,
            'conference' => $conference,
            'logoBase64' => $logoBase64,
            'signaturePath' => $signaturePath,
            'amount' => $amount,
            'amountType' => $amountType
        ]);
        $pdf->getDomPDF()->set_option('dpi', 96);
        $pdf->getDomPDF()->set_option('isPhpEnabled', false);

        return $pdf->stream("Invoice_{$user->id}.pdf");
    }

    public function abstractInvoicePdf($id)
    {
        $abstract = AbstractModel::with('user.roles')->findOrFail($id);
        return $this->invoicePdf($abstract->user_id);
    }
}
