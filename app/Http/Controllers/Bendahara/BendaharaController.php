<?php

namespace App\Http\Controllers\Bendahara;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FilePayment;
use App\Models\User;
use App\Models\Year;
use App\Mail\PaymentVerified;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BendaharaController extends Controller
{
    /**
     * Dashboard Summary Keuangan Bendahara
     */
    public function summary()
    {
        $activeYear = Year::where('is_active', true)->first();
        $targetYear = $activeYear?->year ?? date('Y');

        $usdToIdrRate = 16330;

        // Total pembayaran terverifikasi
        $payments = FilePayment::where('status', 'verified')
            ->when($activeYear, fn($q) => $q->whereYear('created_at', $targetYear))
            ->selectRaw('currency, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('currency')
            ->get();

        $totalIncomeIdr = 0;
        $totalVerifiedCount = 0;
        foreach ($payments as $p) {
            $totalVerifiedCount += $p->count;
            if ($p->currency === 'USD') {
                $totalIncomeIdr += $p->total * $usdToIdrRate;
            } else {
                $totalIncomeIdr += $p->total;
            }
        }

        // Stats status payment
        $baseQuery = FilePayment::when($activeYear, fn($q) => $q->whereYear('created_at', $targetYear));
        $totalPayments = (clone $baseQuery)->count();
        $pendingPayments = (clone $baseQuery)->where('status', 'pending')->count();
        $verifiedPayments = (clone $baseQuery)->where('status', 'verified')->count();
        $unpaidParticipants = User::whereDoesntHave('filePayments')->count();

        // Recent payment transactions
        $recentPayments = FilePayment::with('user.roles')
            ->when($activeYear, fn($q) => $q->whereYear('created_at', $targetYear))
            ->latest()
            ->take(8)
            ->get();

        return Inertia::render('Bendahara/Summary/Index', [
            'stats' => [
                'totalIncomeIdr' => $totalIncomeIdr,
                'totalPayments' => $totalPayments,
                'pendingPayments' => $pendingPayments,
                'verifiedPayments' => $verifiedPayments,
                'unpaidParticipants' => $unpaidParticipants,
            ],
            'recentPayments' => $recentPayments,
            'activeYear' => ['year' => (string) $targetYear],
        ]);
    }

    /**
     * Halaman Kelola & Verifikasi Pembayaran
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

        $pendingAll = FilePayment::with('user.roles')
            ->when($activeYear, fn($q) => $q->whereYear('created_at', $activeYear->year))
            ->where('status', 'pending')
            ->latest()
            ->get();

        $payments = $query->paginate(10)->withQueryString();

        return Inertia::render('Bendahara/Payment/Index', [
            'payments'   => $payments,
            'pendingAll' => $pendingAll,
            'stats'      => compact('total', 'pending', 'verified'),
            'filters'    => compact('search', 'status', 'type', 'range'),
        ]);
    }

    /**
     * Aksi Verifikasi / Revert Status Pembayaran
     */
    public function verify($id)
    {
        $filePayment = FilePayment::findOrFail($id);
        $newStatus = $filePayment->status === 'verified' ? 'pending' : 'verified';
        $filePayment->update(['status' => $newStatus]);

        if ($newStatus === 'verified') {
            try {
                $user = $filePayment->user;
                if ($user && $user->email) {
                    Mail::to($user->email)->send(new PaymentVerified($user, $filePayment));
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning("Gagal mengirim email PaymentVerified oleh bendahara: " . $e->getMessage());
            }
        }

        return back()->with('success', 'Status pembayaran berhasil diperbarui.');
    }

    /**
     * Download Bukti Pembayaran
     */
    public function downloadProof($id)
    {
        $filePayment = FilePayment::findOrFail($id);

        if (!$filePayment->file_path || !Storage::disk('public')->exists($filePayment->file_path)) {
            return back()->with('error', 'Bukti pembayaran tidak ditemukan.');
        }

        return Storage::disk('public')->download($filePayment->file_path);
    }
}
