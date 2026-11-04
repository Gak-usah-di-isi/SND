<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FilePayment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Upload;
use App\Models\ConferenceSetting;
use App\Models\Year;
use App\Support\ViewingYear;
use Laratrust\Traits\HasRolesAndPermissions;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\FlashAlert;
use App\Mail\PaymentNotification;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class FilePaymentController extends Controller
{
    use HasRolesAndPermissions;
    use FlashAlert;

    public function create()
    {
        $users = Auth::user();
        // Ikut tahun yang sedang dilihat supaya peserta bisa melihat bukti
        // bayar tahun sebelumnya; upload barunya tetap dikunci ke tahun aktif.
        $existingPayment = FilePayment::where('user_id', $users->id)
            ->forYear(ViewingYear::current())
            ->first();
        $conferenceSetting = ConferenceSetting::first();
        return Inertia::render('User/Payment/Index', [
            'existingPayment' => $existingPayment,
            'conferenceSetting' => $conferenceSetting,
            'isArchive' => ViewingYear::isReadOnly(),
        ]);
    }
    public function store(Request $request)
    {
        $amount = $request->input('amount');
        $amount = str_replace('.', '', $amount);
        $amount = (int) $amount;
        $currency = $request->input('currency', 'IDR');

        // Pertama kali untuk tahun aktif — bukan pertama kali seumur hidup akun.
        $isFirstUpload = FilePayment::where('user_id', Auth::user()->id)->forYear(Year::activeYear())->doesntExist();

        $request->validate([
            'file' => $isFirstUpload ? 'required|file|mimes:jpg,png,jpeg|max:2048' : 'file|mimes: jpg,png,jpeg|max:2048',
            'amount' => $isFirstUpload ? 'required|numeric|min:0' : 'nullable|numeric|min:0',
            'currency' => 'required|in:IDR,USD'
        ], [
            'file.max' => 'File terlalu besar. Maksimal ukuran file adalah 2MB.',
            'file.mimes' => 'Format file tidak sesuai. Format yang diterima: JPG, JPEG, PNG, PDF',
            'file.required' => 'File pembayaran harus diupload',
            'amount.numeric' => 'Jumlah pembayaran harus berupa angka yang valid.',
            'amount.min' => 'Jumlah pembayaran tidak boleh negatif',
        ]);

        if (!$request->hasFile('file') && !$request->filled('amount')) {
            return redirect()->back()
                ->withErrors(['file' => 'You must upload a file or enter a payment amount.'])
                ->withInput();
        }

        $user = Auth::user();

        // Dicari hanya untuk tahun konferensi aktif: pembayaran tahun sebelumnya
        // tidak boleh ikut ter-update (dulu bukti bayar tahun lalu ikut terhapus).
        $activeYear = Year::activeYear();
        $existingPayment = FilePayment::where('user_id', $user->id)->forYear($activeYear)->first();
        if ($existingPayment) {
            $updateData = [];
            if ($request->hasFile('file')) {
                if (!empty($existingPayment->file_path)) {
                    Storage::disk('public')->delete($existingPayment->file_path);
                }
                $filePath = $request->file('file')->store('payments', 'public');
                $updateData['file_path'] = $filePath;
            }

            if ($request->filled('amount')) {
                $updateData['amount'] = $amount;
            }

            $updateData['currency'] = $currency;

            if (!empty($updateData)) {
                $existingPayment->update($updateData);
                $message = 'Payment data successfully updated.';
            } else {
                $message = 'No changes were made.';
            }
        } else {
            $data = [
                'user_id' => $user->id,
                'year' => $activeYear,
                'currency' => $currency
            ];
            if ($request->hasFile('file')) {
                $data['file_path'] = $request->file('file')->store('payments', 'public');
            }
            if ($request->filled('amount')) {
                $data['amount'] = $amount;
            }
            FilePayment::create($data);
            $message = 'Payment data successfully saved.';
        }

        $conferenceSetting = ConferenceSetting::first();
        $adminEmails = explode(',', $conferenceSetting->administrator_email);
        $treasurerEmails = explode(',', $conferenceSetting->treasurer_email);
        $recipients = array_merge($adminEmails, $treasurerEmails);

        $payment = $existingPayment ?? FilePayment::where('user_id', $user->id)->forYear($activeYear)->latest()->first();

        if ($payment) {
            try {
                Mail::to($recipients)->send(new PaymentNotification($payment));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning("Gagal mengirim email PaymentNotification: " . $e->getMessage());
            }
        }


        return redirect()->route('filepayments.create')
            ->with(['type' => 'success', 'message' => $message]);
    }

    public function receipt($id)
    {
        try {
            $filePayment = FilePayment::with('user.abstracts')->findOrFail($id);
            if (
                $filePayment->user_id === request()->user()->id
            ) {
                @ini_set('memory_limit', '512M');

                $conferenceSetting = ConferenceSetting::first();
                $conferenceChairPerson = $conferenceSetting->conference_chairperson;

                $letterHeader = Upload::getBase64Image('letter_header', 800);
                $signature    = Upload::getBase64Image('signature', 300);

                $pdf = PDF::loadView('verify-payment.digital-pdf', compact('filePayment', 'letterHeader', 'signature', 'conferenceChairPerson'));
                $pdf->getDomPDF()->set_option('dpi', 96);
                $pdf->getDomPDF()->set_option('isPhpEnabled', false);

                return $pdf->stream('payment-digital.pdf');
            } else {
                return redirect()->route('filepayments.create')->with($this->permissionDenied());
            }
        } catch (ModelNotFoundException $e) {
            return redirect()->route('filepayments.create')->with($this->alertNotFound());
        }
    }

    /**
     * Menyajikan bukti pembayaran lewat route terproteksi (middleware auth).
     * URL: /filepayments/{id}/proof
     */
    public function proof($id)
    {
        $payment = FilePayment::findOrFail($id);

        return $this->respondProof($payment);
    }

    /**
     * Kompatibilitas URL lama /storage/payments/{filename}.
     * File lama yang sudah terlanjur tersebar tetap terbaca, tetapi kini
     * melewati auth + cek otorisasi, bukan lagi file statis tanpa proteksi.
     */
    public function proofByFilename($filename)
    {
        $payment = FilePayment::where('file_path', 'payments/' . basename($filename))
            ->firstOrFail();

        return $this->respondProof($payment);
    }

    /**
     * Stream bukti pembayaran setelah lolos otorisasi.
     *
     * Yang boleh melihat: pemilik transaksi ATAU role yang berwenang pada
     * modul pembayaran (admin, bendahara, sekretaris, humas, executive).
     * Selain itu 403 Forbidden.
     */
    private function respondProof(FilePayment $payment)
    {
        $user = Auth::user();

        $isOwner = (int) $payment->user_id === (int) $user->id;
        $allowedRoles = ['admin', 'bendahara', 'sekretaris', 'humas', 'executive'];

        if (!$isOwner && !$user->hasRole($allowedRoles)) {
            abort(403);
        }

        if (empty($payment->file_path) || !Storage::disk('public')->exists($payment->file_path)) {
            abort(404);
        }

        return Storage::disk('public')->response($payment->file_path);
    }
}
