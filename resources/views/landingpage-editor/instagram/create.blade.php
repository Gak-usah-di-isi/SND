@extends('layouts.app')
@section('title', 'Add Instagram')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Add Instagram</h2>
        <hr class="border border-secondary">
        
        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('landing.instagram.store') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label for="year" class="form-label">Year</label>
                <input type="number" class="form-control" id="year" name="year" value="{{ old('year', date('Y')) }}" required>
            </div>
            <div class="mb-3">
                <label for="link" class="form-label">Link</label>
                <input type="text" class="form-control" id="link" name="link" placeholder="Contoh: https://www.instagram.com/username" required>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
            <a href="{{ route('landing.instagram.index') }}" class="btn btn-secondary">Back</a>
        </form>
    </div>
@endsection
