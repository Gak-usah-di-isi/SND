@extends('auth.main')

@section('title')
    Register
@endsection

@section('content')
    <main class="container-fluid vh-100 p-0">
        <div class="row m-0 h-100">
            <section class="col-lg-6 d-flex align-items-center p-5 vh-100 position-relative overflow-hidden"
                style="background: #0d6dfc;">
                <div class="banner-content text-white position-relative" style="z-index: 2;">
                    <div class="px-4">
                        <h1 class="mb-4 display-4 font-weight-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                            {{ $conferenceTitle }}
                        </h1>
                        <p class="text-warning mt-3 d-flex align-items-center">
                            <i class="fas fa-info-circle mr-2"></i>
                            {{ $conferenceAbbreviation }}
                        </p>
                    </div>
                </div>
            </section>

            <section class="col-lg-6 d-flex align-items-center justify-content-center p-4 vh-100"
                style="background: #F1F1F1;">
                <div class="login-container w-100 px-4 py-2">
                    <header class="text-center">
                        <img src="{{ $logoPath }}" alt="Logo icasve" class="img-fluid mb-3 mt-3"
                            style="max-width: 180px;">
                    </header>
                    @if ($openRegistration)
                        <form method="POST" action="{{ route('register') }}">
                            @csrf
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb-4 ">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-transparent border-right-0">
                                                    <i class="fas fa-user text-primary"></i>
                                                </span>
                                            </div>
                                            <input type="text" name="name" id="name"
                                                class="form-control form-control-md border-left-0"
                                                placeholder="E.g. Dr. Budi Utomo, M.Sc." value="{{ old('name') }}"
                                                required />
                                        </div>
                                        @if ($errors->has('name'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('name') }}</span>
                                        @endif
                                    </div>

                                    <div class="form-group mb-4">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-transparent border-right-0">
                                                    <i class="fas fa-envelope text-primary"></i>
                                                </span>
                                            </div>
                                            <input type="email" name="email" id="email"
                                                class="form-control form-control-md border-left-0"
                                                placeholder="Email Address" value="{{ old('email') }}" required />
                                        </div>
                                        @if ($errors->has('email'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('email') }}</span>
                                        @endif
                                    </div>

                                    <div class="form-group mb-4">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-transparent border-right-0">
                                                    <i class="fas fa-lock text-primary"></i>
                                                </span>
                                            </div>
                                            <input type="password" name="password" id="password"
                                                class="form-control form-control-md border-left-0" placeholder="Password"
                                                required />
                                            <div class="input-group-append">
                                                <button type="button" class="btn  btn-outline-secondary toggle-password"
                                                    data-target="password">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                        @if ($errors->has('password'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('password') }}</span>
                                        @endif
                                    </div>


                                    <div class="form-group mb-4">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-transparent border-right-0">
                                                    <i class="fas fa-building text-primary"></i>
                                                </span>
                                            </div>
                                            <input type="text" name="institution" id="institution"
                                                class="form-control form-control-md border-left-0" placeholder="Institution"
                                                value="{{ old('institution') }}" required />
                                        </div>
                                        @if ($errors->has('institution'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('institution') }}</span>
                                        @endif
                                    </div>

                                    <div class="form-group mb-4">
                                        <select name="role_id" id="registration_type" class="form-control form-control-md"
                                            required>
                                            <option value="" disabled selected>Select Registration Type</option>
                                            @foreach ($role as $r)
                                                <option value="{{ $r->id }}"
                                                    {{ old('role_id') == $r->id ? 'selected' : '' }}>
                                                    {{ $r->display_name }}
                                                </option>
                                            @endforeach
                                        </select>
                                        @if ($errors->has('role_id'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('role_id') }}</span>
                                        @endif
                                    </div>

                                </div>

                                <div class="col-md-6">

                                    <div class="form-group mb-4">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-transparent border-right-0">
                                                    <i class="fas fa-phone text-primary"></i>
                                                </span>
                                            </div>
                                            <input type="tel" name="phone_number" id="phone_number"
                                                class="form-control form-control-md border-left-0"
                                                placeholder="Phone Number" value="{{ old('phone_number') }}" required />
                                        </div>
                                        @if ($errors->has('phone_number'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('phone_number') }}</span>
                                        @endif
                                    </div>
                                    <div class="form-group mb-4">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-transparent border-right-0">
                                                    <i class="fas fa-globe text-primary"></i>
                                                </span>
                                            </div>
                                            <select name="country" id="country"
                                                class="form-control form-control-md border-left-0" required>
                                                <option value="" disabled selected>Select Country</option>
                                                @foreach ($countries as $country)
                                                    <option value="{{ $country->name }}"
                                                        {{ old('country') == $country->name ? 'selected' : '' }}>
                                                        {{ $country->name }}
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        @if ($errors->has('country'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('country') }}</span>
                                        @endif
                                    </div>

                                    <div class="form-group mb-4">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-transparent border-right-0">
                                                    <i class="fas fa-lock text-primary"></i>
                                                </span>
                                            </div>
                                            <input type="password" name="password_confirmation"
                                                id="password_confirmation"
                                                class="form-control form-control-md border-left-0"
                                                placeholder="Confirm Password" required />
                                            <div class="input-group-append">
                                                <button type="button" class="btn btn-outline-secondary toggle-password">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                        @if ($errors->has('password_confirmation'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('password_confirmation') }}</span>
                                        @endif
                                    </div>

                                    <div class="form-group mb-4">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-transparent border-right-0">
                                                    <i class="fas fa-briefcase text-primary"></i>
                                                </span>
                                            </div>
                                            <input type="text" name="job_title" id="job_title"
                                                class="form-control form-control-md border-left-0" placeholder="Job Title"
                                                value="{{ old('job_title') }}" required />
                                        </div>
                                        @if ($errors->has('job_title'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('job_title') }}</span>
                                        @endif
                                    </div>


                                    <div class="form-group mb-4">
                                        <select name="attendance" id="attendance" class="form-control form-control-md"
                                            required>
                                            <option value="" disabled selected>Select Attendance Plan</option>
                                            <option value="onsite" {{ old('attendance') == 'onsite' ? 'selected' : '' }}>
                                                Onsite</option>
                                            <option value="online" {{ old('attendance') == 'online' ? 'selected' : '' }}>
                                                Online</option>
                                        </select>
                                        @if ($errors->has('attendance'))
                                            <span class="text-danger"
                                                style="font-size: 12px;">{{ $errors->first('attendance') }}</span>
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-block text-white mb-2 py-2"
                                style="background: #0d6dfc;;
                           border-radius: 15px; transition: all 0.3s ease;">
                                <i class="fas fa-sign-in-alt mr-2"></i>Register
                            </button>
                            <footer class="text-center">
                                <p>Already have an account? <a href="{{ route('login') }}"
                                        style="color: #0d6dfc;">Login</a>
                                </p>
                            </footer>
                        </form>
                    @else
                        <div class="alert alert-danger text-center shadow-sm p-3 rounded">
                            <h4 class="fw-bold mb-1">⚠ Registration Closed</h4>
                            <p class="mb-0">We’re sorry, but registration is currently closed.</p>
                        </div>
                        @if (session('error'))
                            <div class="alert alert-danger">
                                {{ session('error') }}
                            </div>
                        @endif
                    @endif
                </div>
            </section>
        </div>
    </main>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            document.querySelectorAll(".toggle-password").forEach(button => {
                button.addEventListener("click", function() {
                    let input = document.getElementById(this.getAttribute("data-target"));
                    let icon = this.querySelector("i");

                    if (input.type === "password") {
                        input.type = "text";
                        icon.classList.remove("fa-eye");
                        icon.classList.add("fa-eye-slash");
                    } else {
                        input.type = "password";
                        icon.classList.remove("fa-eye-slash");
                        icon.classList.add("fa-eye");
                    }
                });
            });
        });
    </script>
    <style>
        .input-group-text {
            border-radius: 15px 0 0 15px;
        }

        .form-control:focus {
            box-shadow: 0 0 0 0.2rem rgba(27, 94, 32, 0.25);
            border-color: #2E7D32;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(27, 94, 32, 0.2);
        }

        @media (max-width: 991.98px) {
            .vh-100 {
                height: auto !important;
                min-height: 50vh;
            }

            .login-container {
                padding: 15px;
            }

            .form-control,
            .input-group-text {
                font-size: 0.875rem;
            }

            button {
                font-size: 0.875rem;
                padding: 12px 20px;
            }

            .login-container {
                max-width: 100%;
            }
        }

        @media (max-width: 575.98px) {
            .display-4 {
                font-size: 1.5rem;
            }

            .p-5 {
                padding: 1rem !important;
            }

            .mb-5 {
                margin-bottom: 1rem !important;
            }

            .form-control,
            .input-group-text {
                font-size: 0.75rem;
            }

            button {
                font-size: 0.75rem;
                padding: 10px 15px;
            }
        }
    </style>
@endsection
