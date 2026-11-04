@extends('layouts.app')
@section('title', 'Speaker')

@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Speakers</h2>
        <hr class="border border-secondary">

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        {{-- Filter dan Tambah Speaker --}}
        <div class="d-flex justify-content-between align-items-center mb-3">
            <form action="{{ route('landing.speakers.index') }}" method="GET" class="d-flex gap-2">
                <select name="year" class="form-select" onchange="this.form.submit()">
                    <option value="">All Years</option>
                    @foreach ($years as $year)
                        <option value="{{ $year }}" {{ $year == $selectedYear ? 'selected' : '' }}>
                            {{ $year }}
                        </option>
                    @endforeach
                </select>
            </form>
            <a href="{{ route('landing.speakers.create') }}" class="btn btn-primary">Add Speaker</a>
        </div>

        <table class="table table-bordered table-striped">
            <thead class="table-success">
                <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Institution</th>
                    <th>Role</th>
                    <th>Year</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($speakers as $speaker)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>
                            @if ($speaker->image)
                                <img src="{{ asset('storage/' . $speaker->image) }}" alt="Speaker Image" width="60">
                            @else
                                <span class="text-muted">No Image</span>
                            @endif
                        </td>
                        <td>{{ $speaker->name }}</td>
                        <td>{{ $speaker->institution }}</td>
                        <td>{{ str_replace('_', ' ', ucfirst($speaker->role)) }}</td>
                        <td>{{ $speaker->year }}</td>
                        <td>
                            <a href="{{ route('landing.speakers.edit', $speaker->id) }}" class="btn btn-warning btn-sm">Edit</a>
                            <form action="{{ route('landing.speakers.destroy', $speaker->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Are you sure?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center text-muted">
                            @if ($selectedYear)
                                No speakers available for {{ $selectedYear }}
                            @else
                                No speakers available
                            @endif
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
        
    </div>
@endsection