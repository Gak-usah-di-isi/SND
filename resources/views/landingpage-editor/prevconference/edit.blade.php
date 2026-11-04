@extends('layouts.app')
@section('title', 'Edit Previous Conference')
@section('content') <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Edit Previous Conference</h4>
                <form action="{{ route('landing.prevconference.update', $prevconference->id) }}" method="POST"
                    enctype="multipart/form-data"> @csrf @method('PUT') <div class="form-group"> <label
                            for="title">Title</label> <input type="text"
                            class="form-control @error('title') is-invalid @enderror" name="title" id="title"
                            value="{{ old('title', $prevconference->title) }}" placeholder="Example: ICASVE 2025" required>
                        @error('title')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group"> <label for="description">Theme</label>
                        <textarea class="form-control @error('description') is-invalid @enderror" name="description" id="description"
                            placeholder="Example: Entrepreneurship, Creativity, and AI-driven Innovation in the Digital Era" rows="3"
                            required>{{ old('description', $prevconference->description) }}</textarea> @error('description')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group"> <label for="keynote">Keynote</label>
                        <textarea class="form-control @error('keynote') is-invalid @enderror" name="keynote" id="editor"
                            placeholder="Example: Dr. John Doe" required>
                  {{ old('keynote', $prevconference->keynote) }}
              </textarea>
                        @error('keynote')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group"> <label for="date">Date</label> <input type="text"
                            class="form-control @error('date') is-invalid @enderror" name="date" id="date"
                            value="{{ old('date', $prevconference->date) }}" required> @error('date')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group"> <label for="location">Location</label> <input type="text"
                            class="form-control @error('location') is-invalid @enderror" name="location" id="location"
                            value="{{ old('location', $prevconference->location) }}"
                            placeholder="Example: Jl. Veteran 12-14 Malang City, East Java Indonesia" required>
                        @error('location')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group"> <label for="image">Poster</label> <input type="file"
                            class="form-control @error('image') is-invalid @enderror" name="image" id="image"
                            accept="image/*"> @error('image')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    @if ($prevconference->image)
                        <div class="form-group"> <label>Poster</label><br> <img
                                src="{{ asset('storage/' . $prevconference->image) }}" alt="Image" width="200">
                        </div>
                    @endif
                    <div class="form-group">
                        <label for="pdf">Link PDF (Optional)</label>
                        <input type="text" class="form-control @error('pdf') is-invalid @enderror" name="pdf"
                            id="pdf" value="{{ old('pdf', $prevconference->pdf) }}" accept="application/pdf">
                        @error('pdf')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    @if ($prevconference->pdf)
                        <div class="form-group">
                            <label>Current Link PDF</label><br>
                            <a href="{{ $prevconference->pdf }}" target="_blank">Download PDF</a>
                        </div>
                    @endif

                    <div class="form-group">
                        <label for="year">Year</label>
                        <input type="number" class="form-control @error('year') is-invalid @enderror" name="year"
                            id="year" value="{{ old('year', $prevconference->year) }}" required>
                        @error('year')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="d-flex gap-2 justify-start"> <button type="submit" class="btn btn-success">Update
                            Conference</button> <a href="{{ route('landing.prevconference.index') }}"
                            class="btn btn-danger">Back</a> </div>
                </form>
            </div>
        </div>
    </div>
    <script>
        CKEDITOR.config.versionCheck = false;

        CKEDITOR.replace('editor', {
            height: 200,
        });
    </script>
@endsection
