@extends('layouts.app')

@section('title', 'Payment Guidelines')

@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Payment Guidelines</h2>
        <hr class="border border-secondary mb-4">

        @if (session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        {{-- Filter Dropdown Tahun --}}
        <div class="d-flex justify-content-between mb-3">
            <div>
                <label for="year-filter" class="fw-bold me-2">Filter Tahun:</label>
                <select id="year-filter" class="form-select d-inline-block w-auto" onchange="filterByYear()">
                    <option value="">Semua Tahun</option>
                    @foreach ($years as $year)
                        <option value="{{ $year }}" {{ request('year') == $year ? 'selected' : '' }}>
                            {{ $year }}
                        </option>
                    @endforeach
                </select>
            </div>
            <a href="{{ route('landing.payment_guidelines.create') }}" class="btn btn-primary">
                <i class="fas fa-plus"></i> Tambah Guideline
            </a>
        </div>

        {{-- Table Guidelines --}}
        <div class="table-responsive">
            <table class="table table-bordered table-hover text-center align-middle">
                <thead class="table-success">
                    <tr>
                        <th class="text-center">Nama Bank</th>
                        <th class="text-center">Tahun</th>
                        <th class="text-center">Guideline</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($guidelines as $guideline)
                        <tr>
                            <td class="fw-bold">{{ $guideline->bank_name }}</td>
                            <td class="fw-bold">{{ $guideline->year }}</td>
                            <td>{!! Str::limit(strip_tags($guideline->guideline), 50) !!}</td>
                            <td>
                                <a href="{{ route('landing.payment_guidelines.edit', $guideline->id) }}" 
                                   class="btn btn-sm btn-warning">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <form action="{{ route('landing.payment_guidelines.destroy', $guideline->id) }}" 
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

    {{-- JavaScript untuk Filter Tahun --}}
    <script>
        function filterByYear() {
            let year = document.getElementById('year-filter').value;
            let url = new URL(window.location.href);
            if (year) {
                url.searchParams.set('year', year);
            } else {
                url.searchParams.delete('year');
            }
            window.location.href = url.toString();
        }
    </script>
@endsection
