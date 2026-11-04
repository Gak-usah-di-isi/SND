@extends('layouts.app')
@section('title', 'Edit FAQ')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">EDIT FAQ</h2>
        <hr class="border border-secondary">
        <div class="row justify-content-center">
                <form action="{{ route('landing.faq.update', $faq->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label for="title">Title</label>
                        <input type="text" class="form-control" name="title" id="title"
                            value="{{ old('title', $faq->title) }}" required placeholder="Enter FAQ title">
                        @error('title')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label for="description">Description</label>
                        <textarea class="form-control" name="description" id="description" required placeholder="Enter FAQ description">{{ old('description', $faq->description) }}</textarea>
                        @error('description')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label for="year">Year</label>
                        <input type="number" class="form-control" name="year" id="year" 
                            value="{{ old('year', $faq->year ?? date('Y')) }}" required>
                        @error('year')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <button type="submit" class="btn btn-success">Update</button>
                    <a href="{{ route('landing.faq.index') }}" class="btn btn-danger">Back</a>
                </form>
        </div>
    </div>
@endsection
