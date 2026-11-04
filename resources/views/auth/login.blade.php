@extends('auth.main')

@section('title')
    Login
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
                <div class="login-container w-100 p-3 "style="max-width: 450px;">
                    <header class="text-center">
                        <img src="{{ $logoPath }}" alt="Logo icasve" class="mb-3 img-fluid" style="max-width: 150px;">
                    </header>
                    <form method="POST" action="{{ route('login') }}">
                        @csrf
                        <div class="form-group mb-3 mb-md-4">
                            <label class="form-label" for="email">Email</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-transparent border-right-0">
                                        <i class="fas fa-envelope text-primary"></i>
                                    </span>
                                </div>
                                <input type="email" id="email" name="email"
                                    class="form-control form-control-md border-left-0"
                                    placeholder="example@gmail.com" value="{{ old('email') }}" required />
                            </div>
                            @if ($errors->has('email'))
                                <span class="text-danger" style="font-size: 12px;">{{ $errors->first('email') }}</span>
                            @endif
                        </div>

                        <div class="form-group mb-3 mb-md-4">
                            <label class="form-label" for="password">Password</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-transparent border-right-0">
                                        <i class="fas fa-lock text-primary"></i>
                                    </span>
                                </div>
                                <input type="password" id="password" name="password"
                                    class="form-control form-control-md border-left-0" placeholder="Password" required />
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-outline-secondary toggle-password"
                                        data-target="password">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            @if ($errors->has('password'))
                                <span class="text-danger" style="font-size: 12px;">{{ $errors->first('password') }}</span>
                            @endif
                        </div>

                        <div class="d-flex justify-content-end mb-3">
                            <a href="{{ route('password.request') }}" style="color: #0d6dfc; font-size: 14px;">Forgot password?</a>
                        </div>

                        <button type="submit" class="btn btn-sm btn-block text-white mb-3 mb-md-4 py-2 py-md-2"
                            style="background: #0d6dfc;
                           border-radius: 15px; transition: all 0.3s ease;">
                            <i class="fas fa-sign-in-alt mr-2"></i>Login
                        </button>
                        <footer class="text-center">
                            <p>Don't have an account? <a href="{{ route('register') }}" style="color: #0d6dfc;">Register</a>
                            </p>
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
