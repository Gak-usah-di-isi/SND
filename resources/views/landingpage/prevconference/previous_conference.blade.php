@extends('layouts.landing')

@section('title', 'Previous Conferences')

@section('content')

    <div class="container my-5">
        <div class="text-center">
            <h1 class="fw-bold">Previous Conferences</h1>
            <p class="text-muted">A look back at our past ICASVE conferences.</p>
        </div>

        <div class="row mt-4">
            @foreach ($posters->sortByDesc('year') as $poster)
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card shadow-sm border-0 rounded">
                        <div>
                            <img src="{{ asset('storage/' . $poster->image) }}" class="card-img-top img-fluid"
                                style="object-fit: cover; width: 100%; height: 100%;"
                                alt="ICASVE {{ $poster->year }} Poster">
                        </div>
                        <div class="card-body">
                            @foreach ($conferenceTitle as $title)
                                @if ($title->year == $poster->year)
                                    <h5 class="card-title fw-bold">ICASVE {{ $title->year }}</h5>
                                    <p class="card-text text-muted">{{ $title->description }}</p>
                                    <div>
                                        <p class="fw-semibold">Keynote Speaker : </p>
                                        <div>
                                            <?php $iteration = 1; ?>
                                            @foreach ($speakers as $speaker)
                                                @if ($speaker->year == $poster->year && $speaker->role == 'keynote_speaker')
                                                    <p>{{ $iteration++ }}. {{ $speaker->name }}</p>
                                                @endif
                                            @endforeach
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        @foreach ($conferenceDetails as $detail)
                                            @if ($detail->year == $poster->year)
                                                <p class="card-text text-muted">Date:
                                                    {{ date('d F Y', strtotime($detail->date)) }}</p>
                                            @endif
                                        @endforeach
                                    </div>
                                    <div class="mb-2">
                                        @foreach ($venues as $venue)
                                            @if ($venue->year == $poster->year)
                                                <p class="card-text text-muted">Location: {{ $venue->address }}</p>
                                            @endif
                                        @endforeach
                                    </div>
                                    <form method="GET" action="{{ route('downloadAllPdf') }}">
                                        <input type="hidden" name="year" value="{{ $poster->year }}">
                                        <button type="submit" class="btn btn-primary btn-sm">
                                            <i class="bi bi-download"></i> Archive
                                            {{ $poster->year }}
                                        </button>
                                    </form>
                                @endif
                            @endforeach
                        </div>
                    </div>
                </div>
            @endforeach

            @foreach ($prevconferences as $prevconference)
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card shadow-sm border-0 rounded">
                        <div>
                            <img src="{{ asset('storage/' . $prevconference->image) }}" class="card-img-top img-fluid"
                                style="object-fit: cover; width: 100%; height: 100%;"
                                alt="ICASVE {{ $prevconference->title }}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title fw-bold">{{ $prevconference->title }}</h5>
                            <p class="card-text text-muted">{{ $prevconference->description }}</p>
                            <div>
                                <p class="fw-semibold">Keynote Speaker: </p>
                                <div class="mb-2">{!! $prevconference->keynote !!}</div>
                            </div>
                            <div class="mb-2">
                                <p class="card-text text-muted">Date: {{ $prevconference->date }}</p>
                            </div>
                            <div class="mb-2">
                                <p class="card-text text-muted">Location: {{ $prevconference->location }}</p>
                            </div>
                            <form>
                                <input type="hidden" name="year">
                                <a type="submit" href="{{ $prevconference->pdf }}" class="btn btn-primary btn-sm">
                                    <i class="bi bi-download"></i> Archive
                                </a>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

@endsection
