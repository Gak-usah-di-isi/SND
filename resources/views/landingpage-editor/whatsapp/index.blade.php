@extends('layouts.app')
@section('title', 'Whatsapp')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5 fw-bold">Whatsapp</h2>
        <hr class="border border-secondary">
        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        <div class="d-flex justify-content-end mb-3">
            <a href="{{ route('landing.whatsapp.create') }}" class="btn btn-primary">Add Number</a>
        </div>
        <table class="table table-bordered table-striped">
            <thead class="table-success">
                <tr>
                    <th>No</th>
                    <th>Number</th>  
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($whatsapp as $index => $number)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $number->nomor }}</td>    
                        <td>
                            <a href="{{ route('landing.whatsapp.edit', $number->id) }}"
                                class="btn btn-warning btn-sm">Edit</a>
                            <form action="{{ route('landing.whatsapp.destroy', $number->id) }}" method="POST"
                                class="d-inline" onsubmit="return confirm('Are you sure?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="3" class="text-center">No data available</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection