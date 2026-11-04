@extends('layouts.app')

@section('title', 'Add New Theme')

@section('content')
<div class="container card p-4">
    <h2 class="fs-5">Add New Theme</h2>
    <hr class="border border-secondary mb-4">

    <form action="{{ route('landing.themes.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label class="form-label fw-bold">Title</label>
            <input type="text" class="form-control" name="title" placeholder="Enter theme title" required>
        </div>

        <div class="mb-3">
            <label class="form-label fw-bold">Year</label>
            <input type="number" class="form-control" name="year" min="2000" max="{{ date('Y') }}" value="{{ date('Y') }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label fw-bold">Description</label>
            <textarea class="form-control" name="description" id="editor" placeholder="Enter theme description..." required></textarea>
        </div>

        <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Add</button>
            <a href="{{ route('landing.themes.index') }}" class="btn btn-danger">Back</a>
        </div>
    </form>
</div>

<script src="https://cdn.ckeditor.com/4.16.2/standard/ckeditor.js"></script>
<script>
    CKEDITOR.config.versionCheck = false;
    CKEDITOR.replace('editor');
</script>

@endsection
