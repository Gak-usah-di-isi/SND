@extends('layouts.app')

@section('content')
<div class="container card p-4">
    <h2 class="fs-5">Add Payment Guidelines</h2>
    <hr class="border border-secondary mb-4">
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('landing.payment_guidelines.store') }}" method="POST">
        @csrf

        <div class="mb-3">
            <label class="form-label">Nama Bank</label>
            <input type="text" name="bank_name" class="form-control" placeholder="Contoh: Bank Mandiri, BCA, BNI" value="{{ old('bank_name') }}" required>
            @error('bank_name')
                <small class="text-danger">{{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label class="form-label">Tahun</label>
            <input type="number" name="year" class="form-control" placeholder="Contoh: 2025" value="{{ old('year', date('Y')) }}" required>
            @error('year')
                <small class="text-danger">{{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label class="form-label">Guideline</label>
            <textarea id="guideline-editor" name="guideline" class="form-control" placeholder="Masukkan petunjuk pembayaran di sini..." required>{{ old('guideline') }}</textarea>
            @error('guideline')
                <small class="text-danger">{{ $message }}</small>
            @enderror
        </div>

        {{-- Tombol Sejajar --}}
        <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Simpan</button>
            <a href="{{ route('landing.payment_guidelines.index') }}" class="btn btn-danger">Kembali</a>
        </div>

    </form>
</div>

{{-- CKEditor Script --}}
<script src="https://cdn.ckeditor.com/4.19.0/standard/ckeditor.js"></script>
<script>
    CKEDITOR.config.versionCheck = false;
    CKEDITOR.replace('guideline-editor', {
        height: 300
    });
</script>

@endsection
