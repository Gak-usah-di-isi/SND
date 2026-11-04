<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\BroadcastReminderMail;
use App\Models\ConferenceSetting;
use App\Models\ReminderBroadcastLog;
use App\Models\ReminderTemplate;
use App\Models\User;
use App\Models\Year;
use App\Traits\FlashAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BroadcastReminderController extends Controller
{
    use FlashAlert;

    private const TARGET_ROLES = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];
    private const PRESENTER_ROLES = ['indonesia-presenter', 'foreign-presenter'];

    public function index(Request $request)
    {
        $template = ReminderTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

        $search = $request->query('search');
        $status = $request->query('status');
        $role = $request->query('role');
        $isTest = $request->query('is_test');

        $historyQuery = ReminderBroadcastLog::query()
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")->orWhere('email', 'LIKE', "%{$search}%");
            }))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($role, fn ($q) => $q->where('role', $role))
            ->when($isTest !== null && $isTest !== '', fn ($q) => $q->where('is_test', filter_var($isTest, FILTER_VALIDATE_BOOLEAN)))
            ->latest();

        $historyStats = [
            'total' => (clone $historyQuery)->count(),
            'sent' => (clone $historyQuery)->where('status', 'sent')->count(),
            'failed' => (clone $historyQuery)->where('status', 'failed')->count(),
        ];

        $history = $historyQuery
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();

        return Inertia::render('Admin/Broadcast/Reminder/Index', [
            'template' => $template,
            'history' => $history,
            'historyStats' => $historyStats,
            'historyFilters' => compact('search', 'status', 'role', 'isTest'),
            'roleOptions' => [
                'indonesia-presenter' => 'Indonesia - Presenter',
                'foreign-presenter' => 'Foreign - Presenter',
                'indonesia-participants' => 'Indonesia - Participant',
                'foreign-participants' => 'Foreign - Participant',
            ],
        ]);
    }

    public function updateTemplate(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'payment_deadline' => 'required|date',
        ]);

        $template = ReminderTemplate::firstOrCreate([], $this->defaultTemplateAttributes());
        $template->update($validated);

        return back()->with($this->alertUpdated());
    }

    public function previewBody(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'nullable|string|max:255',
            'payment_deadline' => 'nullable|date',
        ]);

        $template = ReminderTemplate::firstOrCreate([], $this->defaultTemplateAttributes());
        $deadline = $validated['payment_deadline'] ?? $template->payment_deadline;

        $html = view('emails.broadcast.reminder', [
            'user' => (object) ['name' => 'John Doe (Preview)'],
            'conference' => ConferenceSetting::first(),
            'deadlineLabel' => $deadline ? \Carbon\Carbon::parse($deadline)->format('F j, Y') : '-',
            'paymentUrl' => route('filepayments.create'),
        ])->render();

        return response($html);
    }

    public function recipientCount(Request $request)
    {
        $validated = $this->validateRoleFilters($request);
        $targeted = $this->resolveTargetedUsers($validated['roles']);

        $perRole = collect($validated['roles'])->keys()->mapWithKeys(
            fn ($role) => [$role => $targeted->where('role', $role)->count()]
        );

        return response()->json([
            'total' => $targeted->count(),
            'perRole' => $perRole,
        ]);
    }

    public function send(Request $request)
    {
        $validated = $this->validateRoleFilters($request);
        $targeted = $this->resolveTargetedUsers($validated['roles']);

        set_time_limit(300);

        $template = ReminderTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

        $sent = 0;
        $failed = 0;

        foreach ($targeted as $entry) {
            if ($this->sendOne($entry['user'], $entry['user']->email, $entry['role'], $template, false)) {
                $sent++;
            } else {
                $failed++;
            }
        }

        return back()->with([
            'type' => $failed > 0 ? 'warning' : 'success',
            'message' => "Broadcast reminder selesai: {$sent} terkirim, {$failed} gagal.",
        ]);
    }

    public function resend(ReminderBroadcastLog $log)
    {
        $user = $log->user ?? User::where('email', $log->email)->first();

        if (!$user) {
            return back()->with($this->alertNotFound());
        }

        $template = ReminderTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

        $this->sendOne($user, $log->email, $log->role, $template, (bool) $log->is_test, $log);

        return back()->with($this->alertUpdated());
    }

    public function destroyHistoryItem(ReminderBroadcastLog $log)
    {
        $log->delete();

        return back()->with($this->alertDeleted());
    }

    public function clearHistory()
    {
        ReminderBroadcastLog::query()->delete();

        return back()->with($this->alertDeleted());
    }

    public function testSend(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::with('roles')->findOrFail($validated['user_id']);
        $role = $user->roles->first()->name ?? null;

        $template = ReminderTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

        $ok = $this->sendOne($user, $user->email, $role, $template, true);

        return back()->with($ok
            ? ['type' => 'success', 'message' => "Test email berhasil dikirim ke {$user->email}."]
            : ['type' => 'error', 'message' => "Gagal mengirim test email ke {$user->email}."]);
    }

    public function testUserOptions()
    {
        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', self::TARGET_ROLES);
        })
            ->with('roles:name')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return response()->json($users->map(fn ($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->roles->first()->name ?? null,
        ]));
    }

    private function sendOne($user, string $email, ?string $role, ReminderTemplate $template, bool $isTest, ?ReminderBroadcastLog $existingLog = null): bool
    {
        $name = $user->name ?? $email;
        $userId = $user->id ?? null;

        try {
            Mail::to($email)->send(new BroadcastReminderMail($user, $template));

            $attributes = [
                'user_id' => $userId,
                'email' => $email,
                'name' => $name,
                'role' => $role,
                'status' => 'sent',
                'error_message' => null,
                'is_test' => $isTest,
                'sent_at' => now(),
            ];

            $existingLog ? $existingLog->update($attributes) : ReminderBroadcastLog::create($attributes);

            return true;
        } catch (\Throwable $e) {
            Log::error("[BroadcastReminder] Gagal kirim email ke {$email}: " . $e->getMessage(), [
                'exception' => $e,
                'email' => $email,
                'user_id' => $userId,
            ]);

            $attributes = [
                'user_id' => $userId,
                'email' => $email,
                'name' => $name,
                'role' => $role,
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'is_test' => $isTest,
            ];

            $existingLog ? $existingLog->update($attributes) : ReminderBroadcastLog::create($attributes);

            return false;
        }
    }

    /**
     * Target reminder: role yang di-include, DAN belum punya pembayaran
     * verified di tahun aktif (filePayment relation di User.php sudah
     * forYear(activeYear)). Beda dari Send Invitation, di sini sengaja
     * TIDAK ada pilihan status pembayaran — reminder ini emang buat yang
     * belum bayar/masih pending.
     *
     * Role sendiri TIDAK terikat tahun (sekali jadi presenter/participant,
     * nempel selamanya di user) — jadi tanpa syarat tambahan, query ini
     * ikut narget sisa akun tahun-tahun lalu yang udah gak relevan sama
     * tahun aktif. Presenter dikunci ke abstract accepted tahun aktif
     * (sama kayak Send Invitation — itu juga saat invoice-nya dikirim).
     * Participant gak punya abstract, jadi dikunci ke created_at tahun
     * aktif sebagai proxy terbaik yang ada di skema saat ini.
     */
    private function resolveTargetedUsers(array $roleFilters): \Illuminate\Support\Collection
    {
        $activeYear = Year::activeYear();
        $result = collect();

        foreach ($roleFilters as $role => $filter) {
            if (empty($filter['included'])) {
                continue;
            }

            $query = User::whereHas('roles', fn ($q) => $q->where('name', $role))
                ->whereDoesntHave('filePayment', fn ($q) => $q->where('status', 'verified'));

            if (in_array($role, self::PRESENTER_ROLES, true)) {
                $query->whereHas('abstracts', function ($q) use ($activeYear) {
                    $q->where('status', 'accepted');
                    if ($activeYear) {
                        $q->whereYear('created_at', $activeYear);
                    }
                });
            } elseif ($activeYear) {
                $query->whereYear('created_at', $activeYear);
            }

            foreach ($query->get() as $user) {
                if (!$result->contains('user.id', $user->id)) {
                    $result->push(['user' => $user, 'role' => $role]);
                }
            }
        }

        return $result;
    }

    private function validateRoleFilters(Request $request): array
    {
        return $request->validate([
            'roles' => 'required|array',
            'roles.*.included' => 'boolean',
        ]);
    }

    private function defaultTemplateAttributes(): array
    {
        return [
            'subject' => 'Payment Reminder',
            'payment_deadline' => now()->addDays(14)->format('Y-m-d'),
        ];
    }
}
