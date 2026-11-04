@extends('layouts.app')

@section('title', 'Poster')

@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Daftar Poster</h2>
        <hr class="border border-secondary">
        <a href="{{ route('landing.poster.create') }}" class="btn btn-primary mb-3">Tambah Poster</a>

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <div class="row">
            @foreach ($posters as $poster)
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm">
                        <img src="{{ asset('storage/' . $poster->image) }}" class="card-img-top" alt="Poster" style="height: 250px; object-fit: cover;">
                        <div class="card-body">
                            <h6 class="my-2"><strong>Tahun:</strong> {{ $poster->year }}</h6>
                            <div class="d-flex gap-2">
                                <a href="{{ route('landing.poster.edit', $poster->id) }}" class="btn btn-success btn-md rounded-sm w-100">Edit</a>
                                <form action="{{ route('landing.poster.destroy', $poster->id) }}" method="POST" class="w-100" onsubmit="return confirm('Hapus poster ini?')">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-danger btn-md rounded-sm w-100">Hapus</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endsection
