@extends('layouts.app')
@section('title', 'Deadline Dates')
@section('content')
    <div class="container card p-4">
        <h2>Deadline Dates</h2>
        <hr class="border border-secondary">

        <!-- Dropdown Filter Tahun -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <a href="{{ route('landing.deadlines.create') }}" class="btn btn-primary">Add New Deadline</a>

            <form action="{{ route('landing.deadlines.index') }}" method="GET" class="d-flex">
                <select name="year" class="form-select me-2" onchange="this.form.submit()">
                    <option value="">All Years</option>
                    @foreach ($years as $yearOption)
                        <option value="{{ $yearOption }}" {{ request('year') == $yearOption ? 'selected' : '' }}>
                            {{ $yearOption }}
                        </option>
                    @endforeach
                </select>
            </form>
            
        </div>

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($deadlines as $deadline)
                    <tr>
                        <td>{{ $deadline->name }}</td>
                        <td>{{ \Carbon\Carbon::parse($deadline->date)->format('F j, Y') }}</td>
                        <td>
                            <a href="{{ route('landing.deadlines.edit', $deadline->id) }}" class="btn btn-warning">Edit</a>
                            <form action="{{ route('landing.deadlines.destroy', $deadline->id) }}" method="POST" style="display:inline;">
                                @csrf @method('DELETE')
                                <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure?')">
                                    Delete
                                </button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
