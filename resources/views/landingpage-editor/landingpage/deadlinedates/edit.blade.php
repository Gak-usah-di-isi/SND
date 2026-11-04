@extends('layouts.app')

@section('title', 'Edit Deadline')

@section('content')
    <div class="container card p-4">
        <h2>Edit Deadline</h2>

        <form action="{{ route('landing.deadlines.update', $deadline->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" name="name" class="form-control" value="{{ $deadline->name }}" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Date</label>
                <input type="date" name="date" class="form-control" value="{{ $deadline->date }}" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Year</label>
                <input type="number" name="year" class="form-control" value="{{ $deadline->year }}" required>
            </div>

            <div class="d-flex gap-2 justify-start">
                <button type="submit" class="btn btn-success">Update</button>
                <a href="{{ route('landing.deadlines.index') }}" class="btn btn-danger">Kembali</a>
            </div>
        </form>
    </div>
@endsection
