@extends('layouts.app')
@section('title', 'Edit Subscriber')
@section('content')
<div class="container">
    <h2>Edit Subscriber</h2>

    <form action="{{ route('landing.newsletters.update', $newsletter->id) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input type="email" name="email" class="form-control" value="{{ $newsletter->email }}" required>
            @error('email') <span class="text-danger">{{ $message }}</span> @enderror
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('landing.newsletters.index') }}" class="btn btn-secondary">Back</a>
    </form>
</div>
@endsection
