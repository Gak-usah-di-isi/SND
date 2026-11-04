@extends('layouts.app')

@section('title', 'Add New Symposium')

@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Add New Symposium</h4>
                <form class="forms-sample" action="{{ route('admin.symposium.store') }}" method="POST">
                    @csrf
                    <div class="form-group">
                        <label for="name">Symposium name</label>
                        <input type="text" class="form-control @error('name') is-invalid @enderror" id="name"
                            name="name" value="{{ old('name') }}" placeholder="Name" required>
                        @error('name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="abbreviation">Symposium abbreviation :
                            <span class="text-muted">Limited to three characters. Example: CHE</span>
                        </label>
                        <input type="text" class="form-control @error('Abbreviation') is-invalid @enderror"
                            id="abbreviation" name="abbreviation" value="{{ old('abbreviation') }}"
                            placeholder="Abbreviation" required>
                        @error('abbreviation')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <button type="submit" class="btn btn-primary mr-2">Submit</button>
                    <a href="{{ route('admin.symposium.index') }}" class="btn btn-light">Cancel</a>
                </form>
            </div>
        </div>
    </div>
@endsection
