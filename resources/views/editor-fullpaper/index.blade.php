@extends('layouts.app')

@section('title', 'Daftar Full Papers yang Belum Direview')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title">Full Papers</h4>
                </div>
                <p class="card-description">List All Full Papers</p>
                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th class="text-center">Title</th>
                                <th class="text-center">Reviewer</th>
                                <th class="text-center">Reviewer Comment</th>
                                <th class="text-center">Editor Decision</th>
                                <th class="text-center">File</th> <!-- Kolom tambahan untuk file -->
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($fullpapers as $key => $fullpaper)
                                <tr>
                                    <td>{{ $key + 1 }}</td>
                                    <td class="text-wrap">
                                        {{ $fullpaper->abstract ? $fullpaper->abstract->title : 'No Title' }}<br><br>
                                        <span>Symposium:</span>
                                        <strong>{{ $fullpaper->abstract && $fullpaper->abstract->symposium ? $fullpaper->abstract->symposium->name : 'No Symposium' }}</strong><br><br>
                                        <span>Requested:</span>
                                        <strong>{{ $fullpaper->abstract ? $fullpaper->abstract->presentation_type : 'No Requested Type' }}</strong>
                                    </td>

                                    <td>
                                        @foreach ($fullpaper->fullPaperReviews as $review)
                                            <div>
                                                <strong>{{ $review->reviewer->name }}</strong><br>
                                            </div>
                                        @endforeach
                                        {{-- @if ($fullpaper->status !== 'accepted')
                                            <a href="{{ route('reviewer.editor-fullpaper.showAssignReviewer', $fullpaper->id) }}"
                                                class="btn btn-sm btn-primary">Assign Reviewer</a>
                                        @endif --}}
                                    </td>
                                    <td>
                                        @foreach ($fullpaper->fullPaperReviews as $review)
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
                                        <span class="badge badge-info">{{ ucfirst($fullpaper->status) }}</span><br><br>
                                        <a href="{{ route('reviewer.editor-fullpaper.showEditStatus', $fullpaper->id) }}"
                                            class="btn btn-sm btn-warning">Edit Status</a>
                                    </td>
                                    <td class="text-center">
                                        @if ($fullpaper)
                                            {{-- Status badge --}}
                                            @php
                                                $badgeClass = match ($fullpaper->status) {
                                                    'revision' => 'badge-warning',
                                                    'accepted' => 'badge-success',
                                                    'rejected' => 'badge-danger',
                                                    'under review' => 'badge-primary',
                                                    default => 'badge-info',
                                                };
                                            @endphp
                                            <span
                                                class="badge {{ $badgeClass }}">{{ ucfirst($fullpaper->status) }}</span><br>

                                            {{-- Original file --}}
                                            @if ($fullpaper->file_path)
                                                <a href="{{ asset('storage/' . $fullpaper->file_path) }}" target="_blank"
                                                    class="d-block mt-2">
                                                    <i class="fa fa-download text-primary fa-2x"></i>
                                                </a>
                                                <p class="text-muted mb-1">Submitted</p>
                                            @endif

                                            {{-- Revised file --}}
                                            @if ($fullpaper->revised_file_path)
                                                <a href="{{ asset('storage/' . $fullpaper->revised_file_path) }}"
                                                    target="_blank" class="d-block">
                                                    <i class="fa fa-file-download text-warning fa-2x"></i>
                                                </a>
                                                <p class="text-muted">Revised</p>
                                            @endif

                                            {{-- Jika dua-duanya kosong --}}
                                            @if (!$fullpaper->file_path && !$fullpaper->revised_file_path)
                                                <span class="text-muted">Not Submitted</span>
                                            @endif
                                        @else
                                            <span class="text-muted">Not Submitted</span>
                                        @endif
                                    </td>

                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center">No full papers found</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $fullpapers->links() }}
            </div>
        </div>
    </div>
@endsection
