@extends('layouts.app')
@section('title', 'Add Title')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Add Title</h2>
        <hr class="border border-secondary">
        <form action="{{ route('landing.conference-title.store') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" name="title" class="form-control @error('title') is-invalid @enderror" required>
                @error('title')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            <div class="mb-3">
                <label class="form-label">Tema</label>
                <textarea name="description" class="form-control @error('description') is-invalid @enderror" required></textarea>
                @error('description')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            <div class="mb-3">
                <label class="form-label">Year</label>
                <input type="number" name="year" class="form-control @error('year') is-invalid @enderror" required
                    min="2000" max="{{ date('Y') }}" value="{{ date('Y') }}">
                @error('year')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            <div class="d-flex gap-2 align-middle justify-items-center">
                <button type="submit" class="btn btn-success">Save</button>
                <a href="{{ route('landing.conference-title.index') }}" class="btn btn-danger">Back</a>
            </div>
        </form>
    </div>
@endsection
