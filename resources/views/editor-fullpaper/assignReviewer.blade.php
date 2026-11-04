@extends('layouts.app')

@section('title', 'Assign Reviewer for Full Paper')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Assign Reviewer for Full Paper: {{ $fullpaper->title }}</h4>
                <form action="{{ route('reviewer.editor-fullpaper.assignReviewer', $fullpaper->id) }}" method="POST">
                    @csrf
                    <div class="form-group">
                        <label for="reviewer_1_id">Select Reviewer 1</label>
                        <select class="form-control" name="reviewer_1_id" id="reviewer_1_id" required>
                            <option value="">-- Select Reviewer 1 --</option>
                            @foreach ($reviewers as $reviewer)
                                <option value="{{ $reviewer->id }}"
                                    {{ old('reviewer_1_id', $assignedReviewer1) == $reviewer->id ? 'selected' : '' }}>
                                    {{ $reviewer->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="reviewer_2_id">Select Reviewer 2 (Optional)</label>
                        <select class="form-control" name="reviewer_2_id" id="reviewer_2_id">
                            <option value="">-- Select Reviewer 2 --</option>
                            @foreach ($reviewers as $reviewer)
                                <option value="{{ $reviewer->id }}"
                                    {{ old('reviewer_2_id', $assignedReviewer2) == $reviewer->id ? 'selected' : '' }}>
                                    {{ $reviewer->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="reviewer_3_id">Select Reviewer 3 (Optional)</label>
                        <select class="form-control" name="reviewer_3_id" id="reviewer_3_id">
                            <option value="">-- Select Reviewer 3 --</option>
                            @foreach ($reviewers as $reviewer)
                                <option value="{{ $reviewer->id }}"
                                    {{ old('reviewer_3_id', $assignedReviewer3 ?? null) == $reviewer->id ? 'selected' : '' }}>
                                    {{ $reviewer->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>


                    <button type="submit" class="btn btn-sm btn-success">Assign Reviewers</button>
                    <a href="{{ url()->previous() }}" class="btn btn-sm btn-light">Cancel</a>
                </form>
            </div>
        </div>
    </div>
@endsection
