@extends('layouts.app')

@section('title', 'Edit Organizing Committee')

@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Edit Organizing Committee</h2>
        <hr class="border border-secondary">

        <div class="row justify-content-center">
            <form action="{{ route('landing.organizing.update', $committee->id) }}" method="POST">
                @csrf
                @method('PUT')

                <div class="mb-3">
                    <label class="form-label fw-bold">Name</label>
                    <input type="text" name="name" class="form-control" value="{{ $committee->name }}" required>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Category</label>
                    <input type="text" name="category" class="form-control" placeholder="Enter category"
                        value="{{ $committee->category }}" required>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Year</label>
                    <input type="number" name="year" class="form-control" min="2000" max="{{ date('Y') }}"
                        value="{{ $committee->year }}" required>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-success">Update</button>
                    <a href="{{ route('landing.organizing.index') }}" class="btn btn-danger">Back</a>
                </div>
            </form>
        </div>
    </div>
@endsection
