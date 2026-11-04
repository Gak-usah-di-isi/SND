@extends('layouts.app')

@section('title', 'Reviewer Committee')

@section('content')
<div class="container card p-4">
    <h2 class="fs-5">Reviewer Committee</h2>
    <hr class="border border-secondary">

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="w-25">
            <label for="yearFilter" class="form-label fw-bold">Select Year:</label>
            <select id="yearFilter" class="form-select" onchange="filterYear()">
                <option value="all" {{ request('year') == 'all' ? 'selected' : '' }}>All Years</option>
                @foreach ($years as $year)
                    <option value="{{ $year }}" {{ $year == $selectedYear ? 'selected' : '' }}>{{ $year }}</option>
                @endforeach
            </select>
        </div>
        
        <a href="{{ route('landing.reviewer.create') }}" class="btn btn-primary">Add Reviewer</a>
    </div>

    <table class="table table-bordered">
        <thead class="table-dark text-center">
            <tr>
                <th>No</th>
                <th>Name</th>
                <th>Institution</th>
                <th>Country</th>
                <th>Year</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reviewers as $index => $reviewer)
                <tr class="text-center">
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $reviewer->name }}</td>
                    <td>{{ $reviewer->institution }}</td>
                    <td>{{ $reviewer->country }}</td>
                    <td>{{ $reviewer->year }}</td>
                    <td>
                        <a href="{{ route('landing.reviewer.edit', $reviewer) }}" class="btn btn-warning btn-sm">Edit</a>
                        <form action="{{ route('landing.reviewer.destroy', $reviewer) }}" method="POST" class="d-inline" onsubmit="return confirm('Are you sure?');">
                            @csrf @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">No reviewers available</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

<script>
    function filterYear() {
        const selectedYear = document.getElementById('yearFilter').value;
        const url = selectedYear === "all" 
            ? `{{ route('landing.reviewer.index') }}` 
            : `{{ route('landing.reviewer.index') }}?year=${selectedYear}`;
        window.location.href = url;
    }
</script>

@endsection
