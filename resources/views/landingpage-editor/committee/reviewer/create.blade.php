@extends('layouts.app')

@section('title', 'Add Reviewer Committee')

@section('content')
<div class="container card p-4">
    <h2 class="fs-5">Add Reviewer Committee</h2>
    <hr class="border border-secondary">

    <form action="{{ route('landing.reviewer.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="name" class="form-label fw-bold">Name</label>
            <input type="text" class="form-control" id="name" name="name" 
                   placeholder="Enter full name" required>
        </div>
        
        <div class="mb-3">
            <label for="institution" class="form-label fw-bold">Institution</label>
            <input type="text" class="form-control" id="institution" name="institution" 
                   placeholder="Enter institution name" required>
        </div>

        <div class="mb-3">
            <label for="country" class="form-label fw-bold">Country</label>
            <input type="text" class="form-control" id="country" name="country" 
                   placeholder="Enter country" required>
        </div>

        <div class="mb-3">
            <label for="year" class="form-label fw-bold">Year</label>
            <input type="number" id="year" name="year" class="form-control" 
                   min="2000" max="{{ date('Y') }}" value="{{ date('Y') }}" 
                   placeholder="Enter year" required>
        </div>
        
        <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Add</button>
            <a href="{{ route('landing.reviewer.index') }}" class="btn btn-danger">Back</a>
        </div>
    </form>
</div>
@endsection
