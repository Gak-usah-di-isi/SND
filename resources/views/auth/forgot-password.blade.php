@extends('auth.main')

@section('title')
    Forgot Password
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

                    <h4 class="text-center font-weight-bold mb-2">Forgot Password</h4>
                    <p class="text-center text-muted mb-4" style="font-size: 14px;">
                        Enter your email address and we will send you a password reset link.
                    </p>

                    @if (session('status'))
                        <div class="alert alert-success py-2" style="font-size: 14px;" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    <form method="POST" action="{{ route('password.email') }}">
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
                                    placeholder="example@gmail.com" value="{{ old('email') }}" required autofocus />
                            </div>
                            @if ($errors->has('email'))
                                <span class="text-danger" style="font-size: 12px;">{{ $errors->first('email') }}</span>
                            @endif
                        </div>

                        <button type="submit" class="btn btn-sm btn-block text-white mb-3 mb-md-4 py-2 py-md-2"
                            style="background: #0d6dfc; border-radius: 15px; transition: all 0.3s ease;">
                            <i class="fas fa-paper-plane mr-2"></i>Email Password Reset Link
                        </button>

                        <footer class="text-center">
                            <p>Remember your password? <a href="{{ route('login') }}" style="color: #0d6dfc;">Back to Login</a></p>
                        </footer>
                    </form>
                </div>
            </section>
        </div>
    </main>

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
