@extends('layouts.app')
@section('title', 'Edit Conference Table')
@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Edit Conference Table</h4>
                <form action="{{ route('landing.conference-program.update', $program->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="form-group">
                        <label for="year">Year</label>
                        <input type="number" class="form-control @error('year') is-invalid @enderror" name="year"
                            id="year" value="{{ old('year', $program->year) }}" required>
                        @error('year')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="day_number">Day Number</label>
                        <input type="number" class="form-control @error('day_number') is-invalid @enderror"
                            name="day_number" id="day_number" min="1"
                            value="{{ old('day_number', $program->day_number) }}" required>
                        @error('day_number')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="date">Date</label>
                        <input type="date" class="form-control @error('date') is-invalid @enderror" name="date"
                            id="date" value="{{ old('date', $program->date) }}" required>
                        @error('date')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="start_time">Time Start</label>
                        <input type="time" class="form-control @error('start_time') is-invalid @enderror"
                            name="start_time" id="start_time" value="{{ old('start_time', $program->start_time) }}"
                            required>
                        @error('start_time')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="end_time">Time End</label>
                        <input type="time" class="form-control @error('end_time') is-invalid @enderror" name="end_time"
                            id="end_time" value="{{ old('end_time', $program->end_time) }}" required>
                        @error('end_time')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="program_name">Program</label>
                        <input type="text" class="form-control @error('program_name') is-invalid @enderror"
                            name="program_name" id="program_name" value="{{ old('program_name', $program->program_name) }}"
                            placeholder="Opening by MC" required>
                        @error('program_name')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="pic">PIC (optional)</label>
                        <input type="text" class="form-control @error('pic') is-invalid @enderror" name="pic"
                            id="pic" value="{{ old('pic', $program->pic) }}" placeholder="MC UB & MC Batam" required>
                        @error('pic')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="d-flex gap-2">
                        <a href="{{ route('landing.conference-program.index') }}" class="btn btn-secondary">Back</a>
                        <button type="submit" class="btn btn-success">Update</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
@endsection
