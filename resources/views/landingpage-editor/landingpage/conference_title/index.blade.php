@extends('layouts.app')
@section('title', 'Titles')

@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Title</h2>
        <hr class="border border-secondary">
        <form action="{{ route('landing.conference-title.index') }}" method="GET" class="mb-3">
            <div class="d-flex gap-2">
                <select name="year" class="form-select w-auto">
                    <option value="">All Years</option>
                    @foreach ($years as $year)
                        <option value="{{ $year }}" {{ request('year') == $year ? 'selected' : '' }}>
                            {{ $year }}</option>
                    @endforeach
                </select>
                <button type="submit" class="btn btn-primary">Filter</button>
            </div>
        </form>

        <!-- Tombol tambah judul -->
        <a href="{{ route('landing.conference-title.create') }}" class="w-fit btn btn-success mb-3">
            <i class="bi bi-plus-circle"></i> Add Title
        </a>

        <!-- Daftar conference titles -->
        @if ($conferenceTitles->count() > 0)
            <div class="row">
                @foreach ($conferenceTitles as $title)
                    <div class="col-md-6">
                        <div class="card shadow-sm mb-3">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <h5 class="fw-bold text-primary">{{ $title->title }}</h5>
                                    <span class="text-muted">{{ $title->year }}</span>
                                </div>
                                <p>{{ $title->description }}</p>
                                <hr>
                                <div class="d-flex gap-2">
                                    <a href="{{ route('landing.conference-title.edit', $title->id) }}"
                                        class="btn btn-primary btn-sm">
                                        <i class="bi bi-pencil-square"></i> Edit
                                    </a>

                                    <form action="{{ route('landing.conference-title.destroy', $title->id) }}"
                                        method="POST">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-sm"
                                            onclick="return confirm('Are you sure you want to delete this?');">
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div class="alert alert-warning">No titles found.</div>
        @endif
    </div>
@endsection
