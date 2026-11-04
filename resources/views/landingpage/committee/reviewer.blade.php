@extends('layouts.landing')

@section('title', 'Reviewer Committee')

@section('content')
    <section id="reviewer" class="steering-committee section">
        <div class="container" data-aos="fade-up">
            <h2 class="title-committee">Reviewer Committee</h2>
            <div class="line bg-success mx-auto rounded-pill" style="height: 2px;"></div>
        </div>

       
        <div class="container" data-aos="fade-up" data-aos-delay="100">
            <div class="committee-container">
                @php
                    $committeeArray = $reviewers->toArray(); 
                    $totalItems = count($committeeArray);
                    $half = ceil($totalItems / 2);
                    $firstColumn = array_slice($committeeArray, 0, $half);
                    $secondColumn = array_slice($committeeArray, $half);
                @endphp

                <div class="committee-column">
                    <ol>
                        @foreach ($firstColumn as $item)
                            <li>{{ $item['name'] }} ({{ $item['institution'] }}, {{ $item['country'] }})</li>
                        @endforeach
                    </ol>
                </div>

                <div class="committee-column">
                    <ol start="{{ $half + 1 }}">
                        @foreach ($secondColumn as $item)
                            <li>{{ $item['name'] }} ({{ $item['institution'] }}, {{ $item['country'] }})</li>
                        @endforeach
                    </ol>
                </div>
            </div>

            @if ($reviewers->isEmpty())
                <p class="text-center text-muted">No reviewer committee members found.</p>
            @endif
        </div>
    </section>
@endsection
