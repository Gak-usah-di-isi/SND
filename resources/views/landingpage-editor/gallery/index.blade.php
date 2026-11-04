
@extends('layouts.app')
@section('title', 'Gallery')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Gallery</h2>
        <hr class="border border-secondary">
        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        <div class="d-flex justify-content-end mb-3">
            <a href="{{ route('landing.gallery.create') }}" class="btn btn-primary">Add Gallery</a>
        </div>
        <table class="table table-bordered table-striped">
            <thead class="table-success">
                <tr>
                    <th>No</th>
                    <th>Gallery</th>
                    <th>Tahun</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($galleries as $gallery)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                       
                        <td>
                            @foreach ($gallery->images as $image)
                            <img src="{{ asset('storage/' . $image->image_path) }}" alt="Gallery Image" style="max-width: 250px; margin-right: 10px;">
                            @endforeach
                        </td>
                        
                        <td>{{$gallery->year}}</td>
                        <td>
                            <a href="{{ route('landing.gallery.edit', $gallery->id) }}"
                                class="btn btn-warning btn-sm">Edit</a>
                            <form action="{{ route('landing.gallery.destroy', $gallery->id) }}" method="POST"
                                class="d-inline" onsubmit="return confirm('Are you sure?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
