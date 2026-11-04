@extends('layouts.landing')

@section('title', 'Conference Program')

@section('content')

    <div class="container my-5">
        @if ($conferences->count() > 0)
            @foreach ($conferences as $conference)
                <div class="text-center">
                    <h1 class="fw-bold">Conference Program</h1>
                    <p class="fs-5 text-muted">{{ $conference->title }}</p>
                    <p class="fw-bold">({{ $conference->theme }})</p>
                    <p class="text-muted">{{ $conference->university }}</p>
                    <p class="text-muted">{{ $conference->hosted }}</p>
                    <p class="fw-bold">{{ $conference->date }}</p>
                </div>
            @endforeach
        @else
            <div class="text-center">
                <h1 class="fw-bold">Conference Program</h1>
                <p class="fs-5 text-muted">No conference found.</p>
            </div>
        @endif

        @if ($programsByDay->isNotEmpty())
            @foreach ($programsByDay as $day => $programs)
                <div class="mt-5">
                    <h2 class="fw-bold text-center">
                        Day {{ $day }} ({{ \Carbon\Carbon::parse($dates[$day])->format('d, F Y') }})
                    </h2>
                    <div class="table-responsive">
                        <table class="table table-hover rounded-2 overflow-hidden shadow-sm">
                            <thead>
                                <tr>
                                    <th scope="col" class="p-3 text-white" style="background-color:#08005e;">
                                        <i class="bi bi-clock"></i> Time
                                    </th>
                                    <th scope="col" class="p-3 text-white" style="background-color:#08005e;">
                                        <i class="bi bi-journal-text"></i> Program
                                    </th>
                                    <th scope="col" class="p-3 text-white" style="background-color:#08005e;">
                                        <i class="bi bi-person"></i> PIC
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                @if ($programs->isNotEmpty())
                                    @foreach ($programs as $program)
                                        <tr class="align-middle">
                                            <td class="p-3">{{ $program->start_time }} - {{ $program->end_time }}</td>
                                            <td class="p-3">{{ $program->program_name }}</td>
                                            <td class="p-3">{{ $program->pic ?? '-' }}</td>
                                        </tr>
                                    @endforeach
                                @else
                                    <tr>
                                        <td colspan="3" class="text-center">No programs available for this day.</td>
                                    </tr>
                                @endif
                            </tbody>
                        </table>
                    </div>
                </div>
            @endforeach
        @else
            <p class="text-center mt-5">No programs available for this conference.</p>
        @endif
    </div>

@endsection
