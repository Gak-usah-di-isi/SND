<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FilePayment;
use App\Models\User;
use App\Models\Role;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Upload;
use App\Models\Year;
use App\Models\ConferenceSetting;
use App\Mail\PaymentVerified;
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentReminderMail;
use App\Traits\FlashAlert;
use App\Jobs\SendPaymentReminderEmail;
use App\Jobs\SendPaymentReminderEmailForeign;
use Illuminate\Support\Facades\Bus;

class VerifyPaymentController extends Controller
{
    use FlashAlert;

    public function index(Request $request)
    {
        $activeYear = Year::where('is_active', true)->first();

        $search = $request->query('search');
        $status = $request->query('status');
        $type   = $request->query('type');
        $range  = $request->query('range', 'all');
        $date   = $request->query('date');

        $query = FilePayment::with('user.roles')
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

        $users = \App\Models\User::whereHas('roles', function ($q) {
            $q->whereIn('name', [
                'indonesia-participants', 'foreign-participants',
                'indonesia-presenter', 'foreign-presenter',
            ]);
        })->with('abstracts')->orderBy('name')->get(['id','name','institution','email','phone_number','country']);

        return \Inertia\Inertia::render('Admin/Payment/Index', [
            'payments'   => $payments,
            'pendingAll' => $pendingAll,
            'stats'      => compact('total', 'pending', 'verified'),
            'filters'    => compact('search', 'status', 'type', 'range'),
            'users'      => $users,
        ]);
    }

    public function verify($id)
    {
        $filePayment = FilePayment::findOrFail($id);
        $newStatus = $filePayment->status === 'verified' ? 'pending' : 'verified';
        $filePayment->update(['status' => $newStatus]);

        if ($newStatus === 'verified') {
            $user = $filePayment->user;
            Mail::to($user->email)->send(new PaymentVerified($user, $filePayment));
        }

        return back();
    }

    /**
     * Resize an image to a max width using GD (pure PHP, no Imagick).
     * Returns the image as a base64 data URI so DomPDF never calls Imagick.
     */
    private function imageToBase64Uri(string $path, int $maxWidth = 800): string
    {
        if (!file_exists($path)) {
            return '';
        }

        $info = @getimagesize($path);
        if (!$info) {
            return 'file://' . $path;
        }

        [$origW, $origH, $type] = $info;

        // Load source with GD
        $src = match ($type) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
            IMAGETYPE_PNG  => @imagecreatefrompng($path),
            IMAGETYPE_WEBP => @imagecreatefromwebp($path),
            default        => null,
        };

        if (!$src) {
            // GD can't read it — fall back to raw embed
            $mime = image_type_to_mime_type($type);
            return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
        }

        // Scale down if wider than $maxWidth
        if ($origW > $maxWidth) {
            $newH = (int) round($origH * ($maxWidth / $origW));
            $dst  = imagecreatetruecolor($maxWidth, $newH);

            if ($type === IMAGETYPE_PNG) {
                imagealphablending($dst, false);
                imagesavealpha($dst, true);
                $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
                imagefilledrectangle($dst, 0, 0, $maxWidth, $newH, $transparent);
            }

            imagecopyresampled($dst, $src, 0, 0, 0, 0, $maxWidth, $newH, $origW, $origH);
            imagedestroy($src);
            $src = $dst;
        }

        // Capture output as PNG into a buffer
        ob_start();
        imagepng($src, null, 6);
        $data = ob_get_clean();
        imagedestroy($src);

        return 'data:image/png;base64,' . base64_encode($data);
    }

    public function digitalPdf(Request $request, $id)
    {
        $user = $request->user();
        abort_unless(
            $user instanceof User && ($user->hasRole('admin') || $user->hasRole('executive')),
            403
        );

        // Try to increase memory limit — may be a no-op on some servers,
        // but the real fix is the GD pre-resize below which prevents Imagick
        // from ever touching the original high-res file.
        @ini_set('memory_limit', '512M');

        $conferenceSetting    = ConferenceSetting::first();
        $conferenceChairPerson = $conferenceSetting->conference_chairperson;
        $filePayment          = FilePayment::with('user.abstracts')->findOrFail($id);

        $letterHeaderUrl = Upload::getFilePath('letter_header');
        $signatureUrl    = Upload::getFilePath('signature');

        $letterHeaderPath = $letterHeaderUrl
            ? storage_path('app/public/' . ltrim(str_replace(asset('storage'), '', $letterHeaderUrl), '/'))
            : null;
        $signaturePath = $signatureUrl
            ? storage_path('app/public/' . ltrim(str_replace(asset('storage'), '', $signatureUrl), '/'))
            : null;

        // Pre-resize images with GD and embed as base64 data URIs.
        // DomPDF will never call Imagick on a file:// path, so no OOM.
        $letterHeader = $letterHeaderPath && file_exists($letterHeaderPath)
            ? $this->imageToBase64Uri($letterHeaderPath, 800)
            : null;

        $signature = $signaturePath && file_exists($signaturePath)
            ? $this->imageToBase64Uri($signaturePath, 300)
            : null;

        $pdf = PDF::loadView(
            'verify-payment.digital-pdf',
            compact('filePayment', 'letterHeader', 'signature', 'conferenceChairPerson')
        );

        $pdf->getDomPDF()->set_option('dpi', 96);
        $pdf->getDomPDF()->set_option('isPhpEnabled', false);

        return $pdf->stream('payment-digital.pdf');
    }

    public function sendReminder()
    {
        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('name', [
                'indonesia-participants',
                'foreign-participants',
                'indonesia-presenter',
                'foreign-presenter'
            ]);
        })
            ->whereDoesntHave('filePayments') // Belum ada pembayaran sama sekali
            ->get();

        foreach ($users as $user) {
            SendPaymentReminderEmail::dispatch($user);
        }

        return back()->with('success', "Email reminder berhasil dikirim");
    }

    public function sendReminderForeign()
    {
        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('name', [
                'foreign-participants',
                'foreign-presenter'
            ]);
        })
            ->whereDoesntHave('filePayments')
            ->get();

        $delay = 0;
        foreach ($users as $user) {
            Bus::dispatch(
                (new SendPaymentReminderEmailForeign($user))
                    ->delay(now()->addMinutes($delay))
            );
            $delay += 2;
        }

        return back()->with('success', "Email reminder untuk foreign berhasil dikirim");
    }
}
