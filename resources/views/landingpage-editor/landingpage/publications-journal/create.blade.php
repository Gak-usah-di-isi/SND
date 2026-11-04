@extends('layouts.app')
@section('title', 'New Publications Journal')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">ADD Publications Journal</h2>
        <hr class="border border-secondary">
        <div class="row justify-content-center">
                <form action="{{ route('landing.publications-journal.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label for="image_type">Image Type</label>
                        <select name="image_type" id="image_type" class="form-control" required>
                            <option value="" disabled selected>-- Select Image Type --</option>
                            <option value="publications_journal">Publications Journal</option>
                            <option value="hosted_by">Hosted By</option>
                            <option value="co_hosted_by">Co-Hosted By</option>
                            <option value="supported_by">Supported By</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="image_path">Images</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="image_path[]" id="image_path" required multiple accept=".png, .jpg, .jpeg">
                        </div>
                        <small class="form-text text-muted">
                            Format: JPG, JPEG, PNG | Max Size per file: 2MB | Rekomendasi 300 x 300
                        </small>
                        <small class="text-danger d-none" id="fileError">Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.</small>
                        <div class="mt-3" id="previewContainer"></div>
                    </div>
                    

                    {{-- Tambahkan Input Tahun --}}
                    <div class="form-group">
                        <label for="year">Year</label>
                        <input type="number" class="form-control" name="year" id="year" required 
                               value="{{ old('year', date('Y')) }}" min="2024" max="{{ date('Y') }}">
                    </div>

                    <button type="submit" class="btn btn-success">Save</button>
                    <a href="{{ route('landing.publications-journal.index') }}" class="btn btn-danger">Back</a>
                </form>
        </div>
    </div>

    <script>
        document.getElementById('image_path').addEventListener('change', function() {
            var files = this.files;
            var fileError = document.getElementById('fileError');
            var previewContainer = document.getElementById('previewContainer');
            previewContainer.innerHTML = ""; // Bersihkan preview lama
    
            var validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
            fileError.classList.add('d-none');
    
            Array.from(files).forEach(file => {
                if (!validExtensions.includes(file.type)) {
                    fileError.classList.remove('d-none');
                    return;
                }
    
                var reader = new FileReader();
                reader.onload = function(e) {
                    var img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('img-thumbnail', 'm-1');
                    img.width = 100;
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });
    </script>
@endsection
