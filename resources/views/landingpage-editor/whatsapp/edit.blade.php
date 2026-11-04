@extends('layouts.app')
@section('title', 'Edit Whatsapp')
@section('content')
    <div class="container mt-4">
        <h2 class="text-center fw-bold">Edit Whatsapp</h2>
        <hr class="border border-success">
        
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

        <form action="{{ route('landing.whatsapp.update', $whatsapp->id) }}" method="POST">
            @csrf
            @method('PUT')
            <div class="mb-3">
                <label for="nomor" class="form-label">Number</label>
                <input type="text" class="form-control" id="nomor" name="nomor" 
                    value="{{ old('nomor', $whatsapp->nomor) }}" required 
                    placeholder="Contoh: 6281234567890">
                <p class="text-muted">*Nomor harus diawali dengan 62 dan terdiri dari minimal 10 digit.</p>
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
            <a href="{{ route('landing.whatsapp.index') }}" class="btn btn-secondary">Back</a>
        </form>
    </div>
@endsection
