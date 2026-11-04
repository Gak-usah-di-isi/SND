<!DOCTYPE html>
<html>

<head>
    <title>Abstract Acceptance Confirmation</title>
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
            <h1>Abstract Acceptance Notification</h1>
        </div>
        <div class="email-body">
            <p>Dear {{ $user->name }},</p>
            <p>We are pleased to inform you that your submission has been <strong>accepted</strong> for the
                {{ $conference->conference_title }} ({{ $conference->conference_abbreviation }}). In conclusion of the
                rolling review process, {{ $conference->conference_abbreviation }} Program Committee is pleased to
                invite you to share the research findings at the conference by
                <strong>{{ $abstract->presentation_type }}</strong>.
            </p>

            <p>{!! nl2br(e($customMessage)) !!}</p>

            <p class="highlight">
                You can now proceed with your full paper submission and presentation preparation.<br>
                To review the guidelines, please visit:<br>
                <a href="{{ route('submission.fullpaper') }}">Full Paper Submission Guidelines</a>
            </p>

            <p>We look forward to your participation. Please contact us if you have any questions.</p>
        </div>
        <div class="email-footer">
            <p>Best regards,<br>Conference Committee<br><strong>{{ $conference->conference_title }}</strong></p>
        </div>
    </div>
</body>

</html>
