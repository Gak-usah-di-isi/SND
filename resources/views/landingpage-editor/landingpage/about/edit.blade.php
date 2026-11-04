@extends('layouts.app')

@section('title', 'Edit About')

@section('content')
    <div class="container card p-4">
        <h2>Edit About</h2>

        <form action="{{ route('landing.abouts.update', $about->id) }}" method="POST" enctype="multipart/form-data"
            id="editAboutForm">
            @csrf
            @method('PUT')
            <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" name="title" class="form-control" value="{{ $about->title }}" required
                    placeholder="Example: About Our Company">
            </div>
            <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea name="content" id="content" class="form-control" rows="5" required
                    placeholder="Example: Our company was founded in 2020 with the vision to provide the best solutions...">{{ $about->content }}</textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Year</label>
                <input type="number" name="year" class="form-control" value="{{ $about->year }}" required
                    min="2024" max="{{ date('Y') }}" placeholder="Example: 2024">
                <small class="form-text text-muted">Year must be between 2024 and {{ date('Y') }}.</small>
            </div>
            <div class="mb-3 d-flex flex-column">
                <label class="form-label">Current Image</label>
                @if ($about->image)
                    <img src="{{ asset('storage/' . $about->image) }}" class="img-fluid mb-3" style="max-width: 400px">
                @else
                    <p class="text-muted">No image uploaded.</p>
                @endif
            </div>
            <div class="mb-3">
                <label class="form-label">New Image (optional)</label>
                <input type="file" name="image" class="form-control" accept=".jpg, .jpeg, .png" id="imageInput">
                <small class="form-text text-muted">
                    Format: JPG, JPEG, PNG | Max Size: 2MB | **Minimum 600x400 px**
                </small>
                <small class="text-danger d-none" id="imageError">Invalid format or image size.</small>
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

            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success" id="submitBtn">Update</button>
                <a href="{{ route('landing.abouts.index') }}" class="btn btn-danger">Cancel</a>
            </div>
        </form>
    </div>

    <style>
        /* Custom CSS to make placeholder text lighter */
        ::placeholder {
            color: #999;
            /* Light gray color */
            opacity: 1;
            /* Ensure full visibility */
        }

        /* For older browsers */
        :-ms-input-placeholder {
            color: #999;
        }

        ::-ms-input-placeholder {
            color: #999;
        }
    </style>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Image validation
            const imageInput = document.getElementById('imageInput');
            const imageError = document.getElementById('imageError');
            const submitBtn = document.getElementById('submitBtn');

            imageInput.addEventListener('change', function() {
                const file = imageInput.files[0];
                if (file) {
                    const fileType = file.type;
                    const fileSize = file.size / 1024 / 1024; // Convert to MB

                    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(fileType) || fileSize > 2) {
                        imageError.innerText = "Invalid format or image size exceeds 2MB.";
                        imageError.classList.remove('d-none');
                        submitBtn.disabled = true;
                    } else {
                        const img = new Image();
                        img.src = URL.createObjectURL(file);
                        img.onload = function() {
                            if (this.width < 600 || this.height < 400) {
                                imageError.innerText = "Minimum image size is 600x400 px.";
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
    <script src="https://cdn.ckeditor.com/4.19.0/standard/ckeditor.js"></script>
    <script>
        CKEDITOR.config.versionCheck = false;
        CKEDITOR.replace('content', {
            height: 200
        });
    </script>
@endsection
