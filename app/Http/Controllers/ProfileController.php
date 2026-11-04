<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;
use Illuminate\Support\Facades\Storage;
use App\Traits\FlashAlert;
use App\Models\Certificate;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AbstractController;

use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProfileController extends Controller
{
    use FlashAlert;
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): InertiaResponse
    {
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'name_certificate' => $user->name_certificate,
                'email' => $user->email,
                'institution' => $user->institution,
                'phone_number' => $user->phone_number,
                'country' => $user->country,
                'is_student' => (bool) $user->is_student,
                'profile_photo_path' => $user->profile_photo_path,
                'profile_photo_url' => $user->profile_photo_path
                    ? asset('storage/' . $user->profile_photo_path)
                    : null,
            ],
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $originalName = $user->name;
        $originalNameCertificate = $user->name_certificate;

        $user->update($request->validated());

        if ($user->wasChanged('email')) {
            $user->email_verified_at = null;
            $user->save();
        }

        if ($originalName !== $user->name || $originalNameCertificate !== $user->name_certificate) {
            if ($user->hasRole('indonesia-presenter') || $user->hasRole('foreign-presenter')) {
                // Sertifikat harus dibuat ulang dari abstract tahun aktif, bukan
                // abstract lama — tanpa filter ini nama di sertifikat bisa diambil
                // dari abstract tahun sebelumnya.
                $abstract = $user->abstracts()
                    ->whereYear('created_at', \App\Models\Year::activeYear())
                    ->latest()
                    ->first();
                if ($abstract) {
                    app(AbstractController::class)->generateCertificate($abstract);
                }
            } else {
                $this->updateCertificate($user);
            }
        }

        return Redirect::route('profile.edit')->with($this->alertUpdated());
    }

    private function updateCertificate($user)
    {
        // Hanya regenerate sertifikat tahun aktif — sertifikat tahun sebelumnya
        // adalah arsip dan tidak boleh ikut terhapus saat profil diperbarui.
        $certificate = Certificate::where('user_id', $user->id)
            ->where('certificate_type', 'participant')
            ->where('year', \App\Models\Year::activeYear())
            ->first();

        if ($certificate) {
            Storage::disk('public')->delete($certificate->certificate_path);
            $certificate->delete();
        }
        app(RegisteredUserController::class)->generateCertificate($user);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = auth()->user();

        // Hapus foto lama jika ada
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        // Simpan foto baru
        $path = $request->file('image')->store('profile_photos', 'public');
        $user->profile_photo_path = $path;
        $user->save();

        return redirect()->route('profile.edit')->with($this->alertUpdated());
    }

    public function deletePhoto(): RedirectResponse
    {
        $user = auth()->user();

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
            $user->profile_photo_path = null;
            $user->save();
        }

        return redirect()->route('profile.edit')->with($this->alertUpdated());
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
