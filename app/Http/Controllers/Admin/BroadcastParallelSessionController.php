<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\BroadcastParallelSessionMail;
use App\Models\ConferenceSetting;
use App\Models\ParallelSessionBroadcastLog;
use App\Models\ParallelSessionTemplate;
use App\Models\User;
use App\Models\Year;
use App\Traits\FlashAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BroadcastParallelSessionController extends Controller
{
    use FlashAlert;

    private const PRESENTER_ROLES = ['indonesia-presenter', 'foreign-presenter'];

    public function index(Request $request)
    {
        $template = ParallelSessionTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

        $search = $request->query('search');
        $status = $request->query('status');
        $role = $request->query('role');
        $isTest = $request->query('is_test');

        $historyQuery = ParallelSessionBroadcastLog::query()
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

        return Inertia::render('Admin/Broadcast/ParallelSession/Index', [
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
            'important_notes' => 'nullable|string',
            'online_guidelines' => 'nullable|string',
            'submission_form_url' => 'nullable|string|max:255',
        ]);

        $template = ParallelSessionTemplate::firstOrCreate([], $this->defaultTemplateAttributes());
        $template->update($validated);

        return back()->with($this->alertUpdated());
    }

    public function previewBody(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'nullable|string|max:255',
            'important_notes' => 'nullable|string',
            'online_guidelines' => 'nullable|string',
            'submission_form_url' => 'nullable|string|max:255',
        ]);

        $template = ParallelSessionTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

        $html = view('emails.broadcast.parallel-session', [
            'user' => (object) ['name' => 'John Doe (Preview)'],
            'conference' => ConferenceSetting::first(),
            'subject' => $validated['subject'] ?? $template->subject,
            'importantNotes' => $this->notesToLines($validated['important_notes'] ?? $template->important_notes),
            'onlineGuidelines' => $this->notesToLines($validated['online_guidelines'] ?? $template->online_guidelines),
            'submissionFormUrl' => $validated['submission_form_url'] ?? $template->submission_form_url,
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

        $template = ParallelSessionTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

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
            'message' => "Broadcast parallel session selesai: {$sent} terkirim, {$failed} gagal.",
        ]);
    }

    public function resend(ParallelSessionBroadcastLog $log)
    {
        $user = $log->user ?? User::where('email', $log->email)->first();

        if (!$user) {
            return back()->with($this->alertNotFound());
        }

        $template = ParallelSessionTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

        $this->sendOne($user, $log->email, $log->role, $template, (bool) $log->is_test, $log);

        return back()->with($this->alertUpdated());
    }

    public function destroyHistoryItem(ParallelSessionBroadcastLog $log)
    {
        $log->delete();

        return back()->with($this->alertDeleted());
    }

    public function clearHistory()
    {
        ParallelSessionBroadcastLog::query()->delete();

        return back()->with($this->alertDeleted());
    }

    public function testSend(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::with('roles')->findOrFail($validated['user_id']);
        $role = $user->roles->first()->name ?? null;

        $template = ParallelSessionTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

        $ok = $this->sendOne($user, $user->email, $role, $template, true);

        return back()->with($ok
            ? ['type' => 'success', 'message' => "Test email berhasil dikirim ke {$user->email}."]
            : ['type' => 'error', 'message' => "Gagal mengirim test email ke {$user->email}."]);
    }

    public function testUserOptions()
    {
        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', array_merge(self::PRESENTER_ROLES, ['indonesia-participants', 'foreign-participants']));
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

    private function sendOne($user, string $email, ?string $role, ParallelSessionTemplate $template, bool $isTest, ?ParallelSessionBroadcastLog $existingLog = null): bool
    {
        $name = $user->name ?? $email;
        $userId = $user->id ?? null;

        try {
            Mail::to($email)->send(new BroadcastParallelSessionMail($user, $template));

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

            $existingLog ? $existingLog->update($attributes) : ParallelSessionBroadcastLog::create($attributes);

            return true;
        } catch (\Throwable $e) {
            Log::error("[BroadcastParallelSession] Gagal kirim email ke {$email}: " . $e->getMessage(), [
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

            $existingLog ? $existingLog->update($attributes) : ParallelSessionBroadcastLog::create($attributes);

            return false;
        }
    }

    /**
     * Target broadcast: role di-include + filter status pembayaran per role
     * (verified/pending/dua-duanya) — persis pola Send Invitation. Presenter
     * wajib abstract accepted di tahun aktif, participant tidak perlu.
     */
    private function resolveTargetedUsers(array $roleFilters): \Illuminate\Support\Collection
    {
        $activeYear = Year::activeYear();
        $result = collect();

        foreach ($roleFilters as $role => $filter) {
            if (empty($filter['included'])) {
                continue;
            }

            $statuses = array_values(array_intersect($filter['payment_status'] ?? [], ['verified', 'pending']));
            if (empty($statuses)) {
                continue;
            }

            $query = User::whereHas('roles', fn ($q) => $q->where('name', $role))
                ->whereHas('filePayment', fn ($q) => $q->whereIn('status', $statuses));

            if (in_array($role, self::PRESENTER_ROLES, true)) {
                $query->whereHas('abstracts', function ($q) use ($activeYear) {
                    $q->where('status', 'accepted');
                    if ($activeYear) {
                        $q->whereYear('created_at', $activeYear);
                    }
                });
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
            'roles.*.payment_status' => 'array',
            'roles.*.payment_status.*' => 'in:verified,pending',
        ]);
    }

    private function notesToLines(?string $text): array
    {
        if (!$text) {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode("\n", $text)), fn ($line) => $line !== ''));
    }

    private function defaultTemplateAttributes(): array
    {
        return [
            'subject' => 'Your Presentation Schedule – The 4th ICASVE 2025 (Parallel Presentation Sessions)',
            'important_notes' => "All presenters, both on-site and online, are required to attend the entire conference, from the Opening Session to the Closing Ceremony.\nPlease be present at least 15 minutes prior to your scheduled presentation for registration and technical preparation.\nEach presenter is allocated 7 minutes for presentation followed by 3 minutes for a Q&A session.\nBest Presenter Awards will be announced at the end of the conference.",
            'online_guidelines' => "Rename your Zoom display name using the format: Room_n_YourFullName (e.g., Room_1_JohnDoe).\nUse the official ICASVE Zoom background, which is attached to this email.",
            'submission_form_url' => 'https://s.ub.ac.id/presentationfileicasve2025',
        ];
    }
}
