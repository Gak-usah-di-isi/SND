@extends('layouts.app')
@section('title', 'New Venue')
@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">New Venue</h4>
                <form action="{{ route('landing.venue.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group mb-3">
                        <label for="venue_name">Venue Name</label>
                        <input type="text" class="form-control" name="venue_name" id="venue_name" required minlength="3" 
                               placeholder="Masukkan nama venue (minimal 3 karakter)">
                        @error('venue_name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="address">Address</label>
                        <input type="text" class="form-control" name="address" id="address" required minlength="5"
                               placeholder="Masukkan alamat lengkap (contoh: Jl. Merdeka No. 10, Jakarta)">
                        @error('address')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label for="date">Date</label>
                        <input type="date" class="form-control" name="date" id="date" required>
                        @error('date')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label for="link_map">Link Map</label>
                        <input type="url" class="form-control" name="link_map" id="link_map" required
                               placeholder="Tempel link lokasi dari Google Maps di sini">
                        @error('link_map')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label for="map">Frame Map</label>
                        <input type="text" class="form-control" name="map" id="map" required
                               placeholder="Masukkan iframe Google Maps">
                        @error('map')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label for="image_path">Image</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" name="image_path" id="image_path" required
                                       accept=".png, .jpg, .jpeg" onchange="previewImage()">
                                <label class="custom-file-label" for="image_path" id="fileLabel">Choose file</label>
                            </div>
                        </div>
                        <small class="form-text text-muted">
                            Format: JPG, JPEG, PNG | Max Size: 2MB
                        </small>
                        @error('image_path')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Preview Image -->
                    <div class="form-group">
                        <img id="imagePreview" src="#" alt="Preview" style="max-width: 300px; display: none; margin-top: 10px; border: 1px solid #ddd; padding: 5px;">
                    </div>

                    @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                   @endif

                   <div class="form-group mb-3">
                    <label for="year">Year</label>
                    <input type="number" class="form-control" name="year" id="year" 
                           value="{{ old('year', date('Y')) }}" required min="2000" max="2100">
                    @error('year')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>
                

                   <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-success" id="submitBtn">Save</button>
                    <a href="{{ route('landing.venue.index') }}" class="btn btn-danger">Cancel</a>
                </div>
                </form>
            </div>
        </div>
    </div>

    <!-- JavaScript untuk Preview Gambar -->
    <script>
        function previewImage() {
            const input = document.getElementById("image_path");
            const fileLabel = document.getElementById("fileLabel");
            const preview = document.getElementById("imagePreview");

            if (input.files && input.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    preview.style.display = "block";
                    preview.src = e.target.result;
                }

                reader.readAsDataURL(input.files[0]);
                fileLabel.textContent = input.files[0].name; // Menampilkan nama file
            } else {
                preview.style.display = "none";
                fileLabel.textContent = "Choose file";
            }
        }
    </script>
@endsection
