@extends('layouts.app')

@section('title', 'Email CSV')

@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">EMAIL CSV</h4>
                <p>If you want to send an email to specific participants, copy the following list (already in CSV format)
                    and use them as BCC for privacy.</p>
                <textarea class="form-control" rows="10" readonly>{{ $emailCsv }}</textarea>
            </div>
        </div>
    </div>
@endsection
