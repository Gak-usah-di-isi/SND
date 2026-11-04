@extends('layouts.app')

@section('title', 'Abstracts')

@section('content')
    <div class="container-fluid">
        @if ($abstracts->isNotEmpty())
            <div class="row mb-4">
                <div class="col-md">
                    <div class="card">
                        <div class="card-body">
                            @foreach ($abstracts as $key => $abstract)
                                <div class="px-3 py-3">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <p class="mb-1"><strong>Abstract</strong></p>
                                            <a href="{{ route('abstracts.show', $abstract->id) }}"
                                                class="btn btn-outline-primary btn-sm">Detail
                                            </a>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <p class="mb-1"><strong>LETTER OF ACCEPTANCE</strong></p>
                                            @if ($abstract->status === 'accepted' && $abstract->user?->filePayment?->status === 'verified')
                                                <a href="{{ route('abstracts.acceptancePdf', $abstract->id) }}"
                                                    target="_blank" class="btn btn-outline-primary btn-sm">
                                                    Open LOA PDF
                                                </a>
                                            @else
                                                <span class="text-muted">Not Available</span>
                                            @endif
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            @if ($abstract->fullPaper)
                                                <p class="mb-1"><strong>Full Paper</strong></p>

                                                <a href="{{ asset('storage/' . $abstract->fullPaper->file_path) }}"
                                                    target="_blank" class="d-block mt-1">
                                                    <i class="fa fa-download text-primary fa-2x mt-2 ml-3"></i>
                                                </a>
                                                <p class="text-muted">Submitted</p>
                                                @if ($abstract->fullPaper->revised_file_path)
                                                    <a href="{{ asset('storage/' . $abstract->fullPaper->revised_file_path) }}"
                                                        target="_blank" class="d-block mt-1">
                                                        <i class="fa fa-file-download text-warning fa-2x mt-2 ml-3"></i>
                                                    </a>
                                                    <p class="text-muted">Revised</p>
                                                @endif
                                            @else
                                                <p class="text-muted">No Full Paper Uploaded</p>
                                            @endif
                                        </div>
                                        @if ($abstract->status === 'revision' && $abstract->reviewers->isNotEmpty())
                                            <div class="col-md-6 mb-3">
                                                <p class="mb-1"><strong>Revision Abstract</strong></p>
                                                @foreach ($abstract->reviewers as $reviewer)
                                                    @php
                                                        $review = $reviewer->pivot;
                                                    @endphp
                                                    @if (!empty($review->comment))
                                                        <p class="text-danger">{{ $review->comment }}</p>
                                                    @endif
                                                    <p class="text-muted mb-1" style="font-size: 0.9em;">
                                                        <strong>Revision by:</strong> {{ $reviewer->name }}
                                                    </p>
                                                @endforeach
                                            </div>
                                        @endif
                                        @if (
                                            $abstract->fullPaper &&
                                                $abstract->fullPaper->fullPaperReviews->isNotEmpty() &&
                                                $abstract->fullPaper->status === 'revision')
                                            <div class="col-md-6 mb-3">
                                                <p class="mb-1"><strong>Revision Fullpaper</strong></p>
                                                @foreach ($abstract->fullPaper->fullPaperReviews as $review)
                                                    <p class="text-danger">{{ $review->comment }}</p>
                                                    <p class="text-muted" style="font-size: 0.9em;">
                                                        Revision by: {{ $review->reviewer->name ?? 'Reviewer' }}
                                                    </p>
                                                @endforeach
                                                </ul>
                                            </div>
                                        @endif
                                        <div class="col-md-6 mb-3">
                                            <p class="mb-1"><strong>Publication Journal</strong></p>

                                            <p class="text-muted" style="font-size: 0.9em;">
                                                {{ $abstract->publication ?? 'Not Specified' }}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        @endif
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title">Abstracts</h4>
                    <div>
                        @if ($openAbstractSubmission && !$abstracts->where('status', 'accepted')->count())
                            @php
                                $hasRevision = $abstracts->contains('status', 'revision');
                            @endphp
                            <a href="{{ route('abstracts.create') }}" class="btn btn-sm btn-success">
                                {{ $hasRevision ? 'Add the Revised Abstract' : 'Add Abstract' }}
                            </a>
                        @endif

                        @if ($openFullPaperUpload && $abstracts->where('status', 'accepted')->count() > 0)
                            @foreach ($abstracts as $abstract)
                                @if (!$abstract->fullPaper || in_array($abstract->fullPaper->status, ['revision', 'open']))
                                    @if ($abstract->user?->filePayment?->status === 'verified')
                                        <form action="{{ route('fullpapers.create') }}" method="POST"
                                            style="display: inline;">
                                            @csrf
                                            <input type="hidden" name="abstract_id" value="{{ $abstract->id }}">
                                            <button type="submit" class="btn btn-sm btn-primary">Upload Full Paper</button>
                                        </form>
                                    @endif
                                @endif
                            @endforeach
                        @endif

                        @if ($openFullPaperUpload && $abstracts->where('status', 'accepted')->count() > 0)
                            @foreach ($abstracts as $abstract)
                                @if ($abstract->fullPaper && $abstract->fullPaper->status === 'accepted')
                                    @if ($abstract->user?->filePayment?->status === 'verified')
                                        <form action="{{ route('fullpapers.createCommitmentLetter') }}" method="POST"
                                            style="display: inline;">
                                            @csrf
                                            <input type="hidden" name="abstract_id" value="{{ $abstract->id }}">
                                            <button type="submit" class="btn btn-sm btn-green">Upload Commitment
                                                Letter</button>
                                        </form>
                                    @endif
                                @endif
                            @endforeach
                        @endif


                    </div>
                </div>
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th class="text-center">Title</th>
                                <th class="text-center">Status</th>
                                <th class="text-center">FullPaper Status</th>
                                <th class="text-center">Action</th>
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
                                        <strong>{{ $abstract->presentation_type }}</strong><br><br>
                                        <span>Publication:</span>
                                        <strong>{{ $abstract->publication }}</strong>
                                    </td>
                                    <td class="text-center">
                                        <span
                                            class="badge {{ $abstract->status === 'revision' ? 'badge-warning' : 'badge-info' }}">
                                            {{ ucfirst($abstract->status) }}
                                        </span>
                                    </td>

                                    <td class="text-center">
                                        @if ($abstract->fullPaper)
                                            <span
                                                class="badge {{ $abstract->fullPaper->status === 'revision' ? 'badge-warning' : 'badge-info' }}">
                                                {{ ucfirst($abstract->fullPaper->status) }}
                                            </span>
                                        @else
                                            <span class="text-muted">Not Submitted</span>
                                        @endif
                                    </td>


                                    <td class="text-center">
                                        <a href="{{ route('abstracts.edit', $abstract->id) }}"
                                            class="btn btn-sm btn-warning"><i class="fa fa-edit"></i>Edit</a>


                                        <form action="{{ route('abstracts.destroy', $abstract->id) }}" method="POST"
                                            style="display: inline-block;" class="delete-form">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-danger btn-delete"><i
                                                    class="fa fa-trash"></i>
                                                Delete</button>
                                        </form>
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
