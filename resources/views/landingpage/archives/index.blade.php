@extends('layouts.landing')

@section('title', 'ICASVE Archives')

@section('content')
<div class="container mt-5">
    <h1 class="text-center fw-bold mb-4">ICASVE Archives</h1>

    <div class="row">
        <!-- Sidebar Archives -->
        <div class="col-md-3">
            <div class="list-group" id="year-list">
                <form action="{{ url('archives') }}" method="GET">
                    <div class="mb-3">
                        <select name="year" class="form-select" onchange="this.form.submit()">
                            @foreach ($years as $yearOption)
                                <option value="{{ $yearOption }}" {{ $yearOption == request('year', $latestYear) ? 'selected' : '' }}>
                                    ICASVE - {{ $yearOption }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </form>                
            </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9">
            <div class="p-4 border rounded bg-light">
                <h2 class="fw-bold text-dark" id="year-title">Abstracts - {{ $year }}</h2>

                <div id="abstract-list">
                    @if($abstracts->isEmpty())
                        <p class="text-center text-muted">No abstracts available for the year .</p>
                    @else
                        <div class="list-group">
                            @foreach ($abstracts as $abstract)
                                <div class="list-group-item p-3 mb-3 shadow-sm rounded">
                                    <h5 class="fw-bold">{{ $abstract->title }}</h5>
                                    <p><strong>Topic:</strong> {{ $abstract->presentation_type }}</p>
                                    <p><strong>Authors:</strong> {{ $abstract->authors }}</p>
                                    <form action="{{ route('download.abstract', $abstract->id) }}" method="GET">
                                        <button type="submit" class="btn btn-primary btn-sm text-white">
                                            <i class="bi bi-download"></i> Download Abstract
                                        </button>
                                    </form>                                    
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
