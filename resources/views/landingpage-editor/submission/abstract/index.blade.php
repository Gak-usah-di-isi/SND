@extends('layouts.app')
@section('title', 'Abstract Guidelines')

@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Abstract Submission Guidelines</h2>
        <hr class="border border-success mb-4">
        @if (session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        <div class="d-flex justify-content-between mb-3">
            <h4 class="fw-bold">List of Guidelines</h4>
            <a href="{{ route('landing.abstract-guidelines.create') }}" class="btn btn-primary">
                <i class="fas fa-plus"></i> Tambah Guideline
            </a>
        </div>

        <div class="table-responsive">
            <table class="table table-bordered text-center align-middle">
                <thead class="table-dark">
                    <tr>
                        <th class="text-center">Tahun</th>
                        <th class="text-center">Guideline</th>
                        <th class="text-center">File PDF</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($guidelines as $guideline)
                        <tr>
                            <td class="fw-bold">{{ $guideline->year }}</td>
                            <td>{!! Str::limit(strip_tags($guideline->content), 50) !!}</td>
                            <td>
                                @if ($guideline->pdf_file)
                                    <a href="{{ asset('storage/' . $guideline->pdf_file) }}" 
                                       class="btn btn-sm btn-outline-success" target="_blank">
                                        <i class="fas fa-file-pdf"></i> Download
                                    </a>
                                @else
                                    <span class="text-muted">Tidak ada file</span>
                                @endif
                            </td>
                            <td>
                                <a href="{{ route('landing.abstract-guidelines.edit', $guideline->id) }}" 
                                   class="btn btn-sm btn-warning">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <form action="{{ route('landing.abstract-guidelines.destroy', $guideline->id) }}" 
                                      method="POST" class="d-inline" onsubmit="return confirm('Yakin hapus?')">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-sm btn-danger">
                                        <i class="fas fa-trash-alt"></i> Hapus
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="text-center">Tidak ada data</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
