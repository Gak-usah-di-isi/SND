@extends('layouts.app')
@section('title', 'Edit Poster')
@section('content')
    <div class="container">
        <h2 class="fw-bold">Edit Poster</h2>
        <a href="{{ route('landing.poster.index') }}" class="btn btn-secondary mb-3">Kembali</a>

        <form action="{{ route('landing.poster.update', $poster->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label class="form-label">Gambar Saat Ini</label><br> 
                <img src="{{ asset('storage/' . $poster->image) }}" width="200" class="img-thumbnail">
            </div>

            <div class="mb-3">
                <label class="form-label">Upload Gambar Baru (Opsional)</label> 
                <input type="file" name="image" id="image" class="form-control" accept="image/png, image/jpeg, image/jpg">
                <small class="text-muted">Only PNG, JPEG, JPG. Max 2MB</small>
                @error('image')
                    <span class="text-danger d-block">{{ $message }}</span>
                @enderror
                <div class="mt-2">
                    <img id="previewImage" src="#" alt="Preview" class="img-thumbnail d-none" style="max-width: 200px;">
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Tahun</label> 
                <input type="number" name="year" class="form-control" value="{{ $poster->year }}" required min="2000" max="{{ date('Y') }}">
                @error('year')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>

            <div class="mb-3">
                <label class="form-label">Link Pendaftaran (Opsional)</label> 
                <input type="url" name="link" class="form-control" value="{{ $poster->link }}" placeholder="https://example.com">
                @error('link')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>

            <div class="d-flex justify-content-between">
                <a href="{{ route('landing.poster.index') }}" class="btn btn-secondary">Kembali</a>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </form>
    </div>

    <script>
        document.getElementById('image').addEventListener('change', function(event) {
            const file = event.target.files[0];

            // Validasi format file
            const allowedExtensions = ["image/png", "image/jpeg", "image/jpg"];
            if (file && !allowedExtensions.includes(file.type)) {
                alert("Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.");
                this.value = "";
                return;
            }

            // Preview poster
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('previewImage');
                    preview.src = e.target.result;
                    preview.classList.remove('d-none');
                };
                reader.readAsDataURL(file);
            }
        });
    </script>
@endsection
