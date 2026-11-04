@extends('layouts.app')

@section('title', 'Edit Landing Page')

@section('content')
    <div class="container py-4">
        <div class="card border rounded-4">
            <div class="card-header bg-gradient-primary text-white text-center py-3 rounded-top">
                <h4 class="fw-bold mb-0">Edit Landing Page</h4>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    @php
                        $menus = [
                            ['route' => 'landing.conference-title.index', 'icon' => 'fa-heading', 'text' => 'Title', 'color' => 'danger'],
                            ['route' => 'landing.abouts.index', 'icon' => 'fa-info-circle', 'text' => 'About', 'color' => 'danger'],
                            ['route' => 'landing.speakers.index', 'icon' => 'fa-microphone', 'text' => 'Speakers', 'color' => 'danger'],
                            ['route' => 'landing.poster.index', 'icon' => 'fa-image', 'text' => 'Poster', 'color' => 'secondary'],
                            ['route' => 'landing.deadlines.index', 'icon' => 'fa-calendar', 'text' => 'Deadline Dates', 'color' => 'primary'],
                            ['route' => 'landing.registrationFee.index', 'icon' => 'fa-dollar-sign', 'text' => 'Registration Fee', 'color' => 'primary'],
                            ['route' => 'landing.venue.index', 'icon' => 'fa-location-dot', 'text' => 'Venue', 'color' => 'info'],
                            ['route' => 'landing.publications-journal.index', 'icon' => 'fa-book', 'text' => 'Publications Journal', 'color' => 'success'],
                            ['route' => 'landing.contact.index', 'icon' => 'fa-envelope', 'text' => 'Contact', 'color' => 'info']
                        ];
                    @endphp

                    @foreach ($menus as $menu)
                        <div class="col-md-4">
                            <a href="{{ route($menu['route']) }}" class="text-decoration-none">
                                <div class="card bg-wheat border-0 shadow-sm rounded-3 text-center py-3 bg-light">
                                    <i class="fa-solid {{ $menu['icon'] }} fa-3x text-{{ $menu['color'] }}"></i>
                                    <h5 class="mt-3 text-dark fw-semibold">{{ $menu['text'] }}</h5>
                                </div>
                            </a>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
@endsection
