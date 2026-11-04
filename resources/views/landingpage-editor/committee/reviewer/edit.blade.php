@extends('layouts.app')

@section('title', 'Edit Reviewer Committee')

@section('content')
<div class="container card p-4">
    <h2 class="fs-5">Edit Reviewer Committee</h2>
    <hr class="border border-secondary">
    
    <div class="row justify-content-center">
        <form action="{{ route('landing.reviewer.update', $reviewerCommittee->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label class="form-label fw-bold">Name</label>
                <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" 
                    placeholder="Enter full name" value="{{ old('name', $reviewerCommittee->name) }}" required>
                @error('name')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Institution</label>
                <input type="text" name="institution" class="form-control @error('institution') is-invalid @enderror" 
                    placeholder="Enter institution name" value="{{ old('institution', $reviewerCommittee->institution) }}" required>
                @error('institution')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Country</label>
                <input type="text" name="country" class="form-control @error('country') is-invalid @enderror" 
                    placeholder="Enter country" value="{{ old('country', $reviewerCommittee->country) }}" required>
                @error('country')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Year</label>
                <input type="number" name="year" class="form-control @error('year') is-invalid @enderror" 
                    min="2000" max="{{ date('Y') }}" value="{{ old('year', $reviewerCommittee->year) }}" 
                    placeholder="Enter year" required>
                @error('year')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <button type="submit" class="btn btn-success">Update</button>
            <a href="{{ route('landing.reviewer.index') }}" class="btn btn-danger">Cancel</a>
        </form>
    </div>
</div>
@endsection
