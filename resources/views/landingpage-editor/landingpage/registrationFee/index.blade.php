@extends('layouts.app')
@section('title', 'Registration Fee')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Registration Fee</h2>
        <hr class="border border-secondary">

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        {{-- Filter Tahun dan Tombol Tambah dalam Satu Baris --}}
        <div class="d-flex align-items-center justify-content-between mb-3">
            {{-- Filter Tahun --}}
            <form action="{{ route('landing.registrationFee.index') }}" method="GET" class="d-flex align-items-center gap-3">
                <select name="year" id="year" class="form-select w-auto" onchange="this.form.submit()">
                    <option value="">-- Select Year --</option>
                    @foreach ($years as $year)
                        <option value="{{ $year->year }}" {{ request('year') == $year->year ? 'selected' : '' }}>
                            {{ $year->year }}
                        </option>
                    @endforeach
                </select>
            </form>

            {{-- Tombol Tambah --}}
            <a href="{{ route('landing.registrationFee.create') }}" class="btn btn-primary">Add Registration Fee</a>
        </div>

        {{-- Tabel --}}
        <table class="table table-bordered table-striped">
            <thead class="table-success">
                <tr>
                    <th>No</th>
                    <th>Category Name</th>
                    <th>Role</th>
                    <th>Domestic Participants</th>
                    <th>International Participants</th>
                    <th>Period of Payment</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($registrationFees as $registrationfee)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ $registrationfee->category_name }}</td>
                        <td>{{ $registrationfee->role_type }}</td>
                        <td>{{ $registrationfee->domestic_participants }}</td>
                        <td>{{ $registrationfee->international_participants }}</td>
                        <td>{{ $registrationfee->period_of_payment }}</td>
                        <td>
                            <a href="{{ route('landing.registrationFee.edit', $registrationfee->id) }}" class="btn btn-warning btn-sm">Edit</a>
                            <form action="{{ route('landing.registrationFee.destroy', $registrationfee->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Are you sure?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center">No data available</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
