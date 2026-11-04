@extends('layouts.landing')

@section('title', 'Fullpaper')

@section('content')

    <!-- Main Content -->
    <div class="container mt-4">
        <div class="row">
            <!-- Konten Utama -->
            <div class="col-lg-9">
                <!-- Breadcrumb -->
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="{{ route('home') }}">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Fullpaper Submissions Guidelines</li>
                    </ol>
                </nav>

                <!-- Judul Halaman -->
                <h2 class="fw-bold mb-3 title-submission">Fullpaper Submission Guidelines</h2>
                <p>As part of the submission process, authors are required to check off their submission’s compliance with
                    all of the following items, and submissions may be returned to authors that do not adhere to these
                    guidelines.</p>

                    @if (!$guideline)
                    <div class="alert alert-warning">
                        No fullpaper guidelines available.
                    </div>
                @else
                    <div class="card">
                        <div class="card-body">
                            {!! $guideline->content !!}
                        </div>
                    </div>
                
                    <!-- Tombol Download Paper Template -->
                    @if ($guideline->pdf_file)
                        <div class="text-start mt-3">
                            <a href="{{ asset('storage/' . $guideline->pdf_file) }}" class="btn text-white"
                                style="background: linear-gradient(to right, navy, orange);" target="_blank">
                                Download Paper Template
                            </a>
                        </div>
                    @endif
                @endif
                
            </div>
        </div>
    </div>
@endsection
