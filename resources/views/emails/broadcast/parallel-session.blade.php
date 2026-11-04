<!DOCTYPE html>
<html>

<head>
    <title>{{ $conference->conference_abbreviation ?? 'ICASVE' }} Parallel Session Schedule</title>
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
            background-color: #fff;
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
            font-size: 24px;
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

        ul {
            margin: 10px 0 10px 20px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>{{ $conference->conference_abbreviation ?? 'ICASVE' }} Parallel Session Schedule</h1>
        </div>
        <div class="email-body">
            <p>Subject: <strong>{{ $subject }}</strong></p>
            <p>Dear Presenters,</p>
            <p>
                Warm greetings from the {{ $conference->conference_abbreviation ?? 'ICASVE' }} Committee.<br>
                We are pleased to inform you that you are scheduled to present your research during the Parallel
                Presentation Sessions (on-site and online) at the {{ $conference->conference_title ?? 'conference' }}.
            </p>
            <p>
                Please find your detailed presentation schedule in the attached document.
            </p>
            @if (count($importantNotes))
                <p><strong>Important Notes:</strong></p>
                <ul>
                    @foreach ($importantNotes as $note)
                        <li>{{ $note }}</li>
                    @endforeach
                </ul>
            @endif
            @if (count($onlineGuidelines))
                <p><strong>For online presenters, please adhere to the following guidelines:</strong></p>
                <ul>
                    @foreach ($onlineGuidelines as $guideline)
                        <li>{{ $guideline }}</li>
                    @endforeach
                </ul>
            @endif
            @if ($submissionFormUrl)
                <p>
                    All presenter must submit presentation material file via the following google form:<br>
                    <a href="{{ $submissionFormUrl }}" target="_blank">{{ $submissionFormUrl }}</a>
                </p>
            @endif
            <p>
                Should you have any questions or need further assistance, please do not hesitate to contact us via email
                or visit our official conference website:<br>
                <a href="https://icasve.ub.ac.id" target="_blank">https://icasve.ub.ac.id</a>
            </p>
            <p>
                We look forward to your meaningful contribution and active participation in this international academic
                event.
            </p>
        </div>
        <div class="email-footer">
            <p>Best regards,<br>Conference Committee<br><strong>{{ $conference->conference_title }}</strong></p>
        </div>
    </div>
</body>

</html>
