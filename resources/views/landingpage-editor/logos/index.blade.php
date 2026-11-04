@extends('layouts.app')

@section('title', 'Logo Icasve')

@section('content')
    <div class="container card p-4">
        <h2>Daftar Logo</h2>
        <hr class="border border-secondary">
        <a href="{{ route('landing.logos.create') }}" class="w-fit btn btn-primary mb-3">Tambah Logo</a>

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Gambar</th>
                    <th>Tahun</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($logos as $logo)
                    <tr>
                        <td><img src="{{ asset('storage/' . $logo->image) }}" width="100"></td>
                        <td>{{ $logo->year }}</td>
                        <td>
                            <a href="{{ route('landing.logos.edit', $logo->id) }}" class="btn btn-warning">Edit</a>
                            <form action="{{ route('landing.logos.destroy', $logo->id) }}" method="POST"
                                style="display:inline;">
                                @csrf @method('DELETE')
                                <button type="submit" class="btn btn-danger"
                                    onclick="return confirm('Yakin ingin menghapus?')">Hapus</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
