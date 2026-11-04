@extends('layouts.app')

@section('title', 'Edit Participant')

@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Edit Participant</h4>
                <form class="forms-sample" action="{{ route('admin.participant.update', $user->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control @error('name') is-invalid @enderror" id="name"
                            name="name" value="{{ old('name', $user->name) }}" placeholder="Name" required>
                        @error('name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="name_certificate">Name on Certificate</label>
                        <input type="text" class="form-control @error('name_certificate') is-invalid @enderror"
                            id="name_certificate" name="name_certificate"
                            value="{{ old('name_certificate', $user->name_certificate) }}" placeholder="Name on Certificate"
                            required>
                        @error('name_certificate')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control @error('email') is-invalid @enderror" id="email"
                            name="email" value="{{ old('email', $user->email) }}" placeholder="Email" required>
                        @error('email')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="institution">Institution</label>
                        <input type="text" class="form-control @error('institution') is-invalid @enderror"
                            id="institution" name="institution" value="{{ old('institution', $user->institution) }}"
                            placeholder="Institution" required>
                        @error('institution')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="job_title">Job Title</label>
                        <input type="text" class="form-control @error('job_title') is-invalid @enderror" id="job_title"
                            name="job_title" value="{{ old('job_title', $user->job_title) }}" placeholder="Job Title"
                            required>
                        @error('job_title')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Phone Number</label>
                        <input type="text" class="form-control @error('phone_number') is-invalid @enderror"
                            id="phone_number" name="phone_number" value="{{ old('phone_number', $user->phone_number) }}"
                            placeholder="Phone Number" required>
                        @error('phone_number')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Country</label>
                        <select name="country" id="country" class="form-control form-control-md border-left-0" required>
                            <option value="{{ old('country', $user->country) }}" selected>
                                {{ old('country', $user->country) }}
                            </option>
                        </select>
                        @if ($errors->has('country'))
                            <span class="text-danger" style="font-size: 12px;">{{ $errors->first('country') }}</span>
                        @endif
                    </div>
                    <div class="form-group">
                        <label for="attendance">Attendance Type</label>
                        <select class="form-control @error('attendance') is-invalid @enderror" id="attendance"
                            name="attendance" required>
                            <option value="">-- Select Attendance Type --</option>
                            <option value="onsite"
                                {{ old('attendance', $user->attendance) == 'onsite' ? 'selected' : '' }}>
                                Onsite
                            </option>
                            <option value="online"
                                {{ old('attendance', $user->attendance) == 'online' ? 'selected' : '' }}>
                                Online
                            </option>
                        </select>
                        @error('attendance')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="role_id">Role</label>
                        <select class="form-control @error('role_id') is-invalid @enderror" id="role_id" name="role_id"
                            required>
                            <option value="">-- Select Role --</option>
                            @foreach ($roles as $role)
                                <option value="{{ $role->id }}"
                                    {{ old('role_id', $user->roles->first()->id ?? '') == $role->id ? 'selected' : '' }}>
                                    {{ $role->display_name }}
                                </option>
                            @endforeach
                        </select>
                        @error('role_id')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <button type="submit" class="btn btn-primary mr-2">Update</button>
                    <a href="{{ route('admin.participant.index') }}" class="btn btn-light">Cancel</a>
                </form>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            fetch("https://restcountries.com/v3.1/all")
                .then(response => response.json())
                .then(data => {
                    let countrySelect = document.getElementById("country");
                    data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                    data.forEach(country => {
                        let option = document.createElement("option");
                        option.value = country.name.common;
                        option.textContent = country.name.common;
                        countrySelect.appendChild(option);
                    });
                })
                .catch(error => console.error("Error fetching country data:", error));
        });
    </script>
@endsection
