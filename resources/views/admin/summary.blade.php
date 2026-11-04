@extends('layouts.app')

@section('title', 'Summary')

@section('content')
    <div class="main-panel">
        <div class="content-wrapper">
            <div class="row">
                <div class="col-md-12 grid-margin">
                    <div class="row ">
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
            <div class="row d-flex align-items-stretch">
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
                                    <p class="mb-4">Total Participants</p>
                                    <p class="fs-30 mb-2">{{ $totalUsers }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-4 stretch-card transparent">
                            <div class="card text-white card-dark-blue">
                                <div class="card-body">
                                    <p class="mb-4">Total Payments Verified</p>
                                    <p class="fs-30 mb-2">Rp {{ number_format($totalAmountPayment, 0, ',', '.') }}</p>
                                    <p>&nbsp;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-4 mb-lg-0 stretch-card transparent">
                            <div class="card text-black bg-warning bg-opacity-75">
                                <div class="card-body">
                                    <p class="mb-4">Total Abstracts Accepted</p>
                                    <p class="fs-30 mb-2">{{ $totalAbstracts }}</p>
                                    <p>&nbsp;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 stretch-card transparent">
                            <div class="card text-black bg-warning" style="--bs-bg-opacity: .5;">
                                <div class="card-body">
                                    <p class="mb-4">Total Symposiums</p>
                                    <p class="fs-30 mb-2">{{ $totalSymposiums }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <p class="card-title">Participants Details</p>
                            <p class="font-weight-500">An overview of user engagement and participation across different
                                roles and attendance types.</p>
                            <div class="d-flex flex-wrap mb-5">
                                <div class="mr-5 mt-3">
                                    <p class="text-muted">Indonesian Presenter</p>
                                    <h3 class="text-primary fs-30 font-weight-medium">
                                        {{ $roleCounts['indonesia-presenter'] ?? 0 }}</h3>
                                </div>
                                <div class="mr-5 mt-3">
                                    <p class="text-muted">Foreign Presenter</p>
                                    <h3 class="text-primary fs-30 font-weight-medium">
                                        {{ $roleCounts['foreign-presenter'] ?? 0 }}</h3>
                                </div>
                                <div class="mt-3 ml-3">
                                    <p class="text-muted">Onsite</p>
                                    <h3 class="text-primary fs-30 font-weight-medium">{{ $onsiteCount }}</h3>
                                </div>
                                <div class="mr-5 mt-3">
                                    <p class="text-muted">Indonesian Participant</p>
                                    <h3 class="text-primary fs-30 font-weight-medium">
                                        {{ $roleCounts['indonesia-participants'] ?? 0 }}</h3>
                                </div>
                                <div class="mt-3 ml-0">
                                    <p class="text-muted">Foreign Participant</p>
                                    <h3 class="text-primary fs-30 font-weight-medium">
                                        {{ $roleCounts['foreign-participants'] ?? 0 }}</h3>
                                </div>
                                <div class="ml-5 mt-3">
                                    <p class="text-muted">Online</p>
                                    <h3 class="text-primary fs-30 font-weight-medium">{{ $onlineCount }}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <p class="card-title">Payment Details</p>
                            <p class="font-weight-500">Overview of payment statuses including verified and unverified
                                payments.</p>
                            <div class="d-flex flex-wrap mb-5">
                                <div class="mr-5 mt-3">
                                    <p class="text-muted">Payment proof uploaded</p>
                                    <h3 class="text-primary fs-30 font-weight-medium">{{ $paymentProofUploaded }}</h3>
                                </div>
                                <div class="mr-5 mt-3">
                                    <p class="text-muted">Verified payment</p>
                                    <h3 class="text-primary fs-30 font-weight-medium">{{ $verifiedPaymentsCount }}</h3>
                                </div>
                                <div class="mr-5 mt-3">
                                    <p class="text-muted">Unverified payment</p>
                                    <h3 class="text-primary fs-30 font-weight-medium">{{ $unverifiedPaymentsCount }}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <p class="card-title mb-0">Abstract</p>
                            <div class="table-responsive mt-4">
                                <div class="list-group">
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <span><i class="fa fa-check-circle text-success"></i> Accepted for ORAL</span>
                                        <span>{{ $acceptedForOral }} <small
                                                class="text-success">({{ $acceptedForOralPaid }} paid)</small></span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <span><i class="fa fa-check-circle text-success"></i> Accepted for POSTER</span>
                                        <span>{{ $acceptedForPoster }} <small
                                                class="text-success">({{ $acceptedForPosterPaid }} paid)</small></span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <span><i class="fa fa-check-circle text-success"></i> Submitted full papers</span>
                                        <span>{{ $submittedFullpaper }}</span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <span><i class="fa fa-check-circle text-success"></i> Full papers under
                                            review</span>
                                        <span>{{ $fullpaperUnderReview }}</span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <span><i class="fa fa-check-circle text-success"></i> Full papers in revision</span>
                                        <span>{{ $fullpaperRevision }}</span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <span><i class="fa fa-check-circle text-success"></i> Full papers accepted</span>
                                        <span>{{ $fullpaperAccepted }}</span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <span><i class="fa fa-check-circle text-success"></i> Full papers rejected</span>
                                        <span>{{ $fullpaperRejected }}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <p class="card-title mb-0">Symposiums</p>
                            <div class="table-responsive mt-4">
                                <div class="list-group">
                                    @foreach ($symposiums as $symposium)
                                        <div class="list-group-item d-flex justify-content-between align-items-center">
                                            <span><i class="fa fa-check-circle text-success"></i>
                                                {{ $symposium->name }}</span>
                                            <span>{{ $symposium->abstracts_count }} <small class="text-muted">(Oral:
                                                    {{ $symposium->oral_presentation_count }}, Poster:
                                                    {{ $symposium->poster_presentation_count }})</small></span>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 grid-margin stretch-card">
                    <div class="card position-relative">
                        <div class="card-body">
                            <div class="carousel detailed-report-carousel position-static pt-2">
                                <div class="carousel-inner">
                                    @foreach ($countryParticipants as $index => $country)
                                        <div class="carousel-item {{ $index == 0 ? 'active' : '' }}">
                                            <div class="row">
                                                <div class="col-md-12 col-xl-6 d-flex flex-column justify-content-center">
                                                    <div class="ml-xl-4 mt-3">
                                                        <p class="card-title">Country Reports</p>
                                                        <h1 class="text-primary">{{ $topCountry->country }}</h1>
                                                        <p class="mb-2 mb-xl-0">
                                                            {{ $topCountry->country }} has the highest number of
                                                            participants and presenters.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 col-xl-6">
                                                    <div class="row">
                                                        <div class="col-md-12 border-right">
                                                            <div class="table-responsive mb-3 mb-md-0 mt-3">
                                                                <table class="table table-borderless report-table">
                                                                    <tbody>
                                                                        @php
                                                                            $colors = [
                                                                                'bg-primary',
                                                                                'bg-warning',
                                                                                'bg-danger',
                                                                                'bg-info',
                                                                                'bg-success',
                                                                                'bg-secondary',
                                                                            ];
                                                                        @endphp
                                                                        @foreach ($countryParticipants as $index => $country)
                                                                            @php
                                                                                $colorClass =
                                                                                    $colors[$index % count($colors)];
                                                                                $progress = $totalUsers
                                                                                    ? min(
                                                                                        100,
                                                                                        ($country->count /
                                                                                            $totalUsers) *
                                                                                            100,
                                                                                    )
                                                                                    : 0;
                                                                            @endphp
                                                                            <tr>
                                                                                <td class="text-muted">
                                                                                    {{ $country->country }}</td>
                                                                                <td>
                                                                                    <h5 class="font-weight-bold mb-0">
                                                                                        {{ $country->count }}</h5>
                                                                                </td>
                                                                                <td class="w-100 px-0">
                                                                                    <div class="progress progress-md mx-4">
                                                                                        <div class="progress-bar {{ $colorClass }}"
                                                                                            role="progressbar"
                                                                                            style="width: {{ $progress }}%"
                                                                                            aria-valuenow="{{ $progress }}"
                                                                                            aria-valuemin="0"
                                                                                            aria-valuemax="100">
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        @endforeach
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
@endsection
