@extends('layouts.app')
@section('title', 'Add Subscriber')
@section('content')
<div class="container">
    <h2>Add Subscriber</h2>

    <form action="{{ route('landing.newsletters.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input type="email" name="email" class="form-control" required>
            @error('email') <span class="text-danger">{{ $message }}</span> @enderror
        </div>
        <button type="submit" class="btn btn-success">Subscribe</button>
        <a href="{{ route('landing.newsletters.index') }}" class="btn btn-secondary">Back</a>
    </form>
</div>
@endsection
