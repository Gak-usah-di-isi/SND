@extends('layouts.app')

@section('title', 'Edit Abstract Guideline')

@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Edit Abstract Guideline</h2>
        <hr class="border border-secondary mb-4">

        <form action="{{ route('landing.abstract-guidelines.update', $abstractGuideline->id) }}" method="POST"
            enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label for="year" class="form-label fw-bold">Tahun</label>
                <input type="number" name="year" class="form-control" value="{{ $abstractGuideline->year }}" required>
            </div>

            <div class="mb-3">
                <label for="content" class="form-label fw-bold">Guideline</label>
                <textarea name="content" id="editor" class="form-control">{{ $abstractGuideline->content }}</textarea>
            </div>

            <div class="mb-3">
                <label for="pdf_file" class="form-label fw-bold">Upload Template Paper (PDF)</label>
                <input type="file" name="pdf_file" class="form-control">
                <small class="form-text text-muted">
                    Format: PDF | Max Size: 2MB
                </small>
            </div>

            @if ($abstractGuideline->pdf_file)
                <div class="mb-3">
                    <label class="form-label fw-bold">File PDF Saat Ini:</label><br>
                    <a href="{{ asset('storage/' . $abstractGuideline->pdf_file) }}" target="_blank" class="btn btn-sm btn-outline-success px-2">Download File</a>
                </div>
            @endif

            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">Update</button>
                <a href="{{ route('landing.abstract-guidelines.index') }}" class="btn btn-danger">Back</a>
            </div>
        </form>
    </div>

    {{-- CKEditor --}}
    <script src="https://cdn.ckeditor.com/4.16.2/standard/ckeditor.js"></script>
    <script>
        CKEDITOR.config.versionCheck = false;
        CKEDITOR.replace('editor');
    </script>
@endsection
