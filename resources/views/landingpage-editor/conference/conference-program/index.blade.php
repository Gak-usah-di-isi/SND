@extends('layouts.app')

@section('title', 'Conference Program')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="card-title mb-0">Conference Table</h4>
                            <a href="{{ route('landing.conference-program.create') }}" class="btn btn-success btn-sm">
                                <i class="fas fa-plus"></i> New Table
                            </a>
                        </div>

                        <form method="GET" action="{{ route('landing.conference-program.index') }}" class="mb-3">
                            <div class="row g-2">
                                <div class="col-md-2">
                                    <select name="year" class="form-select w-fit" onchange="this.form.submit()">
                                        <option value="">Select Year</option>
                                        @foreach ($years as $year)
                                            <option value="{{ $year }}"
                                                {{ request('year') == $year ? 'selected' : '' }}>
                                                {{ $year }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                        </form>

                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead class="table-dark text-center">
                                    <tr>
                                        <th style="width: 5%;">No</th>
                                        <th style="width: 15%;">Time</th>
                                        <th style="width: 35%;">Program</th>
                                        <th style="width: 5%;">Day</th>
                                        <th style="width: 10%;">Date</th>
                                        <th style="width: 10%;">Year</th>
                                        <th style="width: 20%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse ($programs as $program)
                                        <tr class="text-center">
                                            <td>{{ $loop->iteration }}</td>
                                            <td>{{ $program->start_time }} - {{ $program->end_time }}</td>
                                            <td class="text-start">{{ $program->program_name }}</td>
                                            <td>{{ $program->day_number }}</td>
                                            <td>{{ $program->date }}</td>
                                            <td>{{ $program->year }}</td>
                                            <td>
                                                <a href="{{ route('landing.conference-program.edit', $program->id) }}"
                                                    class="btn btn-warning btn-sm">
                                                    <i class="fas fa-edit"></i> Edit
                                                </a>
                                                <form
                                                    action="{{ route('landing.conference-program.destroy', $program->id) }}"
                                                    method="POST" class="d-inline"
                                                    onsubmit="return confirm('Are you sure?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="btn btn-danger btn-sm">
                                                        <i class="fas fa-trash"></i> Delete
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="5" class="text-center text-muted">No conference programs
                                                available.</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-3">
                            {{ $programs->links() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
