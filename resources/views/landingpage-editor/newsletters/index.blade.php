@extends('layouts.app')
@section('title', 'Newsletter Subscribers')
@section('content')
<div class="container">
    <h2>Newsletter Subscribers</h2>
    
    <div class="mb-3 d-flex gap-2">
        <a href="{{ route('landing.newsletters.create') }}" class="btn btn-success">Add Subscriber</a>
        <a href="{{ route('landing.newsletters.export') }}" class="btn btn-primary">Download Excel</a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="table-responsive">
        <table class="table table-bordered text-nowrap">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th style="width: 150px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($newsletters as $subscriber)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $subscriber->email }}</td>
                    <td class="d-flex gap-2">
                        <a href="{{ route('landing.newsletters.edit', $subscriber->id) }}" class="btn btn-primary btn-sm">
                            Edit
                        </a>
                        <form action="{{ route('landing.newsletters.destroy', $subscriber->id) }}" method="POST">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">
                                Delete
                            </button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    {{ $newsletters->links() }}
</div>
@endsection
