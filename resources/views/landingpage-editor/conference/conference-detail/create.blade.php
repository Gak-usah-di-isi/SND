@extends('layouts.app')
@section('title', 'Add Conference Title')
@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Add Conference Title</h4>
                <form action="{{ route('landing.conference-detail.store') }}" method="POST">
                    @csrf

                    <div class="form-group">
                        <label for="title">Title</label>
                        <input type="text" class="form-control @error('title') is-invalid @enderror" name="title"
                            id="title" value="{{ old('title') }}" placeholder="e.g., Rundown The 4th ICASVE 2025"
                            required>
                        @error('title')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="theme">Theme</label>
                        <input type="text" class="form-control @error('theme') is-invalid @enderror" name="theme"
                            id="theme" value="{{ old('theme') }}"
                            placeholder="e.g., International Conference on Applied Science for Vocational Education"
                            required>
                        @error('theme')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="university">University</label>
                        <input type="text" class="form-control @error('university') is-invalid @enderror"
                            name="university" id="university" value="{{ old('university') }}"
                            placeholder="e.g., Hybrid Conference | Faculty of Vocational Studies, Universitas Brawijaya"
                            required>
                        @error('university')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="hosted">Hosted By or Co-Hosted By</label>
                        <input type="text" class="form-control @error('hosted') is-invalid @enderror" name="hosted"
                            id="hosted" value="{{ old('hosted') }}"
                            placeholder="e.g., Co-hosted by State Polytechnic of Batam & State University of Malang"
                            required>
                        @error('hosted')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="date">Date</label>
                        <input type="text" class="form-control @error('date') is-invalid @enderror" name="date"
                            id="date" value="{{ old('date') }}" required>
                        @error('date')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="year">Year</label>
                        <input type="number" class="form-control @error('year') is-invalid @enderror" name="year"
                            id="year" value="{{ old('year', date('Y')) }}" placeholder="e.g., 2025" required>
                        @error('year')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="d-flex gap-2 justify-start">
                        <button type="submit" class="btn btn-success">Add</button>
                        <a href="{{ route('landing.conference-detail.index') }}" class="btn btn-danger">Back</a>
                    </div>

                </form>
            </div>
        </div>
    </div>
@endsection
