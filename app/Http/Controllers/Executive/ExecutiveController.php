<?php

namespace App\Http\Controllers\Executive;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\FilePayment;
use App\Models\AbstractModel;
use App\Models\Symposium;
use App\Models\FullPaper;
use App\Models\Year;
use App\Models\Role;
use App\Models\PresentationType;
use App\Traits\FlashAlert;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\ConferenceSetting;
use App\Exports\ParticipantsExport;
use Maatwebsite\Excel\Facades\Excel;


class ExecutiveController extends Controller
{
    use FlashAlert;

    public function index()
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return redirect()->back()->with($this->alertDanger());
        }

        $rolesToDisplay = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];

        $totalUsers = User::whereHas('roles', function ($query) use ($rolesToDisplay) {
            $query->whereIn('name', $rolesToDisplay);
        })
            ->whereYear('created_at', $activeYear->year)
            ->count();

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
            $roleCounts[$role] = User::whereHas('roles', function ($query) use ($role) {
                $query->where('name', $role);
            })
                ->whereYear('created_at', $activeYear->year)
                ->count();
        }

        $onsiteCount = User::whereHas('roles', function ($query) use ($rolesToDisplay) {
            $query->whereIn('name', $rolesToDisplay);
        })->where('attendance', 'onsite')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $onlineCount = User::whereHas('roles', function ($query) use ($rolesToDisplay) {
            $query->whereIn('name', $rolesToDisplay);
        })->where('attendance', 'online')
            ->whereYear('created_at', $activeYear->year)
            ->count();

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

        $countryParticipants = User::whereHas('roles', function ($query) use ($roles) {
            $query->whereIn('name', $roles->pluck('name'));
        })
            ->whereYear('created_at', $activeYear->year)
            ->selectRaw('country, COUNT(*) as count')
            ->groupBy('country')
            ->orderByDesc('count')
            ->get();

        $topCountry = $countryParticipants->first();

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

        return \Inertia\Inertia::render('Executive/Summary/Index', [
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
            'badgeCounts'             => [
                'pendingPayments' => $unverifiedPaymentsCount,
            ],
        ]);
    }

    public function participants(Request $request)
    {
        $rolesToDisplay = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with($this->alertDanger());
        }

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

        $roleOptions = Role::whereIn('name', $rolesToDisplay)->get(['id', 'name']);
        $countries   = \App\Models\Country::orderBy('name')->get(['id', 'name']);

        return \Inertia\Inertia::render('Executive/Participants/Index', [
            'users'       => $users,
            'stats'       => compact('indoParticipant', 'indoPresenter', 'foreignParticipant', 'foreignPresenter'),
            'search'      => $search ?? '',
            'role'        => $role ?? '',
            'filters'     => compact('paper', 'payment'),
            'roleOptions' => $roleOptions,
            'countries'   => $countries,
        ]);
    }

    public function exportParticipants()
    {
        return Excel::download(new ParticipantsExport, 'participants.xlsx');
    }

    public function exportParticipantsNotPaid()
    {
        return Excel::download(new \App\Exports\NotPaidExport, 'participants_not_paid.xlsx');
    }

    public function abstracts(Request $request)
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with($this->alertDanger());
        }

        $search                 = $request->query('search');
        $statusFilter           = $request->query('status');
        $presentationTypeFilter = $request->query('presentation_type');

        $abstracts = AbstractModel::with(['symposium', 'fullPaper', 'filePayment', 'user'])
            ->whereYear('created_at', $activeYear->year)
            ->when($search, fn($q) => $q->where('title', 'LIKE', "%{$search}%"))
            ->when($statusFilter, fn($q) => $q->where('status', $statusFilter))
            ->when($presentationTypeFilter, fn($q) => $q->where('presentation_type', $presentationTypeFilter))
            ->latest()
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();

        $oralTotal = AbstractModel::where('presentation_type', 'Oral presentation')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $oralPaid = AbstractModel::where('presentation_type', 'Oral presentation')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->whereHas('filePayment', fn ($q) => $q->where('status', 'verified'))
            ->count();

        $posterTotal = AbstractModel::where('presentation_type', 'Poster presentation')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $posterPaid = AbstractModel::where('presentation_type', 'Poster presentation')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->whereHas('filePayment', fn ($q) => $q->where('status', 'verified'))
            ->count();

        $openTotal = AbstractModel::where('status', 'open')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $revisionTotal = AbstractModel::where('status', 'revision')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        return \Inertia\Inertia::render('Executive/Abstract/Index', [
            'abstracts'         => $abstracts,
            'symposiums'        => Symposium::all(['id', 'name']),
            'presentationTypes' => PresentationType::all(['id', 'name', 'is_active']),
            'oralTotal'         => $oralTotal,
            'oralPaid'          => $oralPaid,
            'posterTotal'       => $posterTotal,
            'posterPaid'        => $posterPaid,
            'openTotal'         => $openTotal,
            'revisionTotal'     => $revisionTotal,
            'search'            => $search ?? '',
            'filters'           => $request->only(['status', 'presentation_type']),
        ]);
    }

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

    public function payments(Request $request)
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with($this->alertDanger());
        }

        $search = $request->query('search');
        $status = $request->query('status');
        $type = $request->query('type');
        $range = $request->query('range', 'all');

        $query = FilePayment::with('user.roles')
            ->whereYear('created_at', $activeYear->year)
            ->when($search, fn($q) => $q->whereHas('user', fn($q) =>
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('phone_number', 'LIKE', "%{$search}%")
            ))
            ->when($status, fn($q) => $q->where('status', $status))
            ->when($type, fn($q) => $q->whereHas('user.roles', fn($q) => $q->where('name', $type)))
            ->when($range === 'today', fn($q) => $q->whereDate('created_at', today()))
            ->when($range === 'week', fn($q) => $q->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]))
            ->when($range === 'month', fn($q) => $q->whereMonth('created_at', now()->month))
            ->latest();

        $total = (clone $query)->count();
        $pending = (clone $query)->where('status', 'pending')->count();
        $verified = (clone $query)->where('status', 'verified')->count();

        $pendingAll = FilePayment::with('user.roles')
            ->whereYear('created_at', $activeYear->year)
            ->where('status', 'pending')
            ->latest()
            ->get();

        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);
        $payments = $query->paginate($perPage)->appends($request->query());

        return \Inertia\Inertia::render('Executive/Payment/Index', [
            'payments' => $payments,
            'pendingAll' => $pendingAll,
            'stats' => compact('total', 'pending', 'verified'),
            'filters' => compact('search', 'status', 'type', 'range'),
        ]);
    }

    public function reviewers()
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with($this->alertDanger());
        }

        $rolesToDisplay = ['chief-editor', 'editor', 'reviewer'];
        $perPage = (int) request('per_page', 8);
        if ($perPage < 1) {
            $perPage = 8;
        }
        if ($perPage > 50) {
            $perPage = 50;
        }

        $search = request('search', '');
        $role = request('role', '');

        $users = User::whereHas('roles', function ($query) use ($rolesToDisplay) {
            $query->whereIn('name', $rolesToDisplay);
        })
            ->whereYear('created_at', $activeYear->year)
            ->when($search, fn($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('institution', 'like', "%{$search}%");
            }))
            ->when($role, fn($q) => $q->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            }))
            ->with('roles')
            ->paginate($perPage)
            ->withQueryString();

        $roles = Role::whereIn('name', $rolesToDisplay)->get(['id', 'name', 'display_name']);

        return \Inertia\Inertia::render('Executive/Reviewer/Index', [
            'users' => $users,
            'roles' => $roles,
            'search' => $search,
            'role' => $role,
        ]);
    }
}
