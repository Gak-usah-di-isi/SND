<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class NotPaidExport implements FromCollection, WithHeadings, WithMapping
{
    protected $rolesToDisplay = [
        'indonesia-participants',
        'foreign-participants',
        'indonesia-presenter',
        'foreign-presenter'
    ];

    public function collection()
    {
        return User::whereHas('roles', function ($query) {
            $query->whereIn('name', $this->rolesToDisplay);
        })->whereDoesntHave('filePayments')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            'Phone',
            'Institution',
            'RegType',
            'Job Title',
            'Country',
            'Status Payment',
            'Attendance',
        ];
    }

    public function map($user): array
    {
        $filteredRoles = $user->roles
            ->whereIn('name', $this->rolesToDisplay)
            ->pluck('display_name')
            ->join(', ');

        return [
            $user->name,
            $user->email,
            $user->phone_number,
            $user->institution,
            $filteredRoles ?: 'N/A',
            $user->job_title,
            $user->country,
            'Not Paid',
            $user->attendance ?? 'Not Available',
        ];
    }
}
