@extends('layouts.app')

@section('title', 'Oral Presentation')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="card-title">List of Oral Presentation</h4>
                </div>

                @foreach ($symposiums as $symposium)
                    <div class="mb-4">
                        <h5>{{ $symposium->name }} ({{ $symposium->abbreviation }})</h5>

                        @if ($symposium->abstracts->isEmpty())
                            <p>No abstracts available for this symposium.</p>
                        @else
                            @foreach ($symposium->abstracts as $abstract)
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <h6 class="card-title">{{ $abstract->title }}</h6>
                                        <dl class="row">
                                            <dt class="col-sm-3">Authors</dt>
                                            <dd class="col-sm-9">{{ $abstract->authors }}</dd>

                                            <dt class="col-sm-3">Status</dt>
                                            <dd class="col-sm-9">{{ $abstract->status }}</dd>

                                            <dt class="col-sm-3">Presentation Type</dt>
                                            <dd class="col-sm-9">{{ $abstract->presentation_type }}</dd>

                                            <dt class="col-sm-3">Actions</dt>
                                            <dd class="col-sm-9">
                                                <a href="{{ route('admin.oral.edit', $abstract->id) }}"
                                                    class="btn btn-warning btn-sm"><i class="fa fa-edit"></i> Edit</a>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            @endforeach
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
    </div>
@endsection
