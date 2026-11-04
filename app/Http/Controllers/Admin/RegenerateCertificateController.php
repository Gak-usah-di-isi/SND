<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Year;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Models\Certificate;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AbstractController;

class RegenerateCertificateController extends Controller
{
    public function index(Request $request)
    {
        $search     = $request->query('search');
        $role       = $request->query('role');
        $activeYear = Year::where('is_active', true)->first();

        $users = User::with('roles')
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', [
                    'indonesia-participants',
                    'foreign-participants',
                    'indonesia-presenter',
                    'foreign-presenter',
                    'reviewer',
                ]);
            })
            ->when($activeYear, fn($q) => $q->whereYear('created_at', $activeYear->year))
            ->when($search, fn($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('phone_number', 'LIKE', "%{$search}%")
                  ->orWhere('institution', 'LIKE', "%{$search}%");
            }))
            ->when($role, fn($q) => $q->whereHas('roles', fn($q) => $q->where('name', $role)))
            ->orderBy('created_at', 'asc')
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();

        return \Inertia\Inertia::render('Admin/RegenerateCertificate/Index', [
            'users'  => $users,
            'search' => $search ?? '',
            'role'   => $role ?? '',
        ]);
    }


    public function regenerateCertificate(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $activeYear = Year::activeYear();

        // Hanya hapus sertifikat tahun aktif — sertifikat tahun sebelumnya
        // adalah arsip dan tidak boleh ikut terhapus saat regenerate.
        foreach ($user->certificates()->where('year', $activeYear)->get() as $certificate) {
            if (Storage::disk('public')->exists($certificate->certificate_path)) {
                Storage::disk('public')->delete($certificate->certificate_path);
            }
            $certificate->delete();
        }

        $registeredController = new RegisteredUserController();
        $registeredController->generateCertificate($user);

        if ($user->hasRole('indonesia-presenter') || $user->hasRole('foreign-presenter')) {
            $abstract = $user->abstracts()
                ->whereYear('created_at', $activeYear)
                ->latest()
                ->first();

            if ($abstract) {
                $abstractController = new AbstractController();
                $abstractController->generateCertificate($abstract);
            }
        }

        return redirect()->back()->with('success', 'Certificate regenerated successfully for ' . $user->name);
    }
}
