@extends('layouts.app')

@section('title', 'Register New Participants')

@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Register New Participants</h4>
                <form class="forms-sample" action="{{ route('admin.participant.store') }}" method="POST">
                    @csrf
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control @error('name') is-invalid @enderror" id="name"
                            name="name" value="{{ old('name') }}" placeholder="E.g. Dr. Budi Utomo, M.Sc." required>
                        @error('name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="name_certificate">Name on Certificate</label>
                        <input type="text" class="form-control @error('name_certificate') is-invalid @enderror"
                            id="name_certificate" name="name_certificate" value="{{ old('name_certificate') }}"
                            placeholder="E.g. Dr. Budi Utomo, M.Sc." required>
                        @error('name_certificate')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="name">Email address</label>
                        <input type="email" class="form-control @error('email') is-invalid @enderror" id="email"
                            name="email" value="{{ old('email') }}" placeholder="E.g. budiutomo@gmail.com" required>
                        @error('email')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control @error('password') is-invalid @enderror" id="password"
                            name="password" placeholder="Password" required>
                        @error('password')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="password_confirmation">Confirm Password</label>
                        <input type="password" class="form-control @error('password_confirmation') is-invalid @enderror"
                            id="password_confirmation" name="password_confirmation" placeholder="Confirm Password" required>
                        @error('password_confirmation')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="institution">Institution</label>
                        <input type="text" class="form-control @error('institution') is-invalid @enderror"
                            id="institution" name="institution" value="{{ old('institution') }}"
                            placeholder="E.g. Faculty of Science, Brawijaya University" required>
                        @error('institution')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="job_title">Job Title</label>
                        <input type="text" class="form-control @error('job_title') is-invalid @enderror" id="job_title"
                            name="job_title" value="{{ old('job_title') }}" placeholder="E.g. Professor, PhD student, etc."
                            required>
                        @error('job_title')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Phone Number</label>
                        <input type="text" class="form-control @error('phone_number') is-invalid @enderror"
                            id="phone_number" name="phone_number" value="{{ old('phone_number') }}"
                            placeholder="Phone Number" required>
                        @error('phone_number')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Country</label>
                        <select name="country" id="country" class="form-control form-control-md border-left-0" required>
                            <option value="" disabled selected>Select Country</option>
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

                            @if ($conferenceSetting->attendance_format === 'hybrid' || $conferenceSetting->attendance_format === 'onsite')
                                <option value="onsite" {{ old('attendance') == 'onsite' ? 'selected' : '' }}>Onsite
                                </option>
                            @endif

                            @if ($conferenceSetting->attendance_format === 'hybrid' || $conferenceSetting->attendance_format === 'online')
                                <option value="online" {{ old('attendance') == 'online' ? 'selected' : '' }}>Online
                                </option>
                            @endif
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
                                <option value="{{ $role->id }}" {{ old('role_id') == $role->id ? 'selected' : '' }}>
                                    {{ $role->display_name }}
                                </option>
                            @endforeach
                        </select>
                        @error('role_id')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <button type="submit" class="btn btn-primary mr-2">Submit</button>
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
