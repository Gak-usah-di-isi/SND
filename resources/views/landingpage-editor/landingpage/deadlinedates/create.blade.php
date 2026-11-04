@extends('layouts.app')

@section('title', 'Add Deadline')

@section('content')
    <div class="container card p-4">
        <h2>Add New Deadline</h2>

        <form action="{{ route('landing.deadlines.store') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" name="name" class="form-control" required placeholder="Abstract Submission">
            </div>
            <div class="mb-3">
                <label class="form-label">Date</label>
                <input type="date" name="date" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Year</label>
                <input type="number" name="year" class="form-control" value="{{ date('Y') }}" required>
            </div>
            <div class="d-flex gap-2 justify-start">
                <button type="submit" class="btn btn-success">Add</button>
                <a href="{{ route('landing.deadlines.index') }}" class="btn btn-danger">Kembali</a>
            </div>
        </form>
    </div>
@endsection
