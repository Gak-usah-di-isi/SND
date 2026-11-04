@extends('layouts.app')
@section('title', 'Add Whatsapp')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Add Whatsapp</h2>
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

        <form action="{{ route('landing.whatsapp.store') }}" method="POST">
            @csrf
            <!-- Input Nomor Whatsapp -->
            <div class="mb-3">
                <label for="nomor" class="form-label">Number</label>
                <input type="text" class="form-control" id="nomor" name="nomor" 
                    placeholder="Contoh: 6281234567890" required>
                <p class="text-muted">*Nomor harus diawali dengan 62 dan terdiri dari minimal 10 digit.</p>
            </div>

            <!-- Input Tahun -->
            <div class="mb-3">
                <label for="year" class="form-label">Year</label>
                <input type="number" class="form-control" id="year" name="year" 
                    value="{{ old('year', date('Y')) }}" required>
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
            <a href="{{ route('landing.whatsapp.index') }}" class="btn btn-secondary">Back</a>
        </form>
    </div>
@endsection
