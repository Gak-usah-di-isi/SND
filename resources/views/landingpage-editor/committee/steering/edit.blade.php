@extends('layouts.app')

@section('title', 'Edit Steering Committee')

@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Edit Steering Committee</h2>
        <hr class="border border-secondary">
        <div class="row justify-content-center">
            <form action="{{ route('landing.steering.update', $committee->id) }}" method="POST">
                @csrf
                @method('PUT')

                <div class="mb-3">
                    <label class="form-label fw-bold">Name</label>
                    <input type="text" name="name" class="form-control" placeholder="Enter full name" value="{{ old('name', $committee->name) }}" required>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Institution</label>
                    <input type="text" name="institution" class="form-control" placeholder="Enter institution name" value="{{ old('institution', $committee->institution) }}" required>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Country</label>
                    <input type="text" name="country" class="form-control" placeholder="Enter country" value="{{ old('country', $committee->country) }}" required>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Year</label>
                    <input type="number" name="year" class="form-control" min="2000" max="{{ date('Y') }}" value="{{ old('year', $committee->year) }}" placeholder="Enter year" required>
                </div>

                <button type="submit" class="btn btn-success">Update</button>
                <a href="{{ route('landing.steering.index') }}" class="btn btn-danger">Cancel</a>
            </form>
        </div>
    </div>
@endsection
