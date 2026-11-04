@extends('layouts.app')

@section('title', 'Conference Program')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white text-center py-2">
                <h5 class="mb-0">Conference Program</h3>
            </div>
            <div class="card-body">
                <div class="row g-3 justify-content-center">

                    <div class="col-md-5">
                        <a href="{{ route('landing.conference-detail.index') }}" class="btn btn-danger w-100 py-2">
                            <i class="fa-solid fa-heading"></i> Conference Title
                        </a>
                    </div>
                    
                    <div class="col-md-5">
                        <a href="{{ route('landing.conference-program.index') }}" class="btn btn-danger w-100 py-2">
                            <i class="fa-solid fa-table"></i> Conference Table
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </div>
@endsection