@extends('layouts.app')
@section('title', 'Edit Title')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Edit Title</h2>
        <hr class="border border-secondary">
        <form action="{{ route('landing.conference-title.update', $conferenceTitle->id) }}" method="POST">
            @csrf
            @method('PUT')
            <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" name="title" class="form-control @error('title') is-invalid @enderror"
                    value="{{ $conferenceTitle->title }}" required>
                @error('title')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea name="description" class="form-control @error('description') is-invalid @enderror" required>{{ $conferenceTitle->description }}</textarea>
                @error('description')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            <div class="mb-3">
                <label class="form-label">Year</label>
                <input type="number" name="year" class="form-control @error('year') is-invalid @enderror"
                    value="{{ $conferenceTitle->year }}" required min="2000" max="{{ date('Y') }}">
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
