@extends('layouts.app')

@section('title', 'Abstracts Book')

@section('content')
    <div class="container">
        <h2 class="mb-4">Abstracts Book</h2>
        <a href="{{ route('admin.abstract.downloadAllPdf') }}" class="btn btn-danger mb-3" target="_blank">
            <i class="fas fa-file-pdf"></i> Download All Abstracts as PDF
        </a>

        <a href="{{ route('admin.abstract.downloadVerifiedPdf') }}" class="btn btn-success mb-3" target="_blank">
            <i class="fas fa-file-pdf"></i> Download Verified Abstracts as PDF
        </a>

        @foreach ($symposiums as $symposium)
            <div class="card mb-4">
                <div class="card-body">
                    <h3 class="card-title">{{ $symposium->name }} ({{ $symposium->abbreviation }})</h3>
                    <hr>
                    @if ($symposium->abstracts->count() > 0)
                        @foreach ($symposium->abstracts as $abstract)
                            <div class="mb-3">
                                <hr style="border-top: 3px solid #000;">
                                <p class="text-uppercase font-weight-bold">
                                    {{ $symposium->abbreviation }} / {{ str_pad($loop->iteration, 3, '0', STR_PAD_LEFT) }}
                                </p>
                                <hr style="border-top: 3px solid #000;">
                                <h4 id="abstract_title" class="font-weight-bold">{{ $abstract->title }}</h4>
                                <p id="abstract_author">{!! $abstract->formattedAuthors !!}</p>
                                <p id="abstract_affiliation">{!! $abstract->formattedAffiliations !!}</p>
                                <p id="abstract_email"><strong>Corresponding Email:</strong>
                                    {{ $abstract->corresponding_email }}</p>
                                <p id="abstract_abstract"><strong>Abstract:</strong></p>
                                <div id="abstract_body">{!! nl2br(e($abstract->abstract)) !!}</div>
                            </div>
                            <hr>
                        @endforeach
                    @else
                        <p>No abstracts available for this symposium.</p>
                    @endif
                </div>
            </div>
        @endforeach
    </div>
@endsection
