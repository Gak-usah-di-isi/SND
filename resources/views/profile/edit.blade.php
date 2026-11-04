@extends('layouts.app')

@section('title', 'Profile')

@section('content')
    <div class="container py-5">
        <h4 class="mb-4">
            <span class="text-muted">Account Settings /</span> Account
        </h4>

        <div class="card mb-4">
            <div class="card-header">Profile Details</div>
            <div class="card-body">
                <form method="post" action="{{ route('profile.uploadPhoto') }}" enctype="multipart/form-data"
                    class="d-flex align-items-start gap-3">
                    @csrf
                    <img src="{{ $user->profile_photo_path ? asset('storage/' . $user->profile_photo_path) : asset('./img/default-avatar.jpeg') }}"
                        alt="user-avatar" class="rounded-circle" height="100" width="100" id="uploadedAvatar">
                    <div id="file-name" class="text-muted small"></div>
                    <div class="d-flex flex-column gap-2">
                        <label for="upload" class="btn btn-primary">
                            Upload new photo
                            <input type="file" name="image" id="upload" class="d-none"
                                accept="image/png, image/jpeg" required
                                onchange="document.getElementById('file-name').textContent = this.files[0].name">
                        </label>
                        <button type="submit" class="btn btn-primary">Save</button>
                        <small class="text-muted">Allowed JPG, JPEG, or PNG</small>
                    </div>
                </form>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <form method="post" action="{{ route('profile.update') }}" class="row g-3">
                    @csrf
                    @method('patch')
                    <div class="col-md-6">
                        <label for="name" class="form-label">Name</label>
                        <input id="name" name="name" type="text" class="form-control"
                            value="{{ old('name', $user->name) }}" required autofocus>
                        @error('name')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="col-md-6">
                        <label for="name_certificate" class="form-label">Name Certificate</label>
                        <input id="name_certificate" name="name_certificate" type="text" class="form-control"
                            value="{{ old('name_certificate', $user->name_certificate) }}" required autofocus>
                        @error('name_certificate')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="col-md-6">
                        <label for="email" class="form-label">Email</label>
                        <input id="email" name="email" type="email" class="form-control"
                            value="{{ old('email', $user->email) }}" required>
                        @error('email')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">Change Password</div>
            <div class="card-body">
                <form method="post" action="{{ route('password.update') }}" class="row g-3">
                    @csrf
                    @method('put')
                    <div class="col-md-4">
                        <label for="current_password" class="form-label">Current Password</label>
                        <input id="current_password" name="current_password" type="password" class="form-control">
                    </div>
                    <div class="col-md-4">
                        <label for="password" class="form-label">New Password</label>
                        <input id="password" name="password" type="password" class="form-control">
                    </div>
                    <div class="col-md-4">
                        <label for="password_confirmation" class="form-label">Confirm Password</label>
                        <input id="password_confirmation" name="password_confirmation" type="password" class="form-control">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header">Delete Account</div>
            <div class="card-body">
                <p class="text-muted">Once your account is deleted, all of its resources and data will be permanently
                    deleted.</p>
                <form method="post" action="{{ route('profile.destroy') }}" id="delete-account-form">
                    @csrf
                    @method('delete')
                    <button type="button" class="btn btn-danger" id="delete-account-btn">Delete Account</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('delete-account-btn').addEventListener('click', function() {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                document.getElementById('delete-account-form').submit();
            }
        });
    </script>
@endsection
