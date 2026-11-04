@extends('layouts.app')

@section('title', 'Abstract Detail')

@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 id="abstract_title" class="card-title">{{ $abstract->title }}</h4>

                <p id="abstract_author">{!! $formattedAuthors !!}</p>

                <p id="abstract_affiliation">{!! $formattedAffiliations !!}</p>

                <p id="abstract_email"><strong>Corresponding Email:</strong> {{ $abstract->corresponding_email }}</p>

                <p id="abstract_abstract"><strong>Abstract</strong></p>
                <div id="abstract_body">
                    {!! nl2br(e($abstract->abstract)) !!}
                </div>

                <hr>


                <p id="keyword"><strong>Keyword:</strong> {{ $abstract->keyword }}</p>
                <p id="abstract_symposium"><strong>Symposium:</strong> {{ $abstract->symposium->name }}</p>
            </div>
        </div>
    </div>
    <div class="mt-4">
        <a href="{{ route('abstracts.index') }}" class="btn btn-secondary">Back</a>
        <a href="{{ route('abstracts.downloadPdf', $abstract->id) }}" target="_blank" class="btn btn-primary">
            Open Abstract PDF
        </a>
    </div>
@endsection
