@extends('layouts.app')
@section('title', 'New Conference Table')
@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">New Conference Table</h4>
                <form action="{{ route('landing.conference-program.store') }}" method="POST">
                    @csrf

                    <div class="form-group">
                        <label for="year">Year</label>
                        <input type="text" class="form-control" id="year_display" value="{{ now()->year }}">
                        <input type="hidden" name="year" id="year" value="{{ now()->year }}">

                    </div>

                    <div class="form-group">
                        <label for="day_number">Day Number</label>
                        <input type="number" class="form-control @error('day_number') is-invalid @enderror"
                            name="day_number" id="day_number" min="1" value="{{ old('day_number') }}" required>
                        @error('day_number')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="date">Date</label>
                        <input type="date" class="form-control @error('date') is-invalid @enderror" name="date"
                            id="date" value="{{ old('date') }}" required>
                        @error('date')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="start_time">Time Start</label>
                        <input type="time" class="form-control @error('start_time') is-invalid @enderror"
                            name="start_time" id="start_time" value="{{ old('start_time') }}" required>
                        @error('start_time')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="end_time">Time End</label>
                        <input type="time" class="form-control @error('end_time') is-invalid @enderror" name="end_time"
                            id="end_time" value="{{ old('end_time') }}" required>
                        @error('end_time')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="program_name">Program</label>
                        <input type="text" class="form-control @error('program_name') is-invalid @enderror"
                            name="program_name" id="program_name" placeholder="Example: Opening by MC"
                            value="{{ old('program_name') }}" required>
                        @error('program_name')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="pic">PIC (optional)</label>
                        <input type="text" class="form-control @error('pic') is-invalid @enderror" name="pic"
                            id="pic" placeholder="Example: MC UB & MC Batam" value="{{ old('pic') }}">
                        @error('pic')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="d-flex gap-2 justify-start">
                        <a href="{{ route('landing.conference-program.index') }}" class="btn btn-secondary">Back</a>
                        <button type="submit" class="btn btn-success">Submit</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
@endsection
