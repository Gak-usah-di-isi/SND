@extends('layouts.app')

@section('title', 'Detail Participants')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <header>
                    <p class="Card-title">Detail Participants</p>
                </header>
                <section class="border rounded mb-4">
                    <header class="Card-title bg-light py-3 px-3 mb-0">
                        <h5 class="mb-0">Personal Information</h5>
                    </header>
                    <div class="px-3 py-3">
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Name:</strong> {{ $user->name }}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Institution:</strong> {{ $user->institution }}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Email:</strong> {{ $user->email }}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Phone:</strong> {{ $user->phone_number }}</p>
                            </div>

                            <div class="col-md-6">
                                <p><strong>Role:</strong>
                                    @foreach ($user->roles as $role)
                                        {{ $role->display_name }}
                                    @endforeach
                                </p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Attendance:</strong> <span class="text-success">{{ $user->attendance }}</span>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Country:</strong> {{ $user->country }}
                                </p>
                            </div>

                        </div>
                    </div>
                </section>
                <section class="border rounded">
                    <header class="Card-title bg-light py-3 px-3 mb-0">
                        <h5 class="mb-0">Information</h5>
                    </header>
                    @foreach ($user->abstracts as $abstract)
                        <div class="px-3 py-3">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <p class="mb-1"><strong>Abstract</strong></p>
                                    <a href="{{ route('admin.abstracts-participant.show', $abstract->id) }}"
                                        class="btn btn-outline-primary btn-sm">View Abstract</a>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <p class="mb-1"><strong>Decision:</strong></p>
                                    <span
                                        class="badge 
                                            @if ($abstract->status == 'accepted') bg-success
                                            @elseif ($abstract->status == 'rejected') bg-danger
                                            @else bg-warning @endif">
                                        {{ ucfirst($abstract->status) }}
                                    </span>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <p class="mb-1"><strong>LETTER OF ACCEPTANCE</strong></p>
                                    <a href="{{ route('admin.abstracts-participant.acceptancePdf', $abstract->id) }}"
                                        target="_blank" class="btn btn-outline-primary btn-sm">View LOA</a>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <p class="mb-1"><strong>Paper</strong></p>
                                    @if ($abstract->fullPaper && $abstract->fullPaper->file_path)
                                        <a href="{{ asset('storage/' . $abstract->fullPaper->file_path) }}" target="_blank"
                                            class="d-block mt-1">
                                            <i class="fa fa-download text-primary fa-2x mt-2"></i>
                                        </a>
                                    @else
                                        <p class="text-muted">No Full Paper Uploaded</p>
                                    @endif

                                </div>
                                <div class="col-md-6 mb-3">
                                    <p class="mb-1"><strong>Status Payment</strong></p>
                                    <span
                                        class="badge 
                                        @if ($user->filePayment && $user->filePayment->status == 'verified') badge-success
                                        @elseif ($user->filePayment && $user->filePayment->status == 'pending') badge-warning
                                        @else badge-danger @endif">
                                        {{ $user->filePayment->status ?? 'Not Submitted' }}
                                    </span>
                                </div>

                            </div>
                        </div>
                    @endforeach
                </section>
                <div class="text-end mt-3">
                    <a href="{{ route('admin.participant.index') }}" class="btn btn-secondary">
                        <i class="fa fa-arrow-left"></i> Back
                    </a>
                </div>
            </div>
        </div>
    </div>
@endsection
