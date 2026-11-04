<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\BroadcastInvitationMail;
use App\Models\AbstractModel;
use App\Models\ConferenceSetting;
use App\Models\InvitationBroadcastLog;
use App\Models\InvitationRundownItem;
use App\Models\InvitationTemplate;
use App\Models\Upload;
use App\Models\User;
use App\Models\Year;
use App\Traits\FlashAlert;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BroadcastInvitationController extends Controller
{
    use FlashAlert;

    private const PRESENTER_ROLES = ['indonesia-presenter', 'foreign-presenter'];
    private const PARTICIPANT_ROLES = ['indonesia-participants', 'foreign-participants'];

    public function index(Request $request)
    {
        $template = InvitationTemplate::firstOrCreate([], $this->defaultTemplateAttributes());

        if (InvitationRundownItem::count() === 0) {
            $this->seedDefaultRundown();
        }

        $rundownItems = InvitationRundownItem::ordered()->get();

        $search = $request->query('search');
        $status = $request->query('status');
        $role = $request->query('role');
        $isTest = $request->query('is_test');

        $historyQuery = InvitationBroadcastLog::query()
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

        return Inertia::render('Admin/Broadcast/Invitation/Index', [
            'template' => $template,
            'rundownItems' => $rundownItems,
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

    public function updateEmailTemplate(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'zoom_url' => 'nullable|string|max:255',
            'zoom_id' => 'nullable|string|max:255',
            'zoom_pass' => 'nullable|string|max:255',
            'venue' => 'nullable|string|max:255',
        ]);

        $template = InvitationTemplate::firstOrCreate([], $this->defaultTemplateAttributes());
        $template->update($validated);

        return back()->with($this->alertUpdated());
    }

    public function updatePdfTemplate(Request $request)
    {
        $validated = $request->validate([
            'letter_date' => 'required|date',
            'pdf_theme_paragraph' => 'required|string',
            'rundown_edition' => 'required|string|max:50',
            'organizer' => 'required|string|max:255',
            'event_date_label' => 'required|string|max:255',
        ]);

        $template = InvitationTemplate::firstOrCreate([], $this->defaultTemplateAttributes());
        $template->update($validated);

        return back()->with($this->alertUpdated());
    }

    public function storeRundownItem(Request $request)
    {
        $validated = $this->validateRundownItem($request);

        $maxOrder = (int) (InvitationRundownItem::max('sort_order') ?? 0);

        InvitationRundownItem::create(array_merge($validated, [
            'sort_order' => $maxOrder + 1,
        ]));

        return back()->with($this->alertCreated());
    }

    public function updateRundownItem(Request $request, InvitationRundownItem $item)
    {
        $item->update($this->validateRundownItem($request));

        return back()->with($this->alertUpdated());
    }

    public function destroyRundownItem(InvitationRundownItem $item)
    {
        $item->delete();

        return back()->with($this->alertDeleted());
    }

    public function reorderRundown(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:invitation_rundown_items,id',
        ]);

        foreach ($validated['ids'] as $index => $id) {
            InvitationRundownItem::where('id', $id)->update(['sort_order' => $index]);
        }

        return back()->with($this->alertUpdated());
    }

    public function previewBody(Request $request)
    {
        return response(view('emails.broadcast.invitation', $this->buildPreviewData($request))->render());
    }

    public function previewPdf(Request $request)
    {
        @ini_set('memory_limit', '512M');
        $pdf = Pdf::loadView('emails.broadcast.invitation-pdf', $this->buildPreviewData($request));
        $pdf->getDomPDF()->set_option('dpi', 96);
        $pdf->getDomPDF()->set_option('isPhpEnabled', false);

        return response($pdf->output(), 200, ['Content-Type' => 'application/pdf']);
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
        ini_set('memory_limit', '512M');

        $template = InvitationTemplate::firstOrCreate([], $this->defaultTemplateAttributes());
        $rundownItems = InvitationRundownItem::ordered()->get();
        $activeYear = Year::activeYear();

        $sent = 0;
        $failed = 0;

        foreach ($targeted as $entry) {
            $user = $entry['user'];
            $role = $entry['role'];
            $abstract = $this->resolveAbstractForRole($user, $role, $activeYear);

            if ($this->sendOne($user, $user->email, $role, $abstract, $template, $rundownItems, false)) {
                $sent++;
            } else {
                $failed++;
            }
        }

        return back()->with([
            'type' => $failed > 0 ? 'warning' : 'success',
            'message' => "Broadcast selesai: {$sent} terkirim, {$failed} gagal.",
        ]);
    }

    public function resend(InvitationBroadcastLog $log)
    {
        $user = $log->user ?? User::where('email', $log->email)->first();

        if (!$user) {
            return back()->with($this->alertNotFound());
        }

        $activeYear = Year::activeYear();
        $abstract = $log->abstract_id
            ? AbstractModel::find($log->abstract_id)
            : $this->resolveAbstractForRole($user, $log->role, $activeYear);

        $template = InvitationTemplate::firstOrCreate([], $this->defaultTemplateAttributes());
        $rundownItems = InvitationRundownItem::ordered()->get();

        $this->sendOne($user, $log->email, $log->role, $abstract, $template, $rundownItems, (bool) $log->is_test, $log);

        return back()->with($this->alertUpdated());
    }

    public function destroyHistoryItem(InvitationBroadcastLog $log)
    {
        $log->delete();

        return back()->with($this->alertDeleted());
    }

    public function clearHistory()
    {
        InvitationBroadcastLog::query()->delete();

        return back()->with($this->alertDeleted());
    }

    public function testSend(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:presenter,participant',
        ]);

        $isPresenter = $validated['role'] === 'presenter';
        $activeYear = Year::activeYear();
        $role = $isPresenter ? 'indonesia-presenter' : 'indonesia-participants';

        $user = User::findOrFail($validated['user_id']);
        $email = $user->email;
        $abstract = $this->resolveAbstractForRole($user, $role, $activeYear);

        $template = InvitationTemplate::firstOrCreate([], $this->defaultTemplateAttributes());
        $rundownItems = InvitationRundownItem::ordered()->get();

        $ok = $this->sendOne($user, $email, $role, $abstract, $template, $rundownItems, true);

        return back()->with($ok
            ? ['type' => 'success', 'message' => "Test email berhasil dikirim ke {$email}."]
            : ['type' => 'error', 'message' => "Gagal mengirim test email ke {$email}."]);
    }

    public function testUserOptions()
    {
        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', array_merge(self::PRESENTER_ROLES, self::PARTICIPANT_ROLES));
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

    /**
     * Kirim 1 email (real send / resend / test-send pakai jalur yang sama)
     * lalu catat hasilnya ke invitation_broadcast_logs. $existingLog dipakai
     * saat resend supaya row lama di-update, bukan bikin row baru.
     */
    private function sendOne($user, string $email, ?string $role, $abstract, InvitationTemplate $template, $rundownItems, bool $isTest, ?InvitationBroadcastLog $existingLog = null): bool
    {
        $name = $user->name ?? $email;
        $userId = $user->id ?? null;
        $abstractId = $abstract->id ?? null;

        try {
            Mail::to($email)->send(new BroadcastInvitationMail($user, $abstract, $template, $rundownItems));

            $attributes = [
                'user_id' => $userId,
                'email' => $email,
                'name' => $name,
                'role' => $role,
                'abstract_id' => $abstractId,
                'status' => 'sent',
                'error_message' => null,
                'is_test' => $isTest,
                'sent_at' => now(),
            ];

            $existingLog ? $existingLog->update($attributes) : InvitationBroadcastLog::create($attributes);

            return true;
        } catch (\Throwable $e) {
            Log::error("[BroadcastInvitation] Gagal kirim email ke {$email}: " . $e->getMessage(), [
                'exception' => $e,
                'email' => $email,
                'user_id' => $userId,
            ]);

            $attributes = [
                'user_id' => $userId,
                'email' => $email,
                'name' => $name,
                'role' => $role,
                'abstract_id' => $abstractId,
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'is_test' => $isTest,
            ];

            $existingLog ? $existingLog->update($attributes) : InvitationBroadcastLog::create($attributes);

            return false;
        }
    }

    /**
     * Abstract accepted milik user untuk role presenter, dikunci ke tahun
     * aktif — abstracts tidak punya kolom year sendiri, jadi satu-satunya
     * cara aman adalah whereYear(created_at). Participant tidak butuh abstract.
     */
    private function resolveAbstractForRole($user, ?string $role, ?int $activeYear)
    {
        if (!in_array($role, self::PRESENTER_ROLES, true) || !method_exists($user, 'abstracts')) {
            return null;
        }

        return $user->abstracts()
            ->where('status', 'accepted')
            ->when($activeYear, fn ($q) => $q->whereYear('created_at', $activeYear))
            ->latest()
            ->first();
    }

    /**
     * Query penerima broadcast: tiap role (presenter/participant, indo/foreign)
     * bisa di-include/exclude dan punya filter status pembayaran sendiri-sendiri.
     * Presenter WAJIB abstract accepted di tahun aktif; participant tidak perlu.
     * Payment status selalu lewat $user->filePayment (singular, sudah
     * forYear(activeYear) di User.php) — bukan filePayments (semua tahun).
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

    private function validateRundownItem(Request $request): array
    {
        $validated = $request->validate([
            'time_label' => 'required|string|max:255',
            'program' => 'required|string',
            'pic' => 'nullable|string',
            'is_section_header' => 'boolean',
        ]);

        $validated['pic'] = $validated['pic'] ?? '';
        $validated['is_section_header'] = $validated['is_section_header'] ?? false;

        return $validated;
    }

    private function buildPreviewData(Request $request): array
    {
        $validated = $request->validate([
            'subject' => 'nullable|string|max:255',
            'zoom_url' => 'nullable|string|max:255',
            'zoom_id' => 'nullable|string|max:255',
            'zoom_pass' => 'nullable|string|max:255',
            'venue' => 'nullable|string|max:255',
            'letter_date' => 'nullable|date',
            'pdf_theme_paragraph' => 'nullable|string',
            'rundown_edition' => 'nullable|string|max:50',
            'organizer' => 'nullable|string|max:255',
            'event_date_label' => 'nullable|string|max:255',
            'role' => 'required|in:presenter,participant',
            'rundown' => 'nullable|array',
            'rundown.*.time_label' => 'nullable|string',
            'rundown.*.program' => 'nullable|string',
            'rundown.*.pic' => 'nullable|string',
            'rundown.*.is_section_header' => 'boolean',
        ]);

        $isPresenter = $validated['role'] === 'presenter';
        $template = InvitationTemplate::firstOrCreate([], $this->defaultTemplateAttributes());
        $activeYear = Year::activeYear();
        $conference = ConferenceSetting::first();

        $rundownItems = collect($validated['rundown'] ?? [])->map(fn ($row) => (object) [
            'time_label' => $row['time_label'] ?? '',
            'program' => $row['program'] ?? '',
            'pic' => $row['pic'] ?? '',
            'is_section_header' => $row['is_section_header'] ?? false,
        ]);

        $letterHeader = Upload::getBase64Image('letter_header', 800);
        $signaturePath = Upload::getBase64Image('signature', 300);

        $letterDate = $validated['letter_date'] ?? $template->letter_date;

        return [
            'user' => (object) ['name' => 'John Doe (Preview)', 'institution' => 'Universitas Contoh'],
            'abstract' => $isPresenter ? (object) ['title' => 'Sample Accepted Abstract Title'] : null,
            'conference' => $conference,
            'activeYear' => $activeYear,
            'conferenceFullName' => $this->conferenceFullName($conference, $activeYear),
            'zoomLink' => [
                'url' => $validated['zoom_url'] ?? '',
                'id' => $validated['zoom_id'] ?? '',
                'pass' => $validated['zoom_pass'] ?? '',
            ],
            'venue' => $validated['venue'] ?? '',
            'letterDate' => $letterDate ? \Carbon\Carbon::parse($letterDate)->format('d F Y') : now()->format('d F Y'),
            'pdfThemeParagraph' => $validated['pdf_theme_paragraph'] ?? '',
            'rundownEdition' => $validated['rundown_edition'] ?? $template->rundown_edition,
            'organizer' => $validated['organizer'] ?? $template->organizer,
            'eventDateLabel' => $validated['event_date_label'] ?? $template->event_date_label,
            'signaturePath' => $signaturePath,
            'letterHeader' => $letterHeader,
            'rundownItems' => $rundownItems,
            'roleNames' => $isPresenter ? ['indonesia-presenter'] : ['indonesia-participants'],
            'subject' => $validated['subject'] ?? $template->subject,
        ];
    }

    private function conferenceFullName(?ConferenceSetting $conference, ?int $activeYear): string
    {
        if (!$conference) {
            return '';
        }

        return trim("{$conference->conference_title} ({$conference->conference_abbreviation}) {$activeYear}");
    }

    private function defaultTemplateAttributes(): array
    {
        return [
            'subject' => 'Invitation as Academic Session Speaker at ICASVE 2025',
            'zoom_url' => 'https://univ-brawijaya.zoom.us/j/91906144067?pwd=9P6mENqBAKABq495fsw5LRaOCv3RgV.1',
            'zoom_id' => '919 0614 4067',
            'zoom_pass' => '834404',
            'venue' => 'Widyaloka Hall, Universitas Brawijaya, Malang, East Java, Indonesia',
            'letter_date' => now()->format('Y-m-d'),
            'pdf_theme_paragraph' => 'With the theme "Entrepreneurship, Creativity, and AI-driven Innovation in the Digital Era," ICASVE explores innovative strategies that bridge the gap between technology and human interaction, creating opportunities that not only advance industries but also enrich the lives of communities worldwide. Through AI and creativity, ICASVE is dedicated to advancing entrepreneurship for a more sustainable and equitable future. It also aims to foster collaboration among academia, industry professionals, and policymakers to integrate AI technologies seamlessly into the evolving world of business, hospitality, IT, and design, empowering individuals and organizations to thrive in the digital era. ICASVE details are as follows:',
            'rundown_edition' => '4th',
            'organizer' => 'Faculty of Vocational Studies, Universitas Brawijaya',
            'event_date_label' => 'August 1st – 2nd, ' . (\App\Models\Year::activeYear() ?? now()->year),
        ];
    }

    /**
     * Seed sekali dari isi tabel rundown statis yang lama (invitation-pdf.blade.php)
     * supaya isinya sama persis begitu fitur ini pertama kali dipakai.
     */
    private function seedDefaultRundown(): void
    {
        $rows = [
            ['06.30 - 07.30', 'Preparation', 'Committee'],
            ['07.30 - 08.00', 'Registration', 'Committee'],
            ['08.00 - 08.05', 'Opening by MC', 'Dr. Dini Kurnia Irmawati, M.Pd'],
            ['08.05 - 08.10', 'Traditional Dance', 'MC'],
            ['08.10 - 08.15', 'Lagu Indonesia Raya', 'MC'],
            ['08.15 - 08.20', 'Doa', 'Dr. Sugeng'],
            ['08.20 - 08.25', 'Welcoming Speech from Chairman of ICASVE 2025', 'Sovia Rosalin, SAP, MAB'],
            ['08.25 - 08.30', "Welcoming Speech from Dean of Faculty of Vocational Studies Universitas Brawijaya", 'Mukhammad Kholid Mawardi, S.Sos., M.A.B., Ph.D.'],
            ['08.30 - 08.35', 'Welcoming Speech from Rector of Universitas Brawijaya', 'Prof. Widodo, S.Si., M.Si., Ph.D.Med.Sc'],
            ['08.35 - 08.45', 'Opening Session & Photo Session', 'Dr. Dini Kurnia Irmawati, M.Pd'],
            ['08.45 – 09.00', 'Coffee Break', 'Committee'],
            ['09.00 – 09.30', "Invited Speaker 1:\nProf. Dr.-Ing. Hendro Wicaksono, M.Sc. Constructor University, Jerman", 'Moderator: Rachmad Andri Atmoko, S.ST, M.T, MCF'],
            ['09.30 - 09.40', 'Question and Answer', 'Moderator: Rachmad Andri Atmoko, S.ST, M.T, MCF'],
            ['09.40 – 10.10', "Invited Speaker 2:\nTAN Kim Lim, PhD, MBA, James Cook University", 'Moderator: Dr. Karisma Sri Rahayu, S.S.T., MAB.'],
            ['10.10 – 10.20', 'Question and Answer', 'Moderator: Dr. Karisma Sri Rahayu, S.S.T., MAB.'],
            ['10.20- 11.00', "Invited Speaker 3:\nLi-Hsin Chen, Ph.D., Taiwan", 'Moderator: Andira Dwi Wiranugraha,SM.,MBA'],
            ['11.00 - 11.15', 'Question and Answer', 'Moderator: Andira Dwi Wiranugraha,SM.,MBA'],
            ['11.15 - 13.00', 'Lunch and praying', 'Committee'],
            ['13.00- 13.30', "Keynote Speaker :\nDr. Beny Bandanadjaja, ST., MT\nDirektur Pembelajaran dan Kemahasiswaan Kemdiktisaintek", 'Moderator: Dr. A. Faidlal Rahman, M.Sc.'],
            ['13.30 - 13.45', 'Question and Answer', 'Moderator: Dr. A. Faidlal Rahman, M.Sc.'],
        ];

        $order = 0;
        foreach ($rows as [$time, $program, $pic]) {
            InvitationRundownItem::create([
                'time_label' => $time,
                'program' => $program,
                'pic' => $pic,
                'is_section_header' => false,
                'sort_order' => $order++,
            ]);
        }

        InvitationRundownItem::create([
            'time_label' => '',
            'program' => 'Parallel Session',
            'pic' => '',
            'is_section_header' => true,
            'sort_order' => $order++,
        ]);

        $parallelRooms = [
            ['Room 1', 'Parallel Presentation (Onsite)', 'Moderator: Eka Ratri Noor W, S.Si, M.Si, M.Sc, MCF'],
            ['Room 2', 'Parallel Presentation (Onsite)', 'Moderator: Fitriana Dhanias, S.E.,MSA.,Ak.,CFP'],
            ['Room 3', 'Parallel Presentation (Onsite)', 'Moderator: Erlangga Setyawan, SP., MM., CODP'],
            ['Room 4', 'Parallel Presentation (Onsite)', 'Moderator: Dimas Fakhruddin, S.ST., M.Ds.'],
            ['Room 5', 'Parallel Presentation (Online)', 'Moderator: Hapsari Dian Sylvatri, S.S.,M.I.Kom'],
        ];

        foreach ($parallelRooms as [$room, $program, $pic]) {
            InvitationRundownItem::create([
                'time_label' => "{$room}\n14.00 - 16.30",
                'program' => $program,
                'pic' => $pic,
                'is_section_header' => false,
                'sort_order' => $order++,
            ]);
        }

        $closingRows = [
            ['16.30-16.45', 'Awarding of Best Presenter', 'MC'],
            ['16.45-17.00', 'Closing by MC', 'MC'],
        ];

        foreach ($closingRows as [$time, $program, $pic]) {
            InvitationRundownItem::create([
                'time_label' => $time,
                'program' => $program,
                'pic' => $pic,
                'is_section_header' => false,
                'sort_order' => $order++,
            ]);
        }
    }
}
