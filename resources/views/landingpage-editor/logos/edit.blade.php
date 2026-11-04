@extends('layouts.app')

@section('title', 'Edit Logo')

@section('content')
    <div class="container card p-4">
        <h2>Edit Logo</h2>
        <hr class="border border-secondary">
        <form action="{{ route('landing.logos.update', $logo->id) }}" method="POST" enctype="multipart/form-data" id="logoForm">
            @csrf @method('PUT')
            <div class="mb-3">
                <label class="form-label">Gambar Saat Ini</label><br>
                <img src="{{ asset('storage/' . $logo->image) }}" width="150">
            </div>
            <div class="mb-3">
                <label class="form-label">Upload Gambar Baru (Opsional)</label>
                <input type="file" name="image" class="form-control" id="imageInput" accept=".jpg, .jpeg, .png">
                <small class="text-danger d-none" id="imageError">Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.</small>
            </div>
            <div class="mb-3">
                <label class="form-label">Tahun</label>
                <input type="number" name="year" class="form-control" required id="yearInput" value="{{ $logo->year }}">
            </div>
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" id="submitBtn">Update</button>
                <a href="{{ route('landing.logos.index') }}" class="btn btn-secondary">Kembali</a>
            </div>
        </form>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const imageInput = document.getElementById('imageInput');
            const imageError = document.getElementById('imageError');
            const submitBtn = document.getElementById('submitBtn');

            imageInput.addEventListener('change', function () {
                const file = imageInput.files[0];
                if (file) {
                    const fileType = file.type;
                    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(fileType)) {
                        imageError.classList.remove('d-none');
                        submitBtn.disabled = true;
                    } else {
                        imageError.classList.add('d-none');
                        submitBtn.disabled = false;
                    }
                }
            });
        });
    </script>
@endsection
