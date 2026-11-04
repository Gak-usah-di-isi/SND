@extends('layouts.app')

@section('title', 'Abstracts with Decision')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Accepted Abstracts</h4>
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th class="text-center">Title</th>
                                <th class="text-center">Reviewer</th>
                                <th class="text-center">Reviewer Comment</th>
                                <th class="text-center">Editor Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if ($abstracts->isNotEmpty()) <!-- Cek apakah ada data -->
                                @foreach ($abstracts as $key => $abstract)
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
                                        </td>
                                        <td>
                                            @foreach ($abstract->abstractReviews as $review)
                                                <div>
                                                    <span>Rekomendation:</span>
                                                    <strong>{{ $review->recommendation ?? 'No Recommendation' }}</strong><br><br>
                                                </div>
                                                <div>
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
                                @endforeach
                            @else
                                <tr>
                                    <td colspan="5" class="text-center">No abstracts found</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>
                {{ $abstracts->links() }}
            </div>
        </div>
    </div>
@endsection
