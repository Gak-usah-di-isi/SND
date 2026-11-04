<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use App\Models\User;
use App\Models\Year;
use Illuminate\Http\Request;

class ReviewersExport implements FromCollection, WithHeadings, WithMapping
{
    protected ?Request $request;
    protected int $rowNumber = 1;
    protected array $rolesToDisplay = [
        'reviewer',
        'editor',
        'chief-editor'
    ];

    public function __construct(?Request $request = null)
    {
        $this->request = $request;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $activeYear = Year::where('is_active', true)->first();
        $activeYearVal = $activeYear ? (string) $activeYear->year : (string) date('Y');

        $query = User::whereHas('roles', function ($query) {
            $query->whereIn('name', $this->rolesToDisplay);
        });

        if ($this->request) {
            $year   = $this->request->input('year', $activeYearVal);
            $status = $this->request->input('status', '');
            $search = $this->request->input('search', '');
            $role   = $this->request->input('role', '');

            if ($year === $activeYearVal) {
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
                    $query->where('is_active', true);
                }
            } elseif ($year === 'all') {
                if ($status === 'active') {
                    $query->where('is_active', true);
                } elseif ($status === 'inactive') {
                    $query->where('is_active', false);
                }
            } else {
                $query->whereYear('created_at', $year);
                if ($status === 'active') {
                    $query->where('is_active', true);
                } elseif ($status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('institution', 'like', "%{$search}%");
                });
            }

            if ($role) {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            }
        }

        return $query->with('roles')->orderBy('id', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Name',
            'Email',
            'Institution',
            'Roles',
            'Status',
            'Registered Year',
        ];
    }

    public function map($user): array
    {
        $filteredRoles = $user->roles
            ->whereIn('name', $this->rolesToDisplay)
            ->pluck('display_name')
            ->join(', ');

        return [
            $this->rowNumber++,
            $user->name,
            $user->email,
            $user->institution,
            $filteredRoles ?: 'N/A',
            $user->is_active ? 'Active' : 'Inactive',
            $user->created_at ? $user->created_at->format('Y') : '-',
        ];
    }
}
