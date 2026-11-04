@extends('layouts.app')

@section('title', 'Steering Committee')

@section('content')
<div class="container card p-4">
    <h2 class="fs-5">Steering Committee</h2>
    <hr class="border border-secondary">

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="w-25">
            <label for="yearFilter" class="form-label fw-bold">Select Year:</label>
            <select id="yearFilter" class="form-select" onchange="filterYear()">
                <option value="all" {{ $selectedYear == 'all' ? 'selected' : '' }}>All Years</option>
                @foreach ($years as $year)
                    <option value="{{ $year }}" {{ $year == $selectedYear ? 'selected' : '' }}>{{ $year }}</option>
                @endforeach
            </select>
        </div>
        
        <a href="{{ route('landing.steering.create') }}" class="btn btn-primary">Add Committee</a>
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
            @forelse($committees as $index => $committee)
                <tr class="text-center">
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $committee->name }}</td>
                    <td>{{ $committee->institution }}</td>
                    <td>{{ $committee->country }}</td>
                    <td>{{ $committee->year }}</td>
                    <td>
                        <a href="{{ route('landing.steering.edit', $committee) }}" class="btn btn-warning btn-sm">Edit</a>
                        <form action="{{ route('landing.steering.destroy', $committee) }}" method="POST" class="d-inline" onsubmit="return confirm('Are you sure?');">
                            @csrf @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">No steering available</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

<script>
    function filterYear() {
        const selectedYear = document.getElementById('yearFilter').value;
        const url = selectedYear === "all" 
            ? `{{ route('landing.steering.index') }}`
            : `{{ route('landing.steering.index') }}?year=${selectedYear}`;
        window.location.href = url;
    }
</script>

@endsection
