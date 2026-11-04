@extends('layouts.app')
@section('title', 'New Gallery')
@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">New Gallery</h4>
                <form action="{{ route('landing.gallery.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label for="images">Images</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" name="images[]" id="images" accept="image/*" multiple required>
                                <label class="custom-file-label" for="images" id="fileLabel">Choose files</label>
                            </div>
                        </div>
                        <small class="form-text text-muted">
                            Format: JPG, JPEG, PNG | Max Size: 2MB
                        </small>
                        <small class="text-danger d-none" id="fileError">Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.</small>
                        <div id="preview" class="mt-3"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="year">Year</label>
                        <input type="number" class="form-control @error('year') is-invalid @enderror"  name="year" 
                            id="year" required>
                        @error('year')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <button type="submit" class="btn btn-success">Submit</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('images').addEventListener('change', function(event) {
            let files = event.target.files;
            let fileLabel = document.getElementById('fileLabel');
            let previewContainer = document.getElementById('preview');

            fileLabel.innerText = files.length > 0 ? `${files.length} files selected` : 'Choose files';
            previewContainer.innerHTML = ''; // Clear previous previews

            Array.from(files).forEach(file => {
                let reader = new FileReader();
                reader.onload = function(e) {
                    let img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '100px';
                    img.style.margin = '5px';
                    img.classList.add('rounded');
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });
    </script>
@endsection
