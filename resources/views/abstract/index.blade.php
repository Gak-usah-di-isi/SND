@extends('layouts.app')

@section('title', 'Abstract')

@section('content')
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Accepted for Oral</h5>
                        <p class="card-text fw-bold fs-4">{{ $oralTotal }} (Paid: {{ $oralPaid }})</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Accepted for Poster</h5>
                        <p class="card-text fw-bold fs-4">{{ $posterTotal }} (Paid: {{ $posterPaid }})</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="card-title">Abstract</h4>
                </div>
                <input type="text" id="searchInput" class="form-control form-control-sm"
                    placeholder="Search by title...">
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead class="">
                            <tr class="text-center">
                                <th>No</th>
                                <th>Title/Author/Symposium</th>
                                <th>Decision</th>
                                <th>Fullpaper</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="abstractTable">
                            @forelse ($abstracts as $key => $abstract)
                                <tr>
                                    <td class="text-center">{{ $abstracts->firstItem() + $key }}</td>
                                    <td class="text-wrap">
                                        <strong>{{ $abstract->title }}</strong><br>
                                        <small>{{ $abstract->authors }}</small><br><br>
                                        <span>Symposium:</span>
                                        <strong>{{ $abstract->symposium->name }}</strong><br>
                                        <span>Requested:</span>
                                        <strong>{{ $abstract->presentation_type }}</strong><br>
                                        <span>Publication:</span>
                                        <strong>{{ $abstract->publication }}</strong>
                                    </td>
                                    <td class="text-center">
                                        <p>
                                            {{ ucfirst($abstract->status) }} for {{ $abstract->presentation_type }}
                                        </p>
                                    </td>
                                    <td class="text-center">
                                        @if ($abstract->fullPaper)
                                            <div class="d-flex justify-content-center">
                                                <a href="{{ asset('storage/' . $abstract->fullPaper->file_path) }}"
                                                    target="_blank">
                                                    <i class="fa fa-download text-primary fa-3x"></i>
                                                </a>
                                            </div>
                                        @else
                                            <span class="text-muted">Not Submitted</span>
                                        @endif
                                    </td>
                                    <td class="text-center">
                                        <a href="{{ route('admin.abstract.edit', $abstract->id) }}"
                                            class="btn btn-warning btn-sm">
                                            <i class="fa fa-edit"></i> Edit
                                        </a>
                                        <form action="{{ route('admin.abstract.destroy', $abstract->id) }}" method="POST"
                                            class="d-inline-block">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-danger btn-sm"
                                                onclick="return confirm('Are you sure?')">
                                                <i class="fa fa-trash"></i> Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="text-center">No abstracts found</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                <div class="mt-3">
                    <nav aria-label="Page navigation">
                        <ul class="pagination justify-content-center">
                            <li class="page-item {{ $abstracts->onFirstPage() ? 'disabled' : '' }}">
                                <a class="page-link" href="{{ $abstracts->previousPageUrl() }}" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            @foreach ($abstracts->getUrlRange(1, $abstracts->lastPage()) as $page => $url)
                                <li class="page-item {{ $page == $abstracts->currentPage() ? 'active' : '' }}">
                                    <a class="page-link" href="{{ $url }}">{{ $page }}</a>
                                </li>
                            @endforeach
                            <li class="page-item {{ $abstracts->hasMorePages() ? '' : 'disabled' }}">
                                <a class="page-link" href="{{ $abstracts->nextPageUrl() }}" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(document).ready(function() {
            let delayTimer;

            $('#searchInput').on('keyup', function() {
                clearTimeout(delayTimer);
                let search = $(this).val();

                delayTimer = setTimeout(() => {
                    $.ajax({
                        url: "{{ route('admin.abstract.index') }}",
                        type: "GET",
                        data: {
                            search: search
                        },
                        success: function(response) {
                            let rows = '';

                            if (response.abstracts.length > 0) {
                                response.abstracts.forEach((abstract, index) => {
                                    let fullPaperHtml = abstract.full_paper ?
                                        `<a href="/storage/${abstract.full_paper.file_path}" target="_blank">
                                                <i class="fa fa-download text-primary fa-3x"></i>
                                            </a>` :
                                        `<span class="text-muted">Not Submitted</span>`;

                                    rows += `
                                        <tr>
                                            <td class="text-center">${index + 1}</td>
                                            <td class="text-wrap">
                                                <strong>${abstract.title}</strong><br>
                                                <small>${abstract.authors}</small>
                                            </td>
                                            <td class="text-center">
                                                <p>${abstract.status.charAt(0).toUpperCase() + abstract.status.slice(1)} 
                                                    for ${abstract.presentation_type}</p>
                                            </td>
                                            <td class="text-center">${fullPaperHtml}</td>
                                            <td class="text-center">
                                                <a href="/admin/abstract/${abstract.id}/edit" class="btn btn-warning btn-sm">
                                                    <i class="fa fa-edit"></i> Edit
                                                </a>
                                                <form action="/admin/abstract/${abstract.id}" method="POST" class="d-inline-block">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="btn btn-danger btn-sm" 
                                                        onclick="return confirm('Are you sure?')">
                                                        <i class="fa fa-trash"></i> Delete
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    `;
                                });
                            } else {
                                rows =
                                    `<tr><td colspan="5" class="text-center">No abstracts found</td></tr>`;
                            }

                            $('#abstractTable').html(rows);
                        },
                        error: function() {
                            $('#abstractTable').html(`<tr><td colspan="5" class="text-center text-danger">
                                Error fetching data</td></tr>`);
                        }
                    });
                }, 300);
            });
        });
    </script>
@endsection
