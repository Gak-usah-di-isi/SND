<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify Email</title>
</head>
<body>
    <main>
        <h1>Verify your email address</h1>
        <p>
            Thanks for signing up! Before getting started, please verify your email address by clicking
            the link we just emailed to you. If you did not receive the email, we can send you another.
        </p>

        @if (session('status') == 'verification-link-sent')
            <p>A new verification link has been sent to the email address you provided during registration.</p>
        @endif

        <form method="POST" action="{{ route('verification.send') }}">
            @csrf
            <button type="submit">Resend Verification Email</button>
        </form>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit">Log Out</button>
        </form>
    </main>
</body>
</html>
