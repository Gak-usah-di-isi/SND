@extends('layouts.app')

@section('title', 'Edit Status Full Paper')

@section('content')
    <div class="container-fluid">
        <div class="card mb-4">
            <div class="card-body">
                <h4 class="card-title">Reviewer Recommendations & Comments</h4>
                @if ($fullpaper->fullPaperReviews->isEmpty())
                    <p class="text-center"><i class="fas fa-exclamation-circle"></i> No reviews available.</p>
                @else
                    @foreach ($fullpaper->fullPaperReviews as $review)
                        <div class="border rounded p-3 mb-3 shadow-sm d-flex align-items-start">
                            <i class="fas fa-user-circle text-primary me-3" style="font-size: 1.8rem;"></i>
                            <div>
                                <h5 class="mb-1">{{ $review->reviewer->name }}</h5>
                                <p class="text-muted mb-1">
                                    <i class="fas fa-check-circle text-success"></i>
                                    <strong>Recommendation:</strong> {{ $review->recommendation ?? 'No recommendation' }}
                                </p>
                                <p class="mb-0">
                                    <i class="fas fa-comment-alt text-secondary"></i>
                                    <strong>Comment:</strong> {{ $review->comment ?? 'No comment' }}
                                </p>
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Edit Status for Full Paper: {{ $fullpaper->title }}</h4>
                <form action="{{ route('reviewer.editor-fullpaper.updateStatus', $fullpaper->id) }}" method="POST"
                    enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label for="status">Choose Status</label>
                        <select class="form-control" name="status" id="status" required>
                            <option value="open" {{ $fullpaper->status == 'open' ? 'selected' : '' }}>Open</option>
                            <option value="under review" {{ $fullpaper->status == 'under review' ? 'selected' : '' }}>Under
                                Review</option>
                            <option value="accepted" {{ $fullpaper->status == 'accepted' ? 'selected' : '' }}>Accepted
                            </option>
                            <option value="revision" {{ $fullpaper->status == 'revision' ? 'selected' : '' }}>Revision
                            </option>
                            <option value="rejected" {{ $fullpaper->status == 'rejected' ? 'selected' : '' }}>Rejected
                            </option>
                        </select>
                    </div>
                    <div class="form-group mt-3">
                        <label for="publication">Publication</label>
                        <select class="form-control @error('publication') is-invalid @enderror" name="publication"
                            id="publication" required>
                            <option value="">-- Select Publication Type --</option>
                            <option value="Journal Publication"
                                {{ (old('publication') ?? $fullpaper->abstract?->publication) == 'Journal Publication' ? 'selected' : '' }}>
                                Journal Publication</option>
                            <option value="Proceedings Indexed in EBSCO"
                                {{ (old('publication') ?? $fullpaper->abstract?->publication) == 'Proceedings Indexed in EBSCO' ? 'selected' : '' }}>
                                Proceedings Indexed in EBSCO</option>
                        </select>
                        @error('publication')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group mt-3">
                        <label for="note">Note (optional)</label>
                        <textarea class="form-control" name="note" id="note" rows="3">{{ old('note', $fullpaper->note) }}</textarea>
                    </div>
                    <div class="form-group mt-3">
                        <label for="similarity_file">Upload Similarity File (PDF, DOC, DOCX, max 2MB)</label>
                        <input type="file" name="similarity_file" class="form-control" accept=".pdf,.doc,.docx">
                        @if ($fullpaper->similarity_file)
                            <a href="{{ asset('storage/' . $fullpaper->similarity_file) }}" target="_blank">View Uploaded
                                File</a>
                        @endif
                    </div>

                    <button type="submit" class="btn btn-sm btn-success">Update Status</button>
                    <a href="{{ url()->previous() }}" class="btn btn-sm btn-light">Cancel</a>
                </form>
            </div>
        </div>
    </div>
@endsection
