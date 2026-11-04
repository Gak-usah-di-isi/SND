@extends('layouts.app')

@section('title', 'Review Full Paper')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Review Full Paper: {{ $fullpaper->title }}</h4>
                <form action="{{ route('reviewer.review-fullpaper.storeReview', $fullpaper->id) }}" method="POST">
                    @csrf
                    <div class="form-group">
                        <label for="recommendation">Recommendation</label>
                        <select class="form-control" name="recommendation" id="recommendation" required>
                            <option value="Publish"
                                {{ old('recommendation', $fullpaperReview->recommendation ?? '') == 'Publish' ? 'selected' : '' }}>
                                Published</option>
                            <option value="Poster"
                                {{ old('recommendation', $fullpaperReview->recommendation ?? '') == 'Poster' ? 'selected' : '' }}>
                                Poster</option>
                            <option value="Reject"
                                {{ old('recommendation', $fullpaperReview->recommendation ?? '') == 'Reject' ? 'selected' : '' }}>
                                Reject</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="comment">Comment</label>
                        <textarea class="form-control" id="comment" name="comment" rows="5">{{ old('comment', $fullpaperReview->comment ?? '') }}</textarea>
                    </div>

                    <button type="submit" class="btn btn-sm btn-success">Submit Review</button>
                    <a href="{{ route('reviewer.review-fullpaper.index') }}" class="btn btn-sm btn-light">Cancel</a>
                </form>
            </div>
        </div>
    </div>
@endsection
