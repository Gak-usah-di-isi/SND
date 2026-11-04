@extends('layouts.app')

@section('content')
    <div class="main-panel">
        <div class="content-wrapper">
            @if ($user->abstracts->contains('status', 'accepted') && !$user->filePayment)
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Warning!</strong> Your abstract has been <b>accepted</b>, but you have not completed the
                    payment.
                    <a href="{{ route('filepayments.create') }}" class="alert-link">Click here to proceed with payment</a>.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            @endif
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
                                    <p class="mb-4">Payment Status</p>
                                    <p class="fs-30 mb-2" style="font-size: 25px;">
                                        @if ($user->filePayment)
                                            {{ $user->filePayment->status }}
                                        @else
                                            Not Paid
                                        @endif
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-4 stretch-card transparent">
                            <div class="card text-white card-dark-blue">
                                <div class="card-body">
                                    <p class="mb-4">Abstract Status</p>
                                    @php
                                        $abstract = $user->abstracts->first();
                                    @endphp
                                    <p class="fs-30 mb-2" style="font-size: 25px;">
                                        {{ $abstract ? $abstract->status : 'Not Created' }}
                                    </p>
                                    <p>&nbsp;</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-4 mb-lg-0 stretch-card transparent">
                            <div class="card text-black bg-warning bg-opacity-75">
                                <div class="card-body">
                                    <p class="mb-4">Full Paper Status</p>
                                    @php
                                        $fullPaper = optional($abstract)->fullPaper;
                                    @endphp
                                    <p class="fs-30 mb-2" style="font-size: 25px;">
                                        {{ $fullPaper ? $fullPaper->status : 'Not Uploaded' }}
                                    </p>
                                    <p>&nbsp;</p>
                                </div>
                            </div>
                        </div>


                        <div class="col-md-6 stretch-card transparent">
                            <div class="card text-black bg-warning" style="--bs-bg-opacity: .5;">
                                <div class="card-body text-center">
                                    <p class="mb-4">Full Paper</p>
                                    @if ($fullPaper)
                                        <a href="{{ asset('storage/' . $fullPaper->file_path) }}" target="_blank">
                                            <i class="fa fa-download text-primary fa-3x"></i>
                                        </a>
                                    @else
                                        <p class="text-muted">No Full Paper Uploaded</p>
                                    @endif

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            @if ($isFullPaperAccepted)
                <div class="row mb-4">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header bg-info text-white">
                                <strong>Commitment Letter Template</strong>
                            </div>
                            <div class="card-body">
                                <p>
                                    This Commitment Letter template is available for download once your full paper is
                                    accepted.
                                    Please download the template and provide your signature as needed.
                                </p>
                                <a href="{{ \App\Models\Upload::getFilePath('commitment_letter') }}" class="btn btn-primary"
                                    target="_blank">
                                    <i class="fa fa-download"></i> Download Template
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @endif

            @php
                $participantCertificate = $user->certificates->firstWhere('certificate_type', 'participant');
                $presenterCertificate = $user->certificates->firstWhere('certificate_type', 'presenter');
                $firstAbstract = $user->abstracts->first();
            @endphp

            @if (
                ($participantCertificate && $participantCertificate->status == 1) ||
                    ($presenterCertificate && $presenterCertificate->status == 1 && $firstAbstract))
                <div class="row mb-4">
                    @if ($participantCertificate && $participantCertificate->status == 1)
                        <div class="col-md-6">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h5 class="card-title">
                                        @if ($firstAbstract)
                                            <a href="{{ route('abstracts.viewCertificate', ['id' => \Crypt::encrypt($firstAbstract->id), 'type' => 'participant']) }}"
                                                target="_blank">
                                                <i class="fa fa-certificate fa-3x"></i><br>
                                            </a>
                                        @else
                                            <a href="{{ asset('storage/' . $participantCertificate->certificate_path) }}"
                                                target="_blank">
                                                <i class="fa fa-certificate fa-3x"></i><br>
                                            </a>
                                        @endif
                                    </h5>
                                    <p class="card-text fw-bold">Participant Certificate</p>
                                </div>
                            </div>
                        </div>
                    @endif
                    @if ($presenterCertificate && $presenterCertificate->status == 1 && $firstAbstract)
                        <div class="col-md-6">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h5 class="card-title">
                                        <a href="{{ route('abstracts.viewCertificate', ['id' => \Crypt::encrypt($firstAbstract->id), 'type' => 'presenter']) }}"
                                            target="_blank">
                                            <i class="fa fa-file-alt fa-3x"></i><br>
                                        </a>
                                    </h5>
                                    <p class="card-text fw-bold">Presenter Certificate</p>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>
            @endif

        </div>
    </div>
@endsection
