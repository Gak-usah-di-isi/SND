@extends('layouts.app')

@section('title', 'Edit Oral Presentation')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="card-title">Edit Symposium for Abstract</h4>
                    <a href="{{ route('admin.oral.index') }}" class="btn btn-secondary btn-sm">Back</a>
                </div>

                <form action="{{ route('admin.oral.update', $abstract->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" class="form-control" id="title" name="title"
                            value="{{ $abstract->title }}" readonly>
                    </div>

                    <div class="mb-3">
                        <label for="symposium_id" class="form-label">Symposium</label>
                        <select class="form-select" id="symposium_id" name="symposium_id" required>
                            @foreach ($symposiums as $symposium)
                                <option value="{{ $symposium->id }}" @if ($abstract->symposium_id == $symposium->id) selected @endif>
                                    {{ $symposium->name }} ({{ $symposium->abbreviation }})
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary">Update Symposium</button>
                </form>
            </div>
        </div>
    </div>
@endsection
