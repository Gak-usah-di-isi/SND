@extends('layouts.app')
@section('title', 'Edit Speaker')

@section('content')
    <div class="container card p-4">
        <h2 class="fw-bold">EDIT Speaker</h2>
        <hr class="border border-secondary">
        <div class="row">
            <form action="{{ route('landing.speakers.update', $speaker->id) }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')

                {{-- Role --}}
                <div class="mb-3">
                    <label for="role" class="fw-bold">Role</label>
                    <select name="role" id="role" class="form-control text-muted" required>
                        <option value="keynote_speaker" {{ $speaker->role == 'keynote_speaker' ? 'selected' : '' }}>
                            Keynote Speaker</option>
                        <option value="invited_speaker" {{ $speaker->role == 'invited_speaker' ? 'selected' : '' }}>
                            Invited Speaker</option>
                    </select>
                    @error('role')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Name --}}
                <div class="mb-3">
                    <label for="name" class="fw-bold">Name</label>
                    <input type="text" class="form-control text-muted" name="name" id="name" required minlength="3"
                           placeholder="Enter speaker's name" value="{{ old('name', $speaker->name) }}">
                    @error('name')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Institution --}}
                <div class="mb-3">
                    <label for="institution" class="fw-bold">Institution</label>
                    <input type="text" class="form-control text-muted" name="institution" id="institution" required minlength="3"
                           placeholder="Enter institution name" value="{{ old('institution', $speaker->institution) }}">
                    @error('institution')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Country --}}
                <div class="mb-3">
                    <label for="country" class="fw-bold">Country</label>
                    <input type="text" class="form-control text-muted" name="country" id="country" required minlength="3"
                           placeholder="Enter country" value="{{ old('country', $speaker->country) }}">
                    @error('country')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Year --}}
                <div class="mb-3">
                    <label for="year" class="fw-bold">Year</label>
                    <input type="number" class="form-control text-muted" name="year" id="year" required 
                           placeholder="Enter year" value="{{ old('year', $speaker->year) }}" min="2000">
                    @error('year')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Image --}}
                <div class="mb-3">
                    <label for="image" class="fw-bold">Image</label>
                    <div class="mb-2">
                        @if ($speaker->image)
                            <img src="{{ asset('storage/' . $speaker->image) }}" alt="Current Image"
                                 class="img-thumbnail" style="max-width: 150px;">
                        @endif
                    </div>
                    <div class="input-group">
                        <input type="file" class="form-control" name="image" id="image" 
                               accept="image/png, image/jpeg, image/jpg">
                    </div>
                    <small class="text-muted">Only PNG, JPEG, JPG. Max size: 2MB. Recommended dimensions: 300x300 px</small>
                    @error('image')
                        <span class="text-danger d-block">{{ $message }}</span>
                    @enderror
                    <div class="mt-2">
                        <img id="previewImage" src="#" alt="Preview" class="img-thumbnail d-none" style="max-width: 150px;">
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-success" id="submitBtn">Update</button>
                    <a href="{{ route('landing.speakers.index') }}" class="btn btn-danger">Cancel</a>
                </div>                  
            </form>
        </div>
    </div>

    {{-- Image Preview & Validation Script --}}
    <script>
        document.getElementById('image').addEventListener('change', function(event) {
            const file = event.target.files[0];
            const maxSize = 2 * 1024 * 1024; // 2MB
            const allowedExtensions = ["image/png", "image/jpeg", "image/jpg"];
            const previewImage = document.getElementById('previewImage');

            if (file) {
                // Validasi format file
                if (!allowedExtensions.includes(file.type)) {
                    alert("Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.");
                    this.value = "";
                    return;
                }

                // Validasi ukuran file
                if (file.size > maxSize) {
                    alert("Ukuran file terlalu besar! Maksimal 2MB.");
                    this.value = "";
                    return;
                }

                // Preview gambar
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.classList.remove("d-none");
                };
                reader.readAsDataURL(file);
            }
        });
    </script>
@endsection
