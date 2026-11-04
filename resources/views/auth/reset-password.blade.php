@extends('auth.main')

@section('title')
    Reset Password
@endsection

@section('content')
    <main class="container-fluid vh-100 p-0">
        <div class="row m-0 h-100">
            <section class="col-lg-6 d-flex align-items-center p-5 vh-100 position-relative overflow-hidden"
                style="background: #0d6dfc;">
                <div class="banner-content text-white position-relative" style="z-index: 2;">
                    <div class="px-4">
                        <h1 class="mb-4 display-4 font-weight-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                            {{ $conferenceTitle ?? 'ICASVE' }}
                        </h1>
                        <p class="text-warning mt-3 d-flex align-items-center">
                            <i class="fas fa-info-circle mr-2"></i>
                            {{ $conferenceAbbreviation ?? 'ICASVE' }}
                        </p>
                    </div>
                </div>
            </section>

            <section class="col-lg-6 d-flex align-items-center justify-content-center p-4 vh-100"
                style="background: #F1F1F1;">
                <div class="login-container w-100 p-3" style="max-width: 450px;">
                    <header class="text-center">
                        <img src="{{ $logoPath ?? asset('img/Logo_ICASVE_rmbg.png') }}" alt="Logo icasve" class="mb-3 img-fluid" style="max-width: 150px;">
                    </header>

                    <h4 class="text-center font-weight-bold mb-2">Reset Password</h4>
                    <p class="text-center text-muted mb-4" style="font-size: 14px;">
                        Enter your email and create a new password for your account.
                    </p>

                    <form method="POST" action="{{ route('password.store') }}">
                        @csrf
                        <input type="hidden" name="token" value="{{ $request->route('token') ?? $token ?? '' }}">

                        <div class="form-group mb-3">
                            <label class="form-label" for="email">Email</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-transparent border-right-0">
                                        <i class="fas fa-envelope text-primary"></i>
                                    </span>
                                </div>
                                <input type="email" id="email" name="email"
                                    class="form-control form-control-md border-left-0"
                                    placeholder="example@gmail.com" value="{{ old('email', $request->email ?? $email ?? '') }}" required autofocus />
                            </div>
                            @if ($errors->has('email'))
                                <span class="text-danger" style="font-size: 12px;">{{ $errors->first('email') }}</span>
                            @endif
                        </div>

                        <div class="form-group mb-3">
                            <label class="form-label" for="password">New Password</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-transparent border-right-0">
                                        <i class="fas fa-lock text-primary"></i>
                                    </span>
                                </div>
                                <input type="password" id="password" name="password"
                                    class="form-control form-control-md border-left-0" placeholder="New Password" required />
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-outline-secondary toggle-password" data-target="password">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            @if ($errors->has('password'))
                                <span class="text-danger" style="font-size: 12px;">{{ $errors->first('password') }}</span>
                            @endif
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="password_confirmation">Confirm Password</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-transparent border-right-0">
                                        <i class="fas fa-lock text-primary"></i>
                                    </span>
                                </div>
                                <input type="password" id="password_confirmation" name="password_confirmation"
                                    class="form-control form-control-md border-left-0" placeholder="Confirm Password" required />
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-outline-secondary toggle-password" data-target="password_confirmation">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            @if ($errors->has('password_confirmation'))
                                <span class="text-danger" style="font-size: 12px;">{{ $errors->first('password_confirmation') }}</span>
                            @endif
                        </div>

                        <button type="submit" class="btn btn-sm btn-block text-white mb-3 mb-md-4 py-2 py-md-2"
                            style="background: #0d6dfc; border-radius: 15px; transition: all 0.3s ease;">
                            <i class="fas fa-key mr-2"></i>Reset Password
                        </button>

                        <footer class="text-center">
                            <p>Back to <a href="{{ route('login') }}" style="color: #0d6dfc;">Login</a></p>
                        </footer>
                    </form>
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
    </style>
@endsection
