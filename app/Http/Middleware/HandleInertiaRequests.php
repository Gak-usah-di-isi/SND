<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Upload;
use App\Models\Year;
use App\Support\ViewingYear;
use Illuminate\Support\Str;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'inertia';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'activeYear' => fn () => Year::where('is_active', true)->first()?->only('year'),
            'logoPath'   => function () {
                $logo = Upload::currentForType('logo');
                return $logo ? asset('storage/' . $logo->file_path) : null;
            },
            'authUser'   => fn () => $request->user()?->only('name', 'email'),
            'authRoles'  => fn () => $request->user()?->roles->pluck('name') ?? [],
            'userNotifications' => fn () => $this->resolveUserNotifications($request),
            // Pemilih tahun hanya untuk peserta — role lain tetap melihat label
            // tahun aktif saja (lihat IcasveSidebar).
            'viewingYear'    => fn () => $this->isParticipant($request) ? ViewingYear::current($request->user()) : null,
            'availableYears' => fn () => $this->isParticipant($request)
                ? ViewingYear::availableYears($request->user())
                : [],
            'canAccessFinalPaper' => function () use ($request) {
                $user = $request->user();
                if (!$user || !$this->isParticipant($request)) return false;
                $viewingYear = ViewingYear::current($user);
                return $user->abstracts()
                    ->when($viewingYear, fn ($q) => $q->whereYear('created_at', $viewingYear))
                    ->where('status', 'accepted')
                    ->exists();
            },
            'isArchiveMode'  => fn () => $this->isParticipant($request) && ViewingYear::isReadOnly($request->user()),
            'csrfToken'  => fn () => csrf_token(),
            // Feature flags dibaca dari .env lewat config/services.php sehingga
            // UI bisa menyembunyikan modul tanpa menghapus komponennya.
            'features'   => [
                'commitment_letter' => filter_var(config('services.features.commitment_letter'), FILTER_VALIDATE_BOOLEAN),
            ],
            'flash'      => fn () => [
                'type'    => $request->session()->get('type') ?? ($request->session()->has('status') ? 'success' : null),
                'message' => $request->session()->get('message') ?? $request->session()->get('status'),
            ],
        ];
    }

    /** Role peserta — satu-satunya yang punya riwayat lintas tahun. */
    private function isParticipant(Request $request): bool
    {
        $user = $request->user();
        if (!$user) {
            return false;
        }

        return $user->roles->pluck('name')->intersect([
            'indonesia-presenter',
            'foreign-presenter',
            'indonesia-participants',
            'foreign-participants',
        ])->isNotEmpty();
    }

    /**
     * Resolves real-time status notifications for participants and presenters.
     */
    private function resolveUserNotifications(Request $request): array
    {
        $user = $request->user();
        if (!$user || !$this->isParticipant($request)) {
            return [];
        }

        $notifications = [];

        // 1. Payment status notification
        $payment = $user->filePayment;
        if ($payment) {
            if ($payment->status === 'verified') {
                $notifications[] = [
                    'id' => 'payment-' . $payment->id,
                    'type' => 'success',
                    'icon' => 'solar:check-circle-bold',
                    'color' => '#10B981',
                    'bg' => 'rgba(16,185,129,0.1)',
                    'title' => 'Payment Verified',
                    'message' => 'Your payment has been successfully verified.',
                    'url' => '/payment',
                    'time' => $payment->updated_at?->diffForHumans() ?? 'Recently',
                ];
            } elseif ($payment->status === 'rejected') {
                $notifications[] = [
                    'id' => 'payment-' . $payment->id,
                    'type' => 'danger',
                    'icon' => 'solar:close-circle-bold',
                    'color' => '#EF4444',
                    'bg' => 'rgba(239,68,68,0.1)',
                    'title' => 'Payment Rejected',
                    'message' => 'Your payment proof could not be verified. Please review and re-upload.',
                    'url' => '/payment',
                    'time' => $payment->updated_at?->diffForHumans() ?? 'Recently',
                ];
            } elseif ($payment->status === 'pending') {
                $notifications[] = [
                    'id' => 'payment-' . $payment->id,
                    'type' => 'info',
                    'icon' => 'solar:clock-circle-bold',
                    'color' => '#0152EA',
                    'bg' => 'rgba(1,82,234,0.1)',
                    'title' => 'Payment Under Review',
                    'message' => 'Your payment proof is currently being reviewed by admin.',
                    'url' => '/payment',
                    'time' => $payment->created_at?->diffForHumans() ?? 'Recently',
                ];
            }
        }

        // 2. Abstract & Full Paper notifications for presenters
        $abstracts = $user->abstracts()->with('fullPaper')->latest()->get();
        foreach ($abstracts as $abstract) {
            // Abstract Status
            if ($abstract->status === 'accepted') {
                $notifications[] = [
                    'id' => 'abstract-' . $abstract->id,
                    'type' => 'success',
                    'icon' => 'solar:document-text-bold',
                    'color' => '#10B981',
                    'bg' => 'rgba(16,185,129,0.1)',
                    'title' => 'Abstract Accepted',
                    'message' => "Abstract '" . Str::limit($abstract->title, 40) . "' has been accepted.",
                    'url' => '/abstracts',
                    'time' => $abstract->updated_at?->diffForHumans() ?? 'Recently',
                ];

                // Reminder if abstract is accepted but payment is not verified/uploaded
                if (!$payment || $payment->status !== 'verified') {
                    $notifications[] = [
                        'id' => 'payment-required-' . $abstract->id,
                        'type' => 'warning',
                        'icon' => 'solar:wallet-bold',
                        'color' => '#F59E0B',
                        'bg' => 'rgba(245,158,11,0.1)',
                        'title' => 'Payment Required',
                        'message' => 'Your abstract is accepted. Please complete the registration payment.',
                        'url' => '/payment',
                        'time' => $abstract->updated_at?->diffForHumans() ?? 'Recently',
                    ];
                }
            } elseif ($abstract->status === 'revision') {
                $notifications[] = [
                    'id' => 'abstract-' . $abstract->id,
                    'type' => 'warning',
                    'icon' => 'solar:pen-new-square-bold',
                    'color' => '#F59E0B',
                    'bg' => 'rgba(245,158,11,0.1)',
                    'title' => 'Abstract Revision Required',
                    'message' => "Revision requested for abstract '" . Str::limit($abstract->title, 40) . "'.",
                    'url' => '/abstracts',
                    'time' => $abstract->updated_at?->diffForHumans() ?? 'Recently',
                ];
            } elseif ($abstract->status === 'rejected') {
                $notifications[] = [
                    'id' => 'abstract-' . $abstract->id,
                    'type' => 'danger',
                    'icon' => 'solar:close-circle-bold',
                    'color' => '#EF4444',
                    'bg' => 'rgba(239,68,68,0.1)',
                    'title' => 'Abstract Rejected',
                    'message' => "Abstract '" . Str::limit($abstract->title, 40) . "' was not accepted.",
                    'url' => '/abstracts',
                    'time' => $abstract->updated_at?->diffForHumans() ?? 'Recently',
                ];
            }

            // Full Paper Status
            if ($abstract->fullPaper) {
                $fp = $abstract->fullPaper;
                if ($fp->status === 'accepted') {
                    $notifications[] = [
                        'id' => 'fullpaper-' . $fp->id,
                        'type' => 'success',
                        'icon' => 'solar:file-check-bold',
                        'color' => '#10B981',
                        'bg' => 'rgba(16,185,129,0.1)',
                        'title' => 'Full Paper Accepted',
                        'message' => "Full paper for '" . Str::limit($abstract->title, 40) . "' has been accepted.",
                        'url' => '/abstracts',
                        'time' => $fp->updated_at?->diffForHumans() ?? 'Recently',
                    ];
                } elseif ($fp->status === 'revision') {
                    $notifications[] = [
                        'id' => 'fullpaper-' . $fp->id,
                        'type' => 'warning',
                        'icon' => 'solar:pen-new-square-bold',
                        'color' => '#F59E0B',
                        'bg' => 'rgba(245,158,11,0.1)',
                        'title' => 'Full Paper Revision Required',
                        'message' => "Revision requested for full paper of '" . Str::limit($abstract->title, 40) . "'.",
                        'url' => '/abstracts',
                        'time' => $fp->updated_at?->diffForHumans() ?? 'Recently',
                    ];
                } elseif ($fp->status === 'rejected') {
                    $notifications[] = [
                        'id' => 'fullpaper-' . $fp->id,
                        'type' => 'danger',
                        'icon' => 'solar:close-circle-bold',
                        'color' => '#EF4444',
                        'bg' => 'rgba(239,68,68,0.1)',
                        'title' => 'Full Paper Rejected',
                        'message' => "Full paper for '" . Str::limit($abstract->title, 40) . "' was not accepted.",
                        'url' => '/abstracts',
                        'time' => $fp->updated_at?->diffForHumans() ?? 'Recently',
                    ];
                }
            }
        }

        return $notifications;
    }
}
