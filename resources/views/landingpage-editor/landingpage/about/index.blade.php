@extends('layouts.app')
@section('title', 'About Section')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">About Section</h2>
        <hr class="border border-secondary">
        
        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <!-- Filter & Tombol Add About -->
        <div class="d-flex w-full justify-content-between align-items-end mb-3">
            <form action="{{ route('landing.abouts.index') }}" method="GET" class="d-flex gap-2">
                <div >
                    <label for="filterYear" class="form-label mb-0">Filter by Year</label>
                    <select name="year" id="filterYear" class="form-select">
                        @foreach ($years as $year)
                            <option value="{{ $year }}" {{ request('year') == $year ? 'selected' : '' }}>{{ $year }}</option>
                        @endforeach
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Filter</button>
            </form>

            <a href="{{ route('landing.abouts.create') }}" class="btn btn-success">+ Add About</a>
        </div>

        <!-- Tabel Data -->
        <div class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Image</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($abouts as $index => $about)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>{{ $about->title }}</td>
                            <td>{{ Str::limit($about->content, 100) }}</td>
                            <td>
                                @if ($about->image)
                                    <img src="{{ asset('storage/' . $about->image) }}" alt="{{ $about->title }}" width="100">
                                @else
                                    No Image
                                @endif
                            </td>
                            <td>{{ $about->year }}</td>
                            <td>
                                <a href="{{ route('landing.abouts.edit', $about->id) }}" class="btn btn-warning btn-sm">Edit</a>
                                <form action="{{ route('landing.abouts.destroy', $about->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Are you sure?');">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection
