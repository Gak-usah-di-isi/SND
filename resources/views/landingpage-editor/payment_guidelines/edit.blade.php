@extends('layouts.app')

@section('content')
<div class="container card p-4">
    <h2 class="fs-5">Edit Payment Guidelines</h2>
    <hr class="border border-secondaary mb-4">

    <form action="{{ route('landing.payment_guidelines.update', $paymentGuideline->id) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label class="form-label">Nama Bank</label>
            <input type="text" name="bank_name" class="form-control" 
                value="{{ old('bank_name', $paymentGuideline->bank_name) }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Tahun</label>
            <input type="number" name="year" class="form-control" 
                value="{{ old('year', $paymentGuideline->year) }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Guideline</label>
            <textarea id="guideline-editor" name="guideline" class="form-control" required>
                {{ old('guideline', $paymentGuideline->guideline) }}
            </textarea>
        </div>

        <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Update</button>
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
