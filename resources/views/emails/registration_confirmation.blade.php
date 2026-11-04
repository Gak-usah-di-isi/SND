<!DOCTYPE html>
<html>

<head>
    <title>Registration Confirmation</title>
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
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Registration Confirmation</h1>
        </div>
        <div class="email-body">
            <p>Dear Sir/Madam,</p>
            <p>Thank you for your registration for <strong>{{ $details['conference_title'] }}</strong>. Below are your
                registration details:</p>
            <p><strong>Name:</strong> {{ $details['name'] }}</p>
            <p><strong>Institution:</strong> {{ $details['institution'] }}</p>
            <p><strong>Job Title:</strong> {{ $details['job_title'] }}</p>
            <p><strong>Email Address:</strong> {{ $details['email'] }}</p>
            <p><strong>Password:</strong> {{ $details['password'] }}</p>
            <p><strong>Phone Number:</strong> {{ $details['phone_number'] }}</p>
            <p><strong>Registration Type:</strong> {{ $details['registration_type'] }}</p>

            @php
                $isPresenter = in_array($details['registration_type'], ['Indonesia-presenter', 'Foreign-presenter']);
            @endphp
            @if ($isPresenter)
                <p class="highlight">
                    The registered email and password are required for submitting your presentation abstract.<br>
                    If you choose to give a presentation, you must submit an abstract for review. Please visit the
                    following
                    page:<br>
                    <a href="{{ route('abstracts.index') }}">Submit Abstract</a>
                </p>
            @endif
            <p>All attendants are required to pay a registration fee. Payment instructions will be announced soon.</p>
        </div>
        <div class="email-footer">
            <p>Sincerely,<br>Committee Members,<br><strong>{{ $details['conference_title'] }}</strong></p>
        </div>
    </div>
</body>

</html>
