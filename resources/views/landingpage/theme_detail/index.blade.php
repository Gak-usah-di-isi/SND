@extends('layouts.landing')
@section('title', 'Theme Detail')
@section('content')

<div id="hero-theme-detail" class="py-5 content-theme">
    <div class="container card p-4">
        <div class="contents-theme text-left text-md-start">
            <h2 class="fw-bold mb-3" data-aos="fade-up">{{ $theme->title}}</h2>
            <p data-aos="fade-up">{!! $theme->description !!}</p>
            
            <a href="{{ route('home') }}" class="btn btn-outline-primary mt-3 px-3 py-2 rounded">
                <i class="fas fa-arrow-left me-2"></i> Back to Home
            </a>
        </div>
    </div>
</div>
@endsection
