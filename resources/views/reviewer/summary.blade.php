@extends('layouts.app')

@section('content')
    <div class="main-panel">
        <div class="content-wrapper">
            <div class="row">
                <div class="col-md-12 grid-margin">
                    <div class="row">
                        <div class="col-12 col-xl-8 mb-4 mb-xl-0">
                            <h3 class="font-weight-bold">Welcome {{ auth()->user()->name }}</h3>
                            <h6 class="font-weight-normal mb-0">
                                You are logged in as <span class="text-primary">
                                    {{ ucfirst(auth()->user()->roles->first()->name ?? 'User') }}</span>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 grid-margin stretch-card">
                    <div class="card tale-bg">
                        <div class="card-people">
                            <img src="{{ asset('images/Lab.jpeg') }}" alt="people">
                        </div>
                    </div>
                </div>
                <div class="col-md-6 grid-margin transparent d-flex flex-column justify-content-between">
                    <div class="row">
                        <div class="col-md-6 mb-4 stretch-card transparent">
                            <div class="card text-white card-tale">
                                <div class="card-body">
                                    <p class="mb-4">Review Abstract Completed</p>
                                    <p class="fs-30 mb-2">{{ $countCompletedReviews }}</p>
                                    <p>&nbsp;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-4 stretch-card transparent">
                            <div class="card text-white card-dark-blue">
                                <div class="card-body">
                                    <p class="mb-4">Review Fullpaper Completed</p>
                                    <p class="fs-30 mb-2">{{ $countCompletedPapers }}</p>
                                    <p>&nbsp;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-4 mb-lg-0 stretch-card transparent">
                            <div class="card text-black bg-warning bg-opacity-75">
                                <div class="card-body">
                                    <p class="mb-4">All Abstract</p>
                                    <p class="fs-30 mb-2">{{ $allAbstracts }}</p>
                                    <p>&nbsp;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 stretch-card transparent">
                            <div class="card text-black bg-warning" style="--bs-bg-opacity: .5;">
                                <div class="card-body">
                                    <p class="mb-4">All Fullpaper</p>
                                    <p class="fs-30 mb-2">{{ $allFullPapers }}</p>
                                    <p>&nbsp;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            @if ($reviewerCertificate && $reviewerCertificate->status == 1)
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <a href="{{ asset('storage/' . $reviewerCertificate->certificate_path) }}"
                                        target="_blank">
                                        <i class="fa fa-user-check fa-3x"></i><br>
                                    </a>
                                </h5>
                                <p class="card-text fw-bold">Reviewer Certificate</p>
                                <span class="badge bg-{{ $reviewerCertificate->status == 1 ? 'success' : 'secondary' }}">
                                    {{ $reviewerCertificate->status == 1 ? 'Active' : 'Inactive' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>
@endsection
