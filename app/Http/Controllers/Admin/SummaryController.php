<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\FilePayment;
use App\Models\AbstractModel;
use App\Models\Symposium;
use App\Models\FullPaper;
use App\Models\Year;
use App\Models\Role;
use App\Traits\FlashAlert;

class SummaryController extends Controller
{
    use FlashAlert;

    public function index()
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

        return \Inertia\Inertia::render('Admin/Summary/Index', [
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
     * Batasi query user ke peserta yang benar-benar aktif di tahun konferensi.
     *
     * Sebelumnya keaktifan hanya dilihat dari users.created_at, sehingga akun
     * lama yang kembali berpartisipasi di tahun berjalan (mis. membayar atau
     * submit abstrak lagi) tidak ikut terhitung. Sekarang seorang user dianggap
     * aktif bila memenuhi salah satu jejak aktivitas tahun tersebut:
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
}
