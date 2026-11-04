@extends('layouts.app')

@section('title', 'Tambah Logo')

@section('content')
    <div class="container card p-4">
        <h2>Tambah Logo</h2>
        <hr class="border border-secondary">
        <form action="{{ route('landing.logos.store') }}" method="POST" enctype="multipart/form-data" id="logoForm">
            @csrf
            <div class="mb-3">
                <label class="form-label">Upload Gambar</label>
                <input type="file" name="image" class="form-control" id="imageInput" required accept=".jpg, .jpeg, .png">
                <small class="form-text text-muted">
                    Format yang diperbolehkan: PNG, JPEG, JPG. Ukuran maksimal 2MB.  
                    **Disarankan ukuran min. 300x300 px (rasio 1:1).**
                </small>
                <small class="text-danger d-none" id="imageError">Format atau ukuran gambar tidak sesuai.</small>
            </div>
            <div class="mb-3">
                <label class="form-label">Tahun</label>
                <input type="number" name="year" class="form-control" required id="yearInput" min="1900" max="{{ date('Y') }}" value="{{ old('year', date('Y')) }}">
            </div>
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" id="submitBtn">Simpan</button>
                <a href="{{ route('landing.logos.index') }}" class="btn btn-secondary">Kembali</a>
            </div>
        </form>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const imageInput = document.getElementById('imageInput');
            const imageError = document.getElementById('imageError');
            const submitBtn = document.getElementById('submitBtn');
            const yearInput = document.getElementById('yearInput');

            // Set tahun default ke tahun saat ini
            yearInput.value = new Date().getFullYear();

            imageInput.addEventListener('change', function () {
                const file = imageInput.files[0];
                if (file) {
                    const fileType = file.type;
                    const fileSize = file.size / 1024 / 1024; // Convert to MB

                    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(fileType) || fileSize > 2) {
                        imageError.classList.remove('d-none');
                        submitBtn.disabled = true;
                    } else {
                        const img = new Image();
                        img.src = URL.createObjectURL(file);
                        img.onload = function () {
                            if (this.width < 300 || this.height < 300) {
                                imageError.innerText = "Ukuran gambar minimal 300x300 px.";
                                imageError.classList.remove('d-none');
                                submitBtn.disabled = true;
                            } else {
                                imageError.classList.add('d-none');
                                submitBtn.disabled = false;
                            }
                        };
                    }
                }
            });
        });
    </script>
@endsection
