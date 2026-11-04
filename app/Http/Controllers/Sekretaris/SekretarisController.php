<?php

namespace App\Http\Controllers\Sekretaris;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AbstractModel;
use App\Models\FilePayment;
use App\Models\Symposium;
use App\Models\Certificate;
use App\Models\Role;
use App\Models\Year;
use App\Models\FullPaper;
use App\Traits\FlashAlert;
use App\Exports\ParticipantsExport;
use App\Exports\NotPaidExport;
use App\Exports\ReviewersExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class SekretarisController extends Controller
{
    use FlashAlert;

    /**
     * Dashboard Summary (Read-Only)
     */
    public function summary()
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return redirect()->back()->with($this->alertDanger());
        }

        $rolesToDisplay = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];

        // Peserta aktif tahun berjalan, bukan sekadar akun yang dibuat tahun ini:
        // akun lama yang kembali berpartisipasi (bayar/submit abstrak/sertifikat
        // di tahun aktif) tetap terhitung.
        $totalUsers = $this->activeInYear(
            User::whereHas('roles', function ($query) use ($rolesToDisplay) {
                $query->whereIn('name', $rolesToDisplay);
            }),
            $activeYear
        )->count();

        $usdToIdrRate = 16330;

        $payments = FilePayment::where('status', 'verified')
            ->whereYear('created_at', $activeYear->year)
            ->selectRaw('currency, SUM(amount) as total')
            ->groupBy('currency')
            ->get();

        $totalAmountPayment = 0;
        foreach ($payments as $payment) {
            if ($payment->currency === 'USD') {
                $totalAmountPayment += $payment->total * $usdToIdrRate;
            } else {
                $totalAmountPayment += $payment->total;
            }
        }

        $verifiedPaymentsCount = FilePayment::where('status', 'verified')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $unverifiedPaymentsCount = FilePayment::where('status', 'pending')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $paymentProofUploaded = FilePayment::whereNotNull('file_path')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $totalAbstracts = AbstractModel::where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $totalSymposiums = Symposium::whereYear('created_at', $activeYear->year)->count();

        $roleCounts = [];
        foreach ($rolesToDisplay as $role) {
            $roleCounts[$role] = $this->activeInYear(
                User::whereHas('roles', function ($query) use ($role) {
                    $query->where('name', $role);
                }),
                $activeYear
            )->count();
        }

        $onsiteCount = $this->activeInYear(
            User::whereHas('roles', function ($query) use ($rolesToDisplay) {
                $query->whereIn('name', $rolesToDisplay);
            })->where('attendance', 'onsite'),
            $activeYear
        )->count();

        $onlineCount = $this->activeInYear(
            User::whereHas('roles', function ($query) use ($rolesToDisplay) {
                $query->whereIn('name', $rolesToDisplay);
            })->where('attendance', 'online'),
            $activeYear
        )->count();

        $acceptedForOral = AbstractModel::where('status', 'accepted')->where('presentation_type', 'Oral presentation')->whereYear('created_at', $activeYear->year)->count();
        $acceptedForOralPaid = AbstractModel::where('status', 'accepted')
            ->where('presentation_type', 'Oral presentation')
            ->whereHas('user.filePayment', function ($query) {
                $query->where('status', 'verified');
            })
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $acceptedForPoster = AbstractModel::where('status', 'accepted')->where('presentation_type', 'Poster presentation')->whereYear('created_at', $activeYear->year)->count();
        $acceptedForPosterPaid = AbstractModel::where('status', 'accepted')
            ->where('presentation_type', 'Poster presentation')
            ->whereHas('user.filePayment', function ($query) {
                $query->where('status', 'verified');
            })->whereYear('created_at', $activeYear->year)->count();

        $submittedFullpaper = FullPaper::whereYear('created_at', $activeYear->year)->count();
        $fullpaperUnderReview = FullPaper::where('status', 'under review')->whereYear('created_at', $activeYear->year)->count();
        $fullpaperRevision = FullPaper::where('status', 'revision')->whereYear('created_at', $activeYear->year)->count();
        $fullpaperAccepted = FullPaper::where('status', 'accepted')->whereYear('created_at', $activeYear->year)->count();
        $fullpaperRejected = FullPaper::where('status', 'rejected')->whereYear('created_at', $activeYear->year)->count();

        $symposiums = Symposium::whereYear('created_at', $activeYear->year)
            ->withCount([
                'abstracts' => function ($query) use ($activeYear) {
                    $query->whereYear('created_at', $activeYear->year);
                },
                'abstracts as oral_presentation_count' => function ($query) use ($activeYear) {
                    $query->where('presentation_type', 'Oral Presentation')
                        ->whereYear('created_at', $activeYear->year);
                },
                'abstracts as poster_presentation_count' => function ($query) use ($activeYear) {
                    $query->where('presentation_type', 'Poster presentation')
                        ->whereYear('created_at', $activeYear->year);
                }
            ])->get();

        $roles = Role::whereIn('name', [
            'indonesia-presenter',
            'foreign-presenter',
            'indonesia-participants',
            'foreign-participants'
        ])->get();

        $countryParticipants = $this->activeInYear(
            User::whereHas('roles', function ($query) use ($roles) {
                $query->whereIn('name', $roles->pluck('name'));
            }),
            $activeYear
        )
            ->selectRaw('country, COUNT(*) as count')
            ->groupBy('country')
            ->orderByDesc('count')
            ->get();

        // Symposiums by publication
        $symposiumsByPublication = Symposium::whereYear('created_at', $activeYear->year)
            ->withCount([
                'abstracts as total' => fn($q) => $q->whereYear('created_at', $activeYear->year),
                'abstracts as journal_count' => fn($q) => $q->where('publication', 'Journal Publication')->whereYear('created_at', $activeYear->year),
                'abstracts as proceedings_count' => fn($q) => $q->where('publication', 'International Indexed Proceedings')->whereYear('created_at', $activeYear->year),
            ])->get(['id', 'name']);

        // Symposiums by attendance (lewat user)
        $symposiumsByAttendance = Symposium::whereYear('created_at', $activeYear->year)
            ->withCount([
                'abstracts as total' => fn($q) => $q->whereYear('created_at', $activeYear->year),
                'abstracts as onsite_count' => fn($q) => $q->whereYear('created_at', $activeYear->year)->whereHas('user', fn($q) => $q->where('attendance', 'onsite')),
                'abstracts as online_count' => fn($q) => $q->whereYear('created_at', $activeYear->year)->whereHas('user', fn($q) => $q->where('attendance', 'online')),
            ])->get(['id', 'name']);

        return Inertia::render('Sekretaris/Summary/Index', [
            'stats' => [
                'indoParticipant'    => $roleCounts['indonesia-participants'] ?? 0,
                'indoPresenter'      => $roleCounts['indonesia-presenter'] ?? 0,
                'foreignParticipant' => $roleCounts['foreign-participants'] ?? 0,
                'foreignPresenter'   => $roleCounts['foreign-presenter'] ?? 0,
                'totalUsers'         => $totalUsers,
                'totalAmountPayment' => $totalAmountPayment,
                'totalAbstracts'     => $totalAbstracts,
                'totalSymposiums'    => $totalSymposiums,
            ],
            'attendance' => [
                'onsite' => $onsiteCount,
                'online' => $onlineCount,
            ],
            'payment' => [
                'verified'   => $verifiedPaymentsCount,
                'unverified' => $unverifiedPaymentsCount,
                'proof'      => $paymentProofUploaded,
            ],
            'abstract' => [
                'oral'              => $acceptedForOral,
                'oralPaid'          => $acceptedForOralPaid,
                'poster'            => $acceptedForPoster,
                'posterPaid'        => $acceptedForPosterPaid,
                'fpSubmitted'       => $submittedFullpaper,
                'fpUnderReview'     => $fullpaperUnderReview,
                'fpRevision'        => $fullpaperRevision,
                'fpAccepted'        => $fullpaperAccepted,
                'fpRejected'        => $fullpaperRejected,
            ],
            'symposiumsByType'        => $symposiums->map(fn($s) => ['name' => $s->name, 'total' => $s->abstracts_count, 'oral' => $s->oral_presentation_count, 'poster' => $s->poster_presentation_count]),
            'symposiumsByPublication' => $symposiumsByPublication->map(fn($s) => ['name' => $s->name, 'total' => $s->total, 'journal' => $s->journal_count, 'proceedings' => $s->proceedings_count]),
            'symposiumsByAttendance'  => $symposiumsByAttendance->map(fn($s) => ['name' => $s->name, 'total' => $s->total, 'onsite' => $s->onsite_count, 'online' => $s->online_count]),
            'countryParticipants'     => $countryParticipants->map(fn($c) => ['country' => $c->country, 'count' => $c->count]),
        ]);
    }

    /**
     * Data Peserta (Read & Export Excel Only)
     */
    public function participants(Request $request)
    {
        $rolesToDisplay = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];
        $activeYear = Year::where('is_active', true)->first();

        $search  = $request->query('search');
        $role    = $request->query('role');
        $paper   = $request->query('paper');    // 'yes' | 'no'
        $payment = $request->query('payment');  // 'verified' | 'unverified'

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
            ->with(['roles', 'abstracts.fullPaper', 'filePayment'])
            ->orderBy('created_at', 'desc')
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();

        return Inertia::render('Sekretaris/Participants/Index', [
            'users'        => $users,
            'participants' => $users,
            'stats'        => compact('indoParticipant', 'indoPresenter', 'foreignParticipant', 'foreignPresenter'),
            'search'       => $search ?? '',
            'role'         => $role ?? '',
            'filters'      => compact('paper', 'payment'),
            'canExport'    => true,
            'canEdit'      => false,
        ]);
    }

    /**
     * Batasi query user ke peserta yang benar-benar aktif di tahun konferensi.
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
     * Export Excel Data Peserta
     */
    public function exportParticipants(Request $request)
    {
        $year = $request->query('year', Year::where('is_active', true)->value('year') ?? date('Y'));
        return Excel::download(new ParticipantsExport($year), "participants_{$year}.xlsx");
    }

    /**
     * Export Excel Data Peserta Belum Membayar
     */
    public function exportParticipantsNotPaid(Request $request)
    {
        $year = $request->query('year', Year::where('is_active', true)->value('year') ?? date('Y'));
        return Excel::download(new NotPaidExport(), "participants_not_paid_{$year}.xlsx");
    }

    /**
     * Data Abstracts (Read-Only)
     */
    public function abstracts(Request $request)
    {
        $search = $request->query('search');
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with('error', 'No active year set.');
        }

        $statusFilter           = $request->query('status');
        $presentationTypeFilter = $request->query('presentation_type');

        $abstracts = AbstractModel::with(['symposium', 'fullPaper', 'filePayment', 'user'])
            ->whereYear('created_at', $activeYear->year)
            ->when($search, fn($q) => $q->where('title', 'LIKE', "%{$search}%"))
            ->when($statusFilter, fn($q) => $q->where('status', $statusFilter))
            ->when($presentationTypeFilter, fn($q) => $q->where('presentation_type', $presentationTypeFilter))
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();

        $oralTotal = AbstractModel::where('presentation_type', 'Oral Presentation')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $oralPaid = AbstractModel::where('presentation_type', 'Oral Presentation')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->whereHas('filePayment', function ($query) {
                $query->where('status', 'verified');
            })
            ->count();

        $posterTotal = AbstractModel::where('presentation_type', 'Poster')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $posterPaid = AbstractModel::where('presentation_type', 'Poster')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->whereHas('filePayment', function ($query) {
                $query->where('status', 'verified');
            })
            ->count();

        $openTotal = AbstractModel::where('status', 'open')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $revisionTotal = AbstractModel::where('status', 'revision')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        return Inertia::render('Sekretaris/Abstracts/Index', [
            'abstracts'         => $abstracts,
            'oralTotal'         => $oralTotal,
            'oralPaid'          => $oralPaid,
            'posterTotal'       => $posterTotal,
            'posterPaid'        => $posterPaid,
            'openTotal'         => $openTotal,
            'revisionTotal'     => $revisionTotal,
            'search'            => $search ?? '',
            'filters'           => $request->only(['status', 'presentation_type']),
            'canEdit'           => false,
        ]);
    }

    /**
     * Symposium - Abstracts Book (Read & Download PDF)
     */
    public function abstractBook()
    {
        $activeYear = Year::where('is_active', true)->first();

        $symposiums = Symposium::with(['abstracts' => function ($query) use ($activeYear) {
            $query->when($activeYear, fn($q) => $q->whereYear('created_at', $activeYear->year));
        }])
            ->when($activeYear, fn($q) => $q->whereYear('created_at', $activeYear->year))
            ->get();

        foreach ($symposiums as $symposium) {
            foreach ($symposium->abstracts as $abstract) {
                $abstract->formattedAuthors = preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $abstract->authors ?? '');
                $abstract->formattedAffiliations = nl2br(preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $abstract->affiliations ?? ''));
            }
        }

        return Inertia::render('Sekretaris/AbstractBook/Index', [
            'symposiums' => $symposiums,
        ]);
    }

    /**
     * Download Abstract Book PDF
     */
    public function downloadAbstractBookPdf(Request $request)
    {
        $type = $request->query('type', 'all');
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with('error', 'No active year set.');
        }

        $query = AbstractModel::with('symposium')
            ->whereYear('created_at', $activeYear->year);

        if ($type === 'verified') {
            $query->where('status', 'accepted')
                ->whereHas('user.filePayment', fn($q) => $q->where('status', 'verified'));
        }

        $abstracts = $query->get();

        foreach ($abstracts as $abstract) {
            $abstract->formattedAuthors = preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $abstract->authors ?? '');
            $abstract->formattedAffiliations = nl2br(preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $abstract->affiliations ?? ''));
        }

        $viewName = $type === 'verified' ? 'abstract.verified_pdf' : 'abstract.all_pdf';
        $pdf = Pdf::loadView($viewName, compact('abstracts'));

        return $pdf->stream("{$type}-abstracts.pdf");
    }

    /**
     * Data Payments (Read-Only)
     */
    public function payments(Request $request)
    {
        $activeYear = Year::where('is_active', true)->first();

        $search = $request->query('search');
        $status = $request->query('status');
        $type   = $request->query('type');
        $range  = $request->query('range', 'all');

        $query = FilePayment::with(['user.roles', 'user.abstracts'])
            ->when($activeYear, fn($q) => $q->whereYear('created_at', $activeYear->year))
            ->when($search, fn($q) => $q->whereHas('user', fn($q) =>
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone_number', 'LIKE', "%{$search}%")
            ))
            ->when($status, fn($q) => $q->where('status', $status))
            ->when($type, fn($q) => $q->whereHas('user.roles', fn($q) => $q->where('name', $type)))
            ->when($range === 'today', fn($q) => $q->whereDate('created_at', today()))
            ->when($range === 'week',  fn($q) => $q->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]))
            ->when($range === 'month', fn($q) => $q->whereMonth('created_at', now()->month))
            ->latest();

        $total    = (clone $query)->count();
        $pending  = (clone $query)->where('status', 'pending')->count();
        $verified = (clone $query)->where('status', 'verified')->count();

        // Semua pending (tidak terbatas halaman) untuk carousel card
        $pendingAll = FilePayment::with('user.roles')
            ->when($activeYear, fn($q) => $q->whereYear('created_at', $activeYear->year))
            ->where('status', 'pending')
            ->latest()
            ->get();

        $payments = $query
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->appends($request->query());

        return Inertia::render('Sekretaris/Payments/Index', [
            'payments'   => $payments,
            'pendingAll' => $pendingAll,
            'stats'      => compact('total', 'pending', 'verified'),
            'filters'    => compact('search', 'status', 'type', 'range'),
            'canVerify'  => false,
        ]);
    }

    /**
     * Data Certificates (Read-Only)
     */
    public function certificates(Request $request)
    {
        $activeYear = Year::where('is_active', true)->first();
        $search = $request->query('search');
        $type = $request->query('type');

        $query = Certificate::with('user.filePayment')
            ->when($activeYear, fn($q) => $q->where('year', $activeYear->year))
            ->when($search, fn($q) => $q->whereHas('user', fn($sq) => $sq->where('name', 'LIKE', "%{$search}%")->orWhere('institution', 'LIKE', "%{$search}%")))
            ->when($type, fn($q) => $q->where('certificate_type', $type))
            ->latest();

        $total = (clone $query)->count();
        $active = (clone $query)->where('status', 1)->count();
        $inactive = (clone $query)->where('status', 0)->count();

        $certificates = $query->paginate(min((int) $request->query('per_page', 10), 100))->withQueryString();

        return Inertia::render('Sekretaris/Certificates/Index', [
            'certificates' => $certificates,
            'stats' => compact('total', 'active', 'inactive'),
            'search' => $search ?? '',
            'type' => $type ?? '',
            'canEdit' => false,
        ]);
    }

    /**
     * Data Reviewers (Read-Only)
     */
    public function reviewers(Request $request)
    {
        $activeYear = Year::where('is_active', true)->first();
        $activeYearVal = $activeYear ? (string) $activeYear->year : (string) date('Y');

        $rolesToDisplay = ['chief-editor', 'editor', 'reviewer'];

        $dbYears = Year::pluck('year')->map(fn($y) => (string) $y)->toArray();
        $userYears = User::whereHas('roles', fn($q) => $q->whereIn('name', $rolesToDisplay))
            ->selectRaw('DISTINCT YEAR(created_at) as yr')
            ->pluck('yr')
            ->filter()
            ->map(fn($y) => (string) $y)
            ->toArray();

        $allYears = collect(array_merge([$activeYearVal], $dbYears, $userYears))
            ->filter()
            ->unique()
            ->sortDesc()
            ->values()
            ->toArray();

        $perPage = (int) $request->input('per_page', 8);
        if ($perPage < 1) $perPage = 8;
        if ($perPage > 50) $perPage = 50;

        $search = $request->input('search', '');
        $role   = $request->input('role', '');
        $status = $request->input('status', '');
        $year   = $request->input('year', $activeYearVal);

        $query = User::whereHas('roles', function ($query) use ($rolesToDisplay) {
            $query->whereIn('name', $rolesToDisplay);
        });

        if ($year === $activeYearVal) {
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false)->whereYear('created_at', $activeYearVal);
            } elseif ($status === 'all') {
                $query->where(function ($q) use ($activeYearVal) {
                    $q->where('is_active', true)
                      ->orWhereYear('created_at', $activeYearVal);
                });
            } else {
                $query->where('is_active', true);
            }
        } elseif ($year === 'all') {
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        } else {
            $query->whereYear('created_at', $year);
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $users = $query->when($search, fn($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('institution', 'like', "%{$search}%");
            }))
            ->when($role, fn($q) => $q->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            }))
            ->with('roles')
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $roles = Role::whereIn('name', $rolesToDisplay)->get(['id', 'name', 'display_name']);

        return Inertia::render('Sekretaris/Reviewers/Index', [
            'users'          => $users,
            'reviewers'      => $users,
            'roles'          => $roles,
            'years'          => $allYears,
            'activeYear'     => $activeYearVal,
            'search'         => $search,
            'role'           => $role,
            'selectedYear'   => (string) $year,
            'selectedStatus' => (string) $status,
            'canEdit'        => false,
            'canExport'      => true,
        ]);
    }

    /**
     * Export Excel Data Reviewers
     */
    public function exportReviewers(Request $request)
    {
        return Excel::download(new ReviewersExport($request), 'reviewers.xlsx');
    }

    /**
     * Email CSV (Copy & Export)
     */
    public function emailCsv()
    {
        $roles = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with('error', 'No active year set.');
        }

        $emails = User::whereHas('roles', fn($q) => $q->whereIn('name', $roles))
            ->whereYear('created_at', $activeYear->year)
            ->pluck('email')
            ->toArray();

        $emailCsv = implode(',', $emails);

        return Inertia::render('Sekretaris/EmailCsv/Index', [
            'emailCsv' => $emailCsv,
            'totalEmails' => count($emails),
        ]);
    }
}
