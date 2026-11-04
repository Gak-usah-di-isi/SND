@extends('layouts.app')

@section('title', 'Daftar Abstract yang Belum Direview')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title">Abstract</h4>
                </div>
                <p class="card-description">List All Abstract</p>
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th class="text-center">Title</th>
                                <th class="text-center">Reviewer</th>
                                <th class="text-center">Reviewer Comment</th>
                                <th class="text-center">Editor Deccision</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($abstracts as $key => $abstract)
                                <tr>
                                    <td>{{ $key + 1 }}</td>
                                    <td class="text-wrap">
                                        {{ $abstract->title }}<br><br>
                                        <span>Symposium:</span>
                                        <strong>{{ $abstract->symposium->name }}</strong><br><br>
                                        <span>Requested:</span>
                                        <strong>{{ $abstract->presentation_type }}</strong>
                                    </td>
                                    <td>
                                        @foreach ($abstract->abstractReviews as $review)
                                            <div>
                                                <strong>{{ $review->reviewer->name }}</strong><br>
                                            </div>
                                        @endforeach
                                        {{-- @if ($abstract->status !== 'accepted')
                                            <a href="{{ route('reviewer.editor.showAssignReviewer', $abstract->id) }}"
                                                class="btn btn-sm btn-primary">Assign Reviewer</a>
                                        @endif --}}
                                    </td>
                                    <td>
                                        @foreach ($abstract->abstractReviews as $review)
                                            <div>
                                                <span>Recommendation:</span>
                                                <strong>{{ $review->recommendation ?? 'No recommendation' }}</strong><br>
                                                <span>Comment:</span>
                                                <strong>{{ $review->comment ?? 'No comment' }}</strong><br><br>
                                            </div>
                                        @endforeach
                                    </td>
                                    <td class="text-center">
                                        <span class="badge badge-info">{{ ucfirst($abstract->status) }}</span><br><br>
                                        <a href="{{ route('reviewer.editor.showEditStatus', $abstract->id) }}"
                                            class="btn btn-sm btn-warning">Edit Status</a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center">No abstracts found</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $abstracts->links() }}
            </div>
        </div>
    </div>
@endsection
