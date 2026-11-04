@extends('layouts.app')

@section('title', 'Review Completed')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Completed Reviews (Accepted Full Papers)</h4>
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th class="text-center">Title</th>
                                <th class="text-center">Symposium</th>
                                <th class="text-center">Presentation Type</th>
                                <th class="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($fullPapers as $key => $fullPaper)
                                <tr>
                                    <td>{{ $key + 1 }}</td>
                                    <td class="text-wrap">{{ $fullPaper->abstract->title }}</td>
                                    <td>{{ $fullPaper->abstract->symposium->name }}</td>
                                    <td>{{ $fullPaper->abstract->presentation_type }}</td>
                                    <td><span class="badge badge-success">{{ ucfirst($fullPaper->status) }}</span></td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="text-center">No accepted full papers found</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
