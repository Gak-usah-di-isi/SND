<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Certificate;
use App\Models\FilePayment;
use App\Models\Year;
use App\Traits\FlashAlert;
use Inertia\Inertia;

class CertificateController extends Controller
{
    use FlashAlert;

    public function index(Request $request)
    {
        $activeYear = Year::where('is_active', true)->first();

        $search = $request->query('search');
        $type   = $request->query('type');

        $query = Certificate::with('user.filePayment')
            ->when($activeYear, fn ($q) => $q->where('year', $activeYear->year))
            ->when($search, fn ($q) => $q->whereHas('user', fn ($q) => $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('institution', 'LIKE', "%{$search}%")))
            ->when($type, fn ($q) => $q->where('certificate_type', $type))
            ->latest();

        $total    = (clone $query)->count();
        $active   = (clone $query)->where('status', 1)->count();
        $inactive = (clone $query)->where('status', 0)->count();

        $certificates = $query
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();

        return Inertia::render('Admin/Certificates/Index', [
            'certificates' => $certificates,
            'stats'        => compact('total', 'active', 'inactive'),
            'search'       => $search ?? '',
            'type'         => $type ?? '',
        ]);
    }

    public function toggleStatus(Request $request, $id)
    {
        $certificate = Certificate::findOrFail($id);
        $certificate->status = $request->status;
        $certificate->save();

        return back();
    }
}
