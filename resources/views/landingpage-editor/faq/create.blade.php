@extends('layouts.app')
@section('title', 'Add FAQ')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">ADD FAQ</h2>
        <hr class="border border-secondary">
        <div class="row justify-content-center">
            <form action="{{ route('landing.faq.store') }}" method="POST">
                @csrf
                <div class="mb-3">
                    <label for="title">Title</label>
                    <input type="text" class="form-control" name="title" id="title" 
                           placeholder="Enter FAQ title..." required>
                    @error('title')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                <div class="mb-3">
                    <label for="description">Description</label>
                    <textarea class="form-control" name="description" id="description" 
                              placeholder="Enter FAQ description..." required></textarea>
                    @error('description')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Input Tahun --}}
                <div class="mb-3">
                    <label for="year">Year</label>
                    <input type="number" class="form-control" name="year" id="year" 
                           value="{{ old('year', date('Y')) }}" 
                           placeholder="Enter year (e.g. 2025)" required>
                    @error('year')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>
            
                <button type="submit" class="btn btn-primary">Save</button>
                <a href="{{ route('landing.faq.index') }}" class="btn btn-danger">Back</a>
            </form>
        </div>
    </div>
@endsection
