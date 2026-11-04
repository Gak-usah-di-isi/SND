@extends('layouts.app')

@section('title', 'Committee')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white text-center py-2">
                <h5 class="mb-0">Submission Guidelines</h5>
            </div>
            <div class="card-body">
                <div class="row g-3 justify-content-center">

                    <div class="col-md-4">
                        <a href="{{ route('landing.abstract-guidelines.index') }}" class="btn btn-danger w-100 py-2">
                            <i class="fa-solid fa-chalkboard-teacher"></i> Abstract Submission
                        </a>
                    </div>

                    <div class="col-md-4">
                        <a href="{{ route('landing.fullpaper-guidelines.index') }}" class="btn btn-warning w-100 py-2">
                            <i class="fa-solid fa-search"></i> Full Paper Submission
                        </a>
                    </div>

                    <div class="col-md-4">
                        <a href="{{ route('landing.presentation-guidelines.index') }}" class="btn btn-success w-100 py-2">
                            <i class="fa-solid fa-users"></i> Presentation Submission
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </div>
@endsection