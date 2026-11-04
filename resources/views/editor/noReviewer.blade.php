@extends('layouts.app')

@section('title', 'Abstracts Not Reviewed')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Abstracts that have not been reviewed</h4>
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th class="text-center">Title</th>
                                <th class="text-center">Symposium</th>
                                <th class="text-center">Requested Presentation</th>
                                <th class="text-center">Assign Reviewer</th>
                                <th class="text-center">Editor Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($abstracts as $key => $abstract)
                                <tr>
                                    <td>{{ $key + 1 }}</td>
                                    <td class="text-wrap">{{ $abstract->title }}</td>
                                    <td>{{ $abstract->symposium->name }}</td>
                                    <td>{{ $abstract->presentation_type }}</td>
                                    <td class="text-center">
                                        @foreach ($abstract->abstractReviews as $review)
                                            <strong>{{ $review->reviewer->name }} <br></strong>
                                        @endforeach

                                        <a href="{{ route('reviewer.editor.showAssignReviewer', $abstract->id) }}"
                                            class="btn btn-sm btn-primary">Assign Reviewer</a>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge badge-info">{{ ucfirst($abstract->status) }}</span><br><br>
                                        <a href="{{ route('reviewer.editor.showEditStatus', $abstract->id) }}"
                                            class="btn btn-sm btn-warning">Edit Status</a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="7" class="text-center">No abstracts found</td>
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
