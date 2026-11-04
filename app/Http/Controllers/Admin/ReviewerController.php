<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\FlashAlert;
use App\Models\Year;
use App\Exports\ReviewersExport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    use FlashAlert;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $activeYear = Year::where('is_active', true)->first();
        $activeYearVal = $activeYear ? (string) $activeYear->year : (string) date('Y');

        $rolesToDisplay = ['chief-editor', 'editor', 'reviewer'];

        // Deteksi seluruh tahun historis secara otomatis dari tabel Year dan record reviewer (created_at)
        $dbYears = Year::pluck('year')->map(fn($y) => (string) $y)->toArray();
        $userYears = User::whereHas('roles', fn($q) => $q->whereIn('name', $rolesToDisplay))
            ->selectRaw('DISTINCT YEAR(created_at) as yr')
            ->pluck('yr')
            ->filter()
            ->map(fn($y) => (string) $y)
            ->toArray();

        $allYears = collect(array_merge([$activeYearVal], $dbYears, $userYears))
            ->filter()
            ->unique()
            ->sortDesc()
            ->values()
            ->toArray();

        $perPage = (int) $request->input('per_page', 8);
        if ($perPage < 1) {
            $perPage = 8;
        }
        if ($perPage > 50) {
            $perPage = 50;
        }

        $search = $request->input('search', '');
        $role   = $request->input('role', '');
        $status = $request->input('status', ''); // 'active', 'inactive', 'all'
        // Jika filter tahun belum dipilih, default mengacu ke tahun aktif
        $year   = $request->input('year', $activeYearVal);

        $query = User::whereHas('roles', function ($query) use ($rolesToDisplay) {
            $query->whereIn('name', $rolesToDisplay);
        });

        // Filter Tahun & Logika Status Aktif/Non-aktif
        // "jika aktif akan muncul di tahun aktif, ini khusus reviewer aja ya"
        if ($year === $activeYearVal) {
            // Tahun Aktif:
            // Reviewer yang aktif (apapun tahun dibuatnya) akan muncul di tahun aktif
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false)->whereYear('created_at', $activeYearVal);
            } elseif ($status === 'all') {
                $query->where(function ($q) use ($activeYearVal) {
                    $q->where('is_active', true)
                      ->orWhereYear('created_at', $activeYearVal);
                });
            } else {
                // Default di tahun aktif: semua reviewer yang aktif muncul
                $query->where('is_active', true);
            }
        } elseif ($year === 'all') {
            // Semua tahun
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        } else {
            // Tahun historis tertentu (misal 2025, 2024, dst)
            $query->whereYear('created_at', $year);
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $users = $query->when($search, fn($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('institution', 'like', "%{$search}%");
            }))
            ->when($role, fn($q) => $q->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            }))
            ->with('roles')
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $roles = Role::whereIn('name', $rolesToDisplay)->get(['id', 'name', 'display_name']);

        return Inertia::render('Admin/Reviewer/Index', [
            'users'          => $users,
            'roles'          => $roles,
            'years'          => $allYears,
            'activeYear'     => $activeYearVal,
            'search'         => $search,
            'role'           => $role,
            'selectedYear'   => (string) $year,
            'selectedStatus' => (string) $status,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::whereIn('name', [
            'chief-editor',
            'editor',
            'reviewer'
        ])->get();
        return view('reviewers.create', compact('roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'institution' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role_id' => ['required'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'institution' => $validatedData['institution'],
            'password' => Hash::make($validatedData['password']),
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
        ]);

        $role = Role::findOrFail($validatedData['role_id']);
        $user->syncRoles([$role]);
        $user->flushCache();

        return redirect()->route('admin.reviewer.index')->with($this->alertCreated());
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $user = User::findOrFail($id);
            $roles = Role::whereIn('name', [
                'chief-editor',
                'editor',
                'reviewer'
            ])->get();

            return view('reviewers.edit', compact('user', 'roles'));
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.reviewer.index')->with($this->alertNotFound());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
                'institution' => ['required', 'string', 'max:255'],
                'role_id' => ['required'],
                'is_active' => ['nullable', 'boolean'],
            ]);

            $updateData = [
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'institution' => $validatedData['institution'],
            ];

            if ($request->has('is_active')) {
                $updateData['is_active'] = $request->boolean('is_active');
            }

            $user->update($updateData);

            $role = Role::findOrFail($validatedData['role_id']);
            $user->syncRoles([$role]);
            $user->flushCache();

            return redirect()->route('admin.reviewer.index')->with($this->alertUpdated());
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.reviewer.index')->with($this->alertNotFound());
        }
    }

    /**
     * Toggle the active status of a reviewer.
     */
    public function toggleStatus(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $rolesToDisplay = ['chief-editor', 'editor', 'reviewer'];
            if (!$user->hasRole($rolesToDisplay)) {
                return back()->with($this->alertDanger('Invalid reviewer.'));
            }

            $user->is_active = $request->has('is_active')
                ? $request->boolean('is_active')
                : !$user->is_active;
            $user->save();

            $statusText = $user->is_active ? 'activated' : 'deactivated';
            return back()->with($this->alertUpdated("Reviewer {$user->name} successfully {$statusText}."));
        } catch (ModelNotFoundException $e) {
            return back()->with($this->alertNotFound());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            $user->syncRoles([]);
            $user->flushCache();

            $user->delete();

            return redirect()->route('admin.reviewer.index')->with($this->alertDeleted());
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.reviewer.index')->with($this->alertNotFound());
        }
    }

    public function export(Request $request)
    {
        return Excel::download(new ReviewersExport($request), 'reviewers.xlsx');
    }
}
