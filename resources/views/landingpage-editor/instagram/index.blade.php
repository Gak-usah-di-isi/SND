@extends('layouts.app')
@section('title', 'Instagram')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Instagram</h2>
        <hr class="border border-secondary">
        
        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <div class="d-flex justify-content-end mb-3">
            <a href="{{ route('landing.instagram.create') }}" class="btn btn-primary">Add Link</a>
        </div>

        <table class="table table-bordered table-striped">
            <thead class="table-success">
                <tr>
                    <th>No</th>
                    <th>Link</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($instagramLinks as $index => $link)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $link->link }}</td> 
                        
                        <td>
                            <a href="{{ route('landing.instagram.edit', $link->id) }}" class="btn btn-warning btn-sm">Edit</a>
                            <form action="{{ route('landing.instagram.destroy', $link->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Are you sure?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="3" class="text-center">No data</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
