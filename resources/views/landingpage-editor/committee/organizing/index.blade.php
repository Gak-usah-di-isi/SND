@extends('layouts.app')

@section('title', 'Organizing Committee')

@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Organizing Committee</h2>
        <hr class="border border-secondary">

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex gap-3">
                <!-- Filter Tahun -->
                <div>
                    <label for="yearFilter" class="form-label fw-bold">Select Year:</label>
                    <select id="yearFilter" class="form-select" onchange="filterCommittee()">
                        <option value="all" {{ $selectedYear == 'all' ? 'selected' : '' }}>All Years</option>
                        @foreach ($years as $year)
                            <option value="{{ $year }}" {{ $year == $selectedYear ? 'selected' : '' }}>
                                {{ $year }}</option>
                        @endforeach
                    </select>
                </div>

                <!-- Filter Kategori -->
                <div>
                    <label for="categoryFilter" class="form-label fw-bold">Select Category:</label>
                    <select id="categoryFilter" class="form-select" onchange="filterCommittee()">
                        <option value="all" {{ $selectedCategory == 'all' ? 'selected' : '' }}>All Categories</option>
                        @foreach ($categories as $category)
                            <option value="{{ $category }}" {{ $category == $selectedCategory ? 'selected' : '' }}>
                                {{ $category }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <a href="{{ route('landing.organizing.create') }}" class="btn btn-primary">Add Committee</a>
        </div>

        <table class="table table-bordered">
            <thead class="table-dark text-center">
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse($committees as $index => $committee)
                    <tr class="text-center">
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $committee->name }}</td>
                        <td>{{ $committee->category }}</td>
                        <td>{{ $committee->year }}</td>
                        <td>
                            <a href="{{ route('landing.organizing.edit', $committee) }}"
                                class="btn btn-warning btn-sm">Edit</a>
                            <form action="{{ route('landing.organizing.destroy', $committee) }}" method="POST"
                                class="d-inline" onsubmit="return confirm('Are you sure?');">
                                @csrf @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center">No organizing available</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <script>
        function filterCommittee() {
            const selectedYear = document.getElementById('yearFilter').value;
            const selectedCategory = document.getElementById('categoryFilter').value;

            const url = new URL(window.location.href);
            url.searchParams.set('year', selectedYear);
            url.searchParams.set('category', selectedCategory);

            window.location.href = url.toString();
        }
    </script>

@endsection
