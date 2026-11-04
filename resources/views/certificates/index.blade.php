@extends('layouts.app')

@section('title', 'Certificates')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Certificates</h4>
                <p class="card-description">List of certificates</p>
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="text-center">No</th>
                                <th class="text-center">User</th>
                                <th class="text-center">Certificate Type</th>
                                <th class="text-center">Payment Status</th>
                                <th class="text-center">File</th>
                                <th class="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($certificates as $key => $certificate)
                                <tr>
                                    <td>{{ $certificates->firstItem() + $key }}</td>
                                    <td class="text-center">{{ $certificate->user->name }}</td>
                                    <td class="text-center">{{ $certificate->certificate_type }}</td>
                                    <td class="text-center">
                                        @if ($certificate->user->filePayment)
                                            @if ($certificate->user->filePayment->status === 'pending')
                                                <span class="badge bg-warning"><i class="fa fa-clock"></i> Pending</span>
                                            @elseif ($certificate->user->filePayment->status === 'verified')
                                                <span class="badge bg-success"><i class="fa fa-check"></i> Verified</span>
                                            @else
                                                <span class="badge bg-danger"><i class="fa fa-times"></i> Not Yet
                                                    Paid</span>
                                            @endif
                                        @else
                                            <span class="badge bg-danger"><i class="fa fa-times"></i> Not Yet Paid</span>
                                        @endif
                                    </td>

                                    <td class="text-center">
                                        <a href="{{ asset('storage/' . $certificate->certificate_path) }}" target="_blank"
                                            class="btn btn-light btn-sm" data-bs-toggle="tooltip">
                                            <i class="fa fa-file"></i>
                                        </a>
                                    </td>
                                    <td class="text-center">
                                        <form action="{{ route('admin.certificates.toggle', $certificate->id) }}"
                                            method="POST">
                                            @csrf
                                            @method('PUT')
                                            <div class="form-check form-switch">
                                                <input type="hidden" name="status" value="0">
                                                <input class="form-check-input" type="checkbox" name="status"
                                                    value="1" id="toggle-{{ $certificate->id }}"
                                                    onchange="this.form.submit()"
                                                    {{ $certificate->status ? 'checked' : '' }}>
                                                <label class="form-check-label" for="toggle-{{ $certificate->id }}"></label>
                                            </div>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item {{ $certificates->onFirstPage() ? 'disabled' : '' }}">
                            <a class="page-link" href="{{ $certificates->previousPageUrl() }}" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        @foreach ($certificates->getUrlRange(1, $certificates->lastPage()) as $page => $url)
                            <li class="page-item {{ $page == $certificates->currentPage() ? 'active' : '' }}">
                                <a class="page-link" href="{{ $url }}">{{ $page }}</a>
                            </li>
                        @endforeach
                        <li class="page-item {{ $certificates->hasMorePages() ? '' : 'disabled' }}">
                            <a class="page-link" href="{{ $certificates->nextPageUrl() }}" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
@endsection
