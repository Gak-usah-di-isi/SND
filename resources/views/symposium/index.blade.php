@extends('layouts.app')

@section('title', 'Symposiums')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title">Symposium</h4>
                    <a href="{{ route('admin.symposium.create') }}" class="btn btn-sm btn-success">Add Symposium</a>
                </div>
                <p class="card-description">
                    List of Symposium
                </p>
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th class="text-center">Name</th>
                                <th class="text-center">Abstract</th>
                                <th class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($symposiums as $key => $symposium)
                                <tr>
                                    <td>{{ $symposiums->firstItem() + $key }}</td>
                                    <td>{{ $symposium->name }} ({{ $symposium->abbreviation }})</td>
                                    <td class="text-center">
                                        {{ $symposium->abstracts_count }} Abstracts
                                    </td>
                                    <td class="text-center">
                                        <a href="{{ route('admin.symposium.edit', $symposium->id) }}"
                                            class="btn btn-sm btn-warning"><i class="fa fa-edit"></i> Edit</a>
                                        <form action="{{ route('admin.symposium.destroy', $symposium->id) }}" method="POST"
                                            style="display: inline-block;" class="delete-form"
                                            data-id="{{ $symposium->id }}">
                                            @csrf
                                            @method('DELETE')
                                            <button type="button" class="btn btn-sm btn-danger btn-delete"><i
                                                    class="fa fa-trash"></i>
                                                Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="text-center">No symposiums found</td>
                                </tr>
                            @endforelse
                        </tbody>

                    </table>
                </div>
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item {{ $symposiums->onFirstPage() ? 'disabled' : '' }}">
                            <a class="page-link" href="{{ $symposiums->previousPageUrl() }}" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        @foreach ($symposiums->getUrlRange(1, $symposiums->lastPage()) as $page => $url)
                            <li class="page-item {{ $page == $symposiums->currentPage() ? 'active' : '' }}">
                                <a class="page-link" href="{{ $url }}">{{ $page }}</a>
                            </li>
                        @endforeach
                        <li class="page-item {{ $symposiums->hasMorePages() ? '' : 'disabled' }}">
                            <a class="page-link" href="{{ $symposiums->nextPageUrl() }}" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
@endsection
