<!DOCTYPE html>
<html>

<head>
    <title>Reset Password Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 25px;
            border: 1px solid #ddd;
        }

        .email-header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #007bff;
        }

        .email-header h1 {
            font-size: 26px;
            margin: 0;
            color: #333;
        }

        .email-body {
            padding: 20px 10px;
            color: #555;
        }

        .email-body p {
            margin: 10px 0;
        }

        .email-body strong {
            color: #222;
        }

        .email-footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #007bff;
            text-align: center;
            font-size: 13px;
            color: #666;
        }

        a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }

        a:hover {
            text-decoration: underline;
        }

        .highlight {
            background-color: #f8f9fa;
            padding: 12px 15px;
            border-radius: 5px;
            font-size: 14px;
            border-left: 4px solid #007bff;
        }

        .btn-reset {
            background-color: #0d6dfc;
            color: #ffffff !important;
            padding: 12px 28px;
            text-decoration: none !important;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
            box-shadow: 0 4px 6px rgba(13, 109, 252, 0.2);
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Reset Password Notification</h1>
        </div>
        <div class="email-body">
            <p>Dear {{ $user->name ?? 'User' }},</p>
            <p>You are receiving this email because we received a password reset request for your account on <strong>{{ $conferenceTitle }}</strong>.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $url }}" class="btn-reset">Reset Password</a>
            </div>

            <p class="highlight">
                This password reset link will expire in {{ $count }} minutes.<br>
                If you did not request a password reset, no further action is required.
            </p>

            <p style="font-size: 12px; color: #777; margin-top: 25px; word-break: break-all;">
                If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:<br>
                <a href="{{ $url }}" style="color: #0d6dfc;">{{ $url }}</a>
            </p>
        </div>
        <div class="email-footer">
            <p>Sincerely,<br>Committee Members,<br><strong>{{ $conferenceTitle }}</strong></p>
        </div>
    </div>
</body>

</html>
