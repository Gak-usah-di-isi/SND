@extends('layouts.app')

@section('title', 'Tugas Review Abstract')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Abstracts Assigned to You</h4>
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th class="text-center">Title</th>
                                <th class="text-center">Symposium</th>
                                <th class="text-center">Presentation Type</th>
                                <th class="text-center">Status</th>
                                <th class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($abstracts as $key => $abstract)
                                <tr>
                                    <td>{{ $key + 1 }}</td>
                                    <td class="text-wrap">{{ $abstract->title }}</td>
                                    <td>{{ $abstract->symposium->name }}</td>
                                    <td class="text-center">{{ $abstract->presentation_type }}</td>
                                    <td>
                                        <span class="badge badge-info">{{ ucfirst($abstract->status) }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <a href="{{ route('reviewer.review.showReviewForm', $abstract->id) }}"
                                            class="btn btn-sm btn-primary">Review</a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center">No tasks assigned</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
