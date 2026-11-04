@extends('layouts.app')
@section('title', 'Edit Gallery')
@section('content')
<div class="col-12 grid-margin stretch-card">
    <div class="card">
        <div class="card-body">
            <h4 class="card-title">Edit Gallery</h4>
            <form action="{{ route('landing.gallery.update', $gallery->id) }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <!-- Tampilkan gambar yang sudah ada -->
                <div class="form-group">
                    <label>Current Images</label>
                    <div class="row">
                        @foreach ($gallery->images as $image)
                            <div class="col-md-3 mb-3">
                                <img src="{{ asset('storage/' . $image->image_path) }}" alt="Gallery Image" class="img-thumbnail" style="width: 100%;">
                                <!-- Jika ingin menambahkan fitur hapus individual, bisa tambahkan tombol delete di sini -->
                            </div>
                        @endforeach
                    </div>
                </div>

                <!-- Input untuk menambah gambar baru -->
                <div class="form-group">
                    <label for="images">Add New Images</label>
                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" name="images[]" id="images" multiple>
                            <label class="custom-file-label" for="images" id="fileLabel">Choose files</label>
                        </div>
                    </div>
                    <div id="preview" class="mt-3"></div>
                </div>

                <!-- Input untuk Year -->
                <div class="form-group">
                    <label for="year">Year</label>
                    <input type="number" class="form-control @error('year') is-invalid @enderror" name="year" id="year" required value="{{ $gallery->year }}">
                    @error('year')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>

                <button type="submit" class="btn btn-primary">Update</button>
            </form>
        </div>
    </div>
</div>

<script>
    // Update label dan preview gambar yang dipilih
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
                img.style.marginRight = '10px';
                img.style.marginBottom = '10px';
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });
</script>
@endsection
