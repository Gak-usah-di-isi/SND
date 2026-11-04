@extends('layouts.app')
@section('title', 'Publications Journal')
@section('content')
    <div class="container card p-4">
        <h2 class="fw-bold text-uppercase">Publications Journal</h2>
        <hr class="border border-secondary">

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <div class="d-flex justify-content-between align-items-center mb-3">
            <a href="{{ route('landing.publications-journal.create') }}" class="btn btn-primary">Add Publications Journal</a>
            <form action="{{ route('landing.publications-journal.index') }}" method="GET" class="d-flex">
                <!-- Filter Tahun -->
                <select name="year" class="form-select me-2" onchange="this.form.submit()">
                    <option value="">Year</option>
                    @foreach ($years as $year)
                        <option value="{{ $year }}" {{ request('year') == $year ? 'selected' : '' }}>{{ $year }}</option>
                    @endforeach
                </select>

                <!-- Filter Image Type -->
                <select name="image_type" class="form-select me-2" onchange="this.form.submit()">
                    <option value="">Image Type</option>
                    @foreach ($imageTypes as $type)
                        <option value="{{ $type }}" {{ request('image_type') == $type ? 'selected' : '' }}>
                            {{ ucfirst(str_replace('_', ' ', $type)) }}
                        </option>
                    @endforeach
                </select>

                @if(request('year') || request('image_type'))
                    <a href="{{ route('landing.publications-journal.index') }}" class="btn btn-secondary">Reset</a>
                @endif
            </form>
        </div>

        <table class="table table-bordered table-striped">
            <thead class="table-success">
                <tr>
                    <th>No</th>
                    <th>Year</th> <!-- Tambahkan kolom Tahun -->
                    <th>Image Type</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($publications_journals as $index => $publications_journal)
                    <tr>
                        <td>{{ $publications_journals->firstItem() + $index }}</td>
                        <td>{{ $publications_journal->year }}</td> 

                        <td>{{ ucfirst(str_replace('_', ' ', $publications_journal->image_type)) }}</td>
                        <td>
                            <img src="{{ asset('storage/' . $publications_journal->image_path) }}" alt="gambar" class="img-fluid" width="100">
                        </td>
                        <td class="text-center align-middle">
                            <div class="d-flex justify-content-center align-items-center gap-2">
                                <a href="{{ route('landing.publications-journal.edit', $publications_journal->id) }}" class="btn btn-warning btn-sm">Edit</a>
                                <form action="{{ route('landing.publications-journal.destroy', $publications_journal->id) }}" method="POST" onsubmit="return confirm('Are you sure?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                                </form>
                            </div>
                        </td>
                        
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Navigasi paginasi dengan Bootstrap -->
        <div class="d-flex justify-content-end mt-3">
            {{ $publications_journals->links('pagination::bootstrap-5') }}
        </div>
    </div>
@endsection
