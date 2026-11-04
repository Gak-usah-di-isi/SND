@extends('layouts.app')
@section('title', 'Edit Publications Journal')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">EDIT Publications Journal</h2>
        <hr class="border border-secondary">
        <div class="row justify-content-center">
                <form action="{{ route('landing.publications-journal.update', $publications_journal->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf @method('PUT')

                    {{-- Pilihan Jenis Gambar --}}
                    <div class="form-group">
                        <label for="image_type">Image Type</label>
                        <select name="image_type" id="image_type" class="form-control" required>
                            <option value="" disabled>-- Select Image Type --</option>
                            <option value="publications_journal" {{ old('image_type', $publications_journal->image_type) == 'publications_journal' ? 'selected' : '' }}>Publications Journal</option>
                            <option value="hosted_by" {{ old('image_type', $publications_journal->image_type) == 'hosted_by' ? 'selected' : '' }}>Hosted By</option>
                            <option value="co_hosted_by" {{ old('image_type', $publications_journal->image_type) == 'co_hosted_by' ? 'selected' : '' }}>Co-Hosted By</option>
                            <option value="supported_by" {{ old('image_type', $publications_journal->image_type) == 'supported_by' ? 'selected' : '' }}>Supported By</option>
                        </select>
                    </div>

                    {{-- Input Tahun --}}
                    <div class="mb-3">
                        <label for="year">Year</label>
                        <input type="number" name="year" id="year" class="form-control" min="2024" max="{{ date('Y') }}"
                            value="{{ old('year', $publications_journal->year ?? date('Y')) }}" required>
                    </div>

                    {{-- Input Gambar --}}
                    <div class="mb-3">
                        <label for="image_path">Image</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" name="image_path" id="image_path" accept=".png, .jpg, .jpeg">
                                <label class="custom-file-label" for="image_path" id="fileLabel">Choose file</label>
                            </div>
                        </div>
                        <small class="form-text text-muted">
                            Format: JPG, JPEG, PNG | Max Size per file: 2MB | Rekomendasi 300 x 300
                        </small>
                        <small class="text-danger d-none" id="fileError">Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.</small>

                        {{-- Preview Gambar Lama & Baru --}}
                        <div class="mt-3">
                            <p>Current Image:</p>
                            <img id="previewImage" src="{{ asset('storage/' . $publications_journal->image_path) }}" width="100">
                        </div>
                    </div>

                    {{-- Tombol Aksi --}}
                    <button type="submit" class="btn btn-primary">Update</button>
                    <a href="{{ route('landing.publications-journal.index') }}" class="btn btn-danger">Back</a>
                </form>
        </div>
    </div>

    <script>
        document.getElementById('image_path').addEventListener('change', function() {
            var file = this.files[0];
            var fileLabel = document.getElementById('fileLabel');
            var fileError = document.getElementById('fileError');
            var previewImage = document.getElementById('previewImage');

            if (file) {
                var fileName = file.name;
                fileLabel.innerText = fileName;

                // Validasi format file
                var validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
                if (!validExtensions.includes(file.type)) {
                    fileError.classList.remove('d-none');
                    this.value = "";
                    fileLabel.innerText = "Choose file";
                    previewImage.classList.add('d-none');
                } else {
                    fileError.classList.add('d-none');

                    // Preview gambar baru
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        previewImage.src = e.target.result;
                        previewImage.classList.remove('d-none');
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    </script>
@endsection
