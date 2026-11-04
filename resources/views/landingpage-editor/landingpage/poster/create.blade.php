@extends('layouts.app')
@section('title', 'Add Poster')
@section('content')
    <div class="container card p-4">
        <h2 class="fw-bold">Tambah Poster</h2>

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('landing.poster.store') }}" method="POST" enctype="multipart/form-data">
            @csrf 

            <div class="mb-3">
                <label for="image" class="form-label">Upload Poster</label> 
                <input type="file" name="image" id="image" class="form-control" required accept="image/png, image/jpeg, image/jpg">
                <small class="text-muted">Only PNG, JPEG, JPG. Max 2MB</small>
                @error('image')
                    <span class="text-danger d-block">{{ $message }}</span>
                @enderror
                <div class="mt-2">
                    <img id="previewImage" src="#" alt="Preview" class="img-thumbnail d-none" style="max-width: 200px;">
                </div>
            </div>

            <div class="mb-3">
                <label for="year" class="form-label">Year</label> 
                <input type="number" name="year" id="year" class="form-control" required min="2000" max="{{ date('Y') }}" value="{{ date('Y') }}">
                @error('year')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>

            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success" id="submitBtn">Add</button>
                <a href="{{ route('landing.poster.index') }}" class="btn btn-danger">Cancel</a>
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
